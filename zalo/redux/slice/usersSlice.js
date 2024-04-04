import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import config from '../../config';

const userListSlice = createSlice({
    name: 'users',
    initialState: { data: [], loading: 0 },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = 2;
            })
            .addCase(fetchUsers.pending, (state, action) => {
                state.loading = 1;
            })
            .addCase(reportUserByMessage.fulfilled, (state, action) => {
                try {
                    Alert.alert('Thông báo', 'Bạn đã gửi báo cáo thành công vui lòng đợi quản trị duyệt!');
                    const { navigation } = action.payload;
                    navigation.goBack();
                } catch (error) {
                    console.warn('Lỗi báo cáo tin nhắn', error)
                }
            })
            .addCase(reportUserByMessage.pending, (state, action) => {
                Alert.alert('Đang gửi ...');
            })
            .addCase(reportUserByMessage.rejected, (state, action) => {
                Alert.alert('Thông báo', 'Gửi báo cáo thất bại vui lòng kiểm tra lại đường truyền!');
            });
    },
});

/**
 * get all users from server
 */
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const res = await fetch(`${config.LINK_API}/users`);
        const users = await res.json();
        return users.data;
    } catch (err) {
        console.log(`err fetch users: ${err}`);
    }
});

/**
 * report user by message
 * @param messageId
 * @param fileImage
 */
export const reportUserByMessage = createAsyncThunk('users/reportUserByMessage', async (data) => {
    try {
        const { imageLink, messageId, contentReport, senderId, navigation } = data;
        let uriParts = imageLink.split('.');
        const path = imageLink.split('/');
        let fileType = uriParts[uriParts.length - 1];
        let nameFile = path[path.length - 1];

        const image = {
            uri: imageLink,
            type: `image/${fileType}`,
            name: nameFile,
        };

        const formData = new FormData();
        formData.append('fileImage', image);
        formData.append('messageId', messageId);
        formData.append('content', contentReport);
        formData.append('senderID', senderId);

        const res = await fetch(`${config.LINK_API}/reports`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        const report = await res.json();
        if (report?.id) {
            return { ...report, navigation };
        }
    } catch (error) {
        console.log(`err reportUserByMessage: ${err}`);
    }
});

export default userListSlice;
