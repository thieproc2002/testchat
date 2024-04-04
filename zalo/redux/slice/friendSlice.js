import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import config, { socket } from '../../config';

const friendListSlice = createSlice({
    name: 'friends',
    initialState: {
        data: [],
        friendId: null,
        userId: null,
        phoneNumbers: [],
        friendOnline: [],
        friendRequestSends: [],
    },
    reducers: {
        clickSendChat: (state, action) => {
            state.friendId = action.payload;
        },
        friendRequestReceiverSocket: (state, action) => {
            const _request = action.payload;
            const isExist = state.data.some((request) => request.idFriendRequest === _request.idFriendRequest);
            if (!isExist) state.data.push(_request);
        },
        receiveFriendOnlineWithSocket: (state, action) => {
            state.friendOnline = action.payload;
        },
        removeFriendRequestSocket: (state, action) => {
            const id = action.payload;
            const index = state.data.findIndex((request) => request.idFriendRequest === id);
            state.data.splice(index, 1);
        },
        updateFriendRequestSendFromSocket: (state, action) => {
            const id = action.payload;
            //    console.log('id -> ', id);

            const index = state.friendRequestSends.findIndex((request) => request.idFriendRequest === id);
            // console.log('index ->', index);
            if (index > -1) state.friendRequestSends.splice(index, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFriendsRequest.fulfilled, (state, action) => {
                if (action.payload) {
                    state.friendRequestSends.push(action.payload.data);
                    socket.emit('send_friend_request', { request: action.payload.data });
                } else console.warn('exists request!');
            })
            .addCase(fetchLoadFriendsRequest.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addCase(fetchListFriendRequestSent.fulfilled, (state, action) => {
                //console.log('request', action.payload);
                state.friendRequestSends = action.payload;
                //state.data = action.payload;
            })
            .addCase(fetchBackFriendRequest.fulfilled, (state, action) => {
                const { data, deleted } = action.payload;
                socket.emit('recall_friend_request', { deleted });
                state.friendRequestSends = data;
            })
            .addCase(fetchHandleFriendsRequest.fulfilled, (state, action) => {
                const { friendRequestID, listFriendsReceiver, listFriendsSender, sender, receiver, conversation } =
                    action.payload;
                //console.log('conversation accept ->', conversation);
                const index = state.data.findIndex((request) => request.idFriendRequest === friendRequestID);
                state.data.splice(index, 1);

                if (friendRequestID && listFriendsReceiver && listFriendsSender && sender && receiver && conversation) {
                    socket.emit('accept_friend_request', {
                        listFriendsReceiver,
                        listFriendsSender,
                        sender,
                        receiver,
                        conversation,
                    });
                } else {
                    socket.emit('cancel_friend_request', { data: action.payload });
                }
            });
    },
});

export const fetchFriendsRequest = createAsyncThunk('friends/fetchFriendsRequest', async (data) => {
    try {
        const res = await fetch(`${config.LINK_API}/friendRequests/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const friendRequest = await res.json();
        if (friendRequest?.data) return friendRequest;
        return null;
    } catch (err) {
        console.warn(`[fetchFriendsRequest]: ${err}`);
    }
});

export const fetchLoadFriendsRequest = createAsyncThunk('friends/fetchLoadFriendsRequest', async (id) => {
    if (id) {
        try {
            const res = await fetch(`${config.LINK_API}/friendRequests/get-list-request/${id}`);
            const allFriendRequest = await res.json();
            // console.log("----allFriendRequest",allFriendRequest);
            return allFriendRequest.data;
        } catch (err) {
            console.warn(`[fetchLoadFriendsRequest]: ${err}`);
        }
    }
});

export const fetchHandleFriendsRequest = createAsyncThunk('friends/fetchHandleFriendsRequest', async (data) => {
    try {
        const { idFriendRequest } = data;

        const { status, senderID, receiverID } = data;

        const res = await fetch(`${config.LINK_API}/friendRequests/friend-request/${idFriendRequest}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, senderID, receiverID }),
        });
        const request = await res.json();
        // console.log('result accept', request);
        return request;
    } catch (err) {
        console.warn(`[fetchHandleFriendsRequest]: ${err}`);
    }
});

export const fetchBackFriendRequest = createAsyncThunk('friends/fetchBackFriendRequest', async (data) => {
    try {
        const { friendRequestID } = data;
        const { status, senderID } = data;

        const res = await fetch(`${config.LINK_API}/friendRequests/${friendRequestID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, senderID }),
        });
        const dataBackFriendsRequest = await res.json();
        return dataBackFriendsRequest;
    } catch (err) {
        console.warn(`[fetchBackFriendRequest]: ${err}`);
    }
});

export const fetchListFriendRequestSent = createAsyncThunk('friends/fetchListFriendRequestSent', async (id) => {
    if (id) {
        try {
            const res = await fetch(`${config.LINK_API}/friendRequests/get-of-me/${id}`);
            const allFriendRequestSent = await res.json();
            return allFriendRequestSent;
        } catch (err) {
            console.warn(`[fetchListFriendRequestSent]: ${err}`);
        }
    }
});

export default friendListSlice;
