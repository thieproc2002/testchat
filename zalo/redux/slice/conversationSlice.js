import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwtDecode from 'jwt-decode';
import config, { socket, createFormDataUpdateAvatarGroup } from '../../config';
import { getItem } from '../../utils/asyncStorage';

const conversationsSlice = createSlice({
    name: 'conversations',
    initialState: {
        data: [],
        members: [],
        blockBy: [],
        conversationId: null,
        loading: false,
        newGroup: null,
        dataLocal: [],
    },
    reducers: {
        clickGroupChat: (state, action) => {
            state.conversationId = action.payload;
        },
        getMembers: (state, action) => {
            state.members = action.payload;
        },
        getBlockBy: (state, action) => {
            state.blockBy = action.payload;
        },
        addConversationFromSocket: (state, action) => {
            const conversationExist = state.data.find((conversation) => conversation.id === action.payload.id);
            // console.log('conversationExist -> ', conversationExist);
            if (!conversationExist && action.payload.isGroup) {
                state.data.unshift(action.payload);
                state.dataLocal = state.data;
            } else if (!action.payload.isGroup) {
                state.data.unshift(action.payload);
                state.dataLocal = state.data;
            }
        },
        updateLastMessageOfConversation: (state, action) => {
            const conversationTemp = action.payload;
            //find and update
            const _conversation = state.dataLocal.find(
                (conversation) => conversation.id === conversationTemp.conversationID,
            );

            if (_conversation) {
                if (conversationTemp?.name) {
                    _conversation.name = conversationTemp.name;
                }
                if (conversationTemp?.imageLink) {
                    _conversation.imageLinkOfConver = conversationTemp.imageLink;
                }
                if (conversationTemp?.members) {
                    _conversation.members = conversationTemp.members;
                    state.members = conversationTemp.members;
                }
                _conversation.content = conversationTemp.contentMessage || conversationTemp.content;
                _conversation.time = conversationTemp.createAt;

                //find index and slice
                const _conversationIndex = state.data.findIndex(
                    (conversation) => conversation.id === conversationTemp.conversationID,
                );

                // //cut
                if (_conversationIndex > -1) {
                    state.data.splice(_conversationIndex, 1);
                }

                //insert first
                state.data.unshift(_conversation);
            }
        },
        removeConversationThenRemoveUserInGroup: (state, action) => {
            //find index and slice
            const _conversationIndex = state.data.findIndex((conversation) => conversation.id === action.payload);
            //cut
            state.data.splice(_conversationIndex, 1);
        },
        resetConversation: (state, action) => {
            state.data = action.payload;
        },
        updateBlockChat: (state, action) => {
            const dataBlock = action.payload;
            handleUpdateBlockChat(state, dataBlock, 'socket');
        },
        resetNewGroup: (state, action) => {
            state.newGroup = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.fulfilled, (state, action) => {
                if (action.payload) {
                    state.data = action.payload;
                    state.dataLocal = action.payload;
                    state.loading = false;
                } else {
                    console.warn('fetch conversations error!');
                }
            })
            .addCase(fetchConversations.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchCreateGroupChat.fulfilled, (state, action) => {
                state.newGroup = action.payload;
                state.data.unshift(action.payload);
                // state.isCreating = true;
                //console.log('create_group ->', action.payload);
                socket.emit('create_group', { conversation: action.payload });
            })
            .addCase(fetchAddMembers.fulfilled, (state, action) => {
                state.newGroup = action.payload;
                const info = action.payload;
                socket.emit('add_user_to_group', { info });
            })
            .addCase(fetchChangeNameGroup.fulfilled, (state, action) => {
                const conversation = action.payload;
                //console.log('change name ---> ', conversation);
                socket.emit('change_name_group', { conversation });
            })
            .addCase(fetchRemoveMember.fulfilled, (state, action) => {
                const memberRemove = action.payload;
                //remove member
                const index = state.members.findIndex((mem) => mem === memberRemove.idMember);
                state.members.splice(index, 1);
                socket.emit('block_user_in_group', { info: memberRemove });
            })
            .addCase(fetchOutGroup.fulfilled, (state, action) => {
                const info = action.payload;
                //console.log('info out group --->', info);
                socket.emit('user_out_group', { info });
            })
            .addCase(fetchUpdateAvatarGroup.fulfilled, (state, action) => {
                const conversation = action.payload;
                socket.emit('change_avatar_group', { conversation });
            })
            .addCase(fetchDeleteConversations.fulfilled, (state, action) => {
                const info = action.payload;
                socket.emit('remove_group', { info });
            })
            .addCase(fetchBlockConversation.fulfilled, (state, action) => {
                const blockByFetch = action.payload;
                //console.log(blockByFetch);
                socket.emit('block_message_user_in_group', { info: blockByFetch });

                handleUpdateBlockChat(state, blockByFetch);
            })
            .addCase(fetchUnBlockConversation.fulfilled, (state, action) => {
                const unBlockByFetch = action.payload;
                socket.emit('block_message_user_in_group', { info: unBlockByFetch });
                handleUpdateBlockChat(state, unBlockByFetch);
            })
            .addCase(fetchDeleteConversationYourSide.fulfilled, (state, action) => {
                const { id } = action.payload;
                const index = state.data.findIndex((_conversation) => _conversation.id === id);
                // console.log('index remove', index);
                if (index > -1) state.data.splice(index, 1);
            });
    },
});

const handleUpdateBlockChat = (state, dataBlock, key = 'none') => {
    //update state this user
    state.blockBy = dataBlock.blockBy;

    const conversationId = key === 'none' ? dataBlock.id : dataBlock.conversationId;
    //find and assign
    const conversation = state.data.find((item) => item.id === conversationId);
    if (conversation) conversation.blockBy = dataBlock.blockBy;

    //find index and cut and update
    const index = state.data.findIndex((item) => item.id === conversationId);
    if (index > -1) {
        state.data.splice(index, 1);
        state.data.unshift(conversation);
    }

    const conversationLocal = state.dataLocal.find((item) => item.id === conversationId);
    if (conversationLocal) conversationLocal.blockBy = dataBlock.blockBy;

    const indexLocal = state.dataLocal.findIndex((item) => item.id === conversationId);

    if (indexLocal > -1) {
        state.dataLocal.splice(indexLocal, 1);
        state.dataLocal.unshift(conversationLocal);
    }
};

/**
 * get success full conversation of account user by id
 */
export const fetchConversations = createAsyncThunk('conversations/fetchConversations', async () => {
    try {
        const token = await getItem('user_token');
        const { _id } = jwtDecode(token);
        const res = await fetch(`${config.LINK_API}/conversations/${_id}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const conversations = await res.json();
        if (conversations?.error) {
            console.warn(conversations);
            return null;
        }
        return conversations.data.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
    } catch (err) {
        console.warn(`[fetchConversations]: ${err}`);
    }
});

export const fetchCreateGroupChat = createAsyncThunk('conversations/fetchCreateGroupChat', async (data) => {
    try {
        const res = await fetch(`${config.LINK_API}/conversations/create-conversation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const groupChat = await res.json();
        return groupChat;
    } catch (err) {
        console.log(`err fetch group: ${err}`);
    }
});

export const fetchRemoveMember = createAsyncThunk('conversations/fetchRemoveMember', async (data) => {
    try {
        const { idConversation } = data;
        const { memberId, mainId } = data;

        const res = await fetch(`${config.LINK_API}/conversations/delete-member/${idConversation}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memberId, mainId }),
        });
        const memberRemove = await res.json();
        if (memberRemove?.message) {
            console.warn(memberRemove);
            return;
        }
        return memberRemove;
    } catch (err) {
        console.log(`err fetch remove members: ${err}`);
    }
});

export const fetchOutGroup = createAsyncThunk('conversations/fetchOutGroup', async (data) => {
    try {
        const { idConversation } = data;
        const { userId } = data;

        const res = await fetch(`${config.LINK_API}/conversations/out-conversation/${idConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        const outGroup = await res.json();
        if (outGroup?.message) {
            console.warn(outGroup);
            return;
        }
        //console.log('out group -->', outGroup);
        return outGroup;
    } catch (err) {
        console.log(`err fetch out group: ${err}`);
    }
});

export const fetchAddMembers = createAsyncThunk('conversations/fetchAddMembers', async (data) => {
    try {
        const { idConversation } = data;
        const { newMemberID, memberAddID } = data;

        const res = await fetch(`${config.LINK_API}/conversations/add-member-conversation/${idConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newMemberID, memberAddID }),
        });
        const addMembers = await res.json();
        return addMembers;
    } catch (err) {
        console.log(`err fetch add members: ${err}`);
    }
});

export const fetchChangeNameGroup = createAsyncThunk('conversations/fetchChangeNameGroup', async (data) => {
    try {
        const { idConversation } = data;
        const { newName, userId } = data;

        const response = await fetch(`${config.LINK_API}/conversations/change-name/${idConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName, userId }),
        });

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(`err fetchChangeNameGroup: ${error}`);
    }
});

export const fetchUpdateAvatarGroup = createAsyncThunk('conversations/fetchUpdateAvatarGroup', async (data) => {
    try {
        let dataForm;
        const idConversation = data.idConversation;
        dataForm = createFormDataUpdateAvatarGroup(data.imageLink, data.key1, data.userId, data.key2);
        //console.log('dataForm', dataForm);
        const res = await fetch(`${config.LINK_API}/conversations/change-avatar/${idConversation}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: dataForm,
        });
        const avatarGroup = await res.json();
        //console.log('avatarGroup --->', avatarGroup);
        return avatarGroup;
    } catch (err) {
        console.log(`err fetch avatar group: ${err}`);
    }
});

export const fetchDeleteConversations = createAsyncThunk('conversations/fetchDeleteConversations', async (data) => {
    try {
        const { idConversation } = data;
        const { mainId } = data;

        const response = await fetch(`${config.LINK_API}/conversations/delete-conversation/${idConversation}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mainId }),
        });

        const jsonData = await response.json();
        //console.log('jsonData', jsonData);
        return jsonData;
    } catch (error) {
        console.log(`err fetchDeleteConversations: ${error}`);
    }
});

export const fetchBlockConversation = createAsyncThunk('conversations/fetchBlockConversation', async (data) => {
    try {
        const { idConversation } = data;
        const { userId } = data;

        const response = await fetch(`${config.LINK_API}/conversations/block-conversation/${idConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(`err fetchBlockConversation: ${error}`);
    }
});

export const fetchUnBlockConversation = createAsyncThunk('conversations/fetchUnBlockConversation', async (data) => {
    try {
        const { idConversation } = data;
        const { userId } = data;

        const response = await fetch(`${config.LINK_API}/conversations/remove-block-conversation/${idConversation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(`err fetchUnBlockConversation: ${error}`);
    }
});

export const fetchDeleteConversationYourSide = createAsyncThunk(
    'conversations/fetchDeleteConversationYourSide',
    async (data) => {
        try {
            const { idConversation } = data;
            const { userId } = data;

            const response = await fetch(`${config.LINK_API}/conversations/delete-for-you/${idConversation}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const id = await response.json();
            return id;
        } catch (error) {
            console.log(`err fetchDeleteConversationYourSide: ${error}`);
        }
    },
);

export default conversationsSlice;
