import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';

export const messageListSelector = (state) => state.messages.data;
export const messageLoadingSelector = (state) => state.messages.loading;

export const searchTextSelector = (state) => state.filters.search;
export const searchGroupSelector = (state) => state.filters.searchGroup;

export const userListSelector = (state) => state.users.data;
export const userLoadingSelector = (state) => state.users.loading;

export const userInfoSelector = (state) => state.info.data;
export const userInfoByPhoneSelector = (state) => state.userInfoByPhone;
export const userIdSelector = (state) => state.info.userId;
export const userInfoLoadingSelector = (state) => state.info.loading;

export const friendListSelector = (state) => state.friends.data;
export const friendIdSelector = (state) => state.friends.friendId;
export const friendOnlineSelector = (state) => state.friends.friendOnline;
export const friendListFriendSendSelector = (state) => state.friends.friendRequestSends;

export const conversationsListSelector = (state) => state.conversations.data;
export const conversationsLocalListSelector = (state) => state.conversations.dataLocal;
export const newGroupChatSelector = (state) => state.conversations.newGroup;
export const conversationListLoadingSelector = (state) => state.conversations.loading;
export const conversationsIdSelector = (state) => state.conversations.conversationId;
export const conversationMembersSelector = (state) => state.conversations.members;
export const conversationBlockBySelector = (state) => state.conversations.blockBy;

/**
 * get friend list then user info changed
 * update status user online by socket
 */
export const getFriendsByUserSelector = createSelector(
    userInfoSelector,
    userListSelector,
    friendOnlineSelector,
    (user, users, friendOnline) => {
        // console.log('selector -> ', friendOnline);
        if (users && user?.friends) {
            const friends = users.filter((_user) => user.friends.includes(_user._id));

            const _friends = friends.map((friend) =>
                friendOnline.includes(friend._id) ? { ...friend, isOnline: true } : { ...friend, isOnline: false },
            );
            return _friends;
        }
        return null;
    },
);

/**
 * user searching to get friend list
 */
export const usersRemainingSelector = createSelector(
    userListSelector,
    getFriendsByUserSelector,
    userInfoSelector,
    searchTextSelector,
    (users, friends, user, search) => {
        if (search != null) {
            if (search.startsWith('0')) {
                const usersFilter = users.filter(
                    (_user) => _user.phoneNumber === search && _user.phoneNumber !== user.phoneNumber,
                );

                const friendFilter = friends.filter((friend) => friend.phoneNumber === search);

                if (friendFilter.length > 0) {
                    return friendFilter.map((friend) => ({
                        ...friend,
                        isFriend: true,
                    }));
                } else if (usersFilter.length > 0) {
                    return usersFilter.map((user) => ({
                        ...user,
                        isFriend: false,
                    }));
                }
                //don't find
                if (!usersFilter.length) {
                    return 1;
                }

                //Cái này check bắt đầu từ A-Z (sau sửa lại cho giống người Việt)
            } else if (search.match('^[A-Za-z]')) {
                const friendFilter = friends.filter((friend) => friend.fullName.includes(search));
                //don't find
                if (!friendFilter.length) {
                    return 1;
                }

                return friendFilter.map((user) => ({
                    _id: user._id,
                    fullName: user.fullName,
                    avatarLink: user.avatarLink,
                    backgroundLink: user.backgroundLink,
                    phoneNumber: user.phoneNumber,
                    gender: user.gender,
                    isFriend: true,
                }));
            } else {
                return 1;
            }
        }

        return false;
    },
);

export const searchGroupChatSelector = createSelector(
    searchGroupSelector,
    userInfoSelector,
    conversationsListSelector,
    (search, user, conversations) => {
        try {
            if (search != null) {
                const _conversations = conversations.filter((conversation) => {
                    if (conversation) {
                        return conversation.name.includes(search) && !conversation.blockBy.includes(user._id);
                    }

                    return null;
                });

                return _conversations;
            }

            return conversations;
        } catch (error) {
            console.warn('searchGroupChatSelector', error);
        }
    },
);
/**
 * get user info then click item search your friend
 */
export const searchItemClickSelector = createSelector(
    userIdSelector,
    getFriendsByUserSelector,
    userListSelector,
    (id, friends, users) => {
        const friendFilter = friends.filter((friend) => friend._id === id);
        const userInfo = users.filter((user) => user._id === id);
        if (friendFilter.length > 0) {
            return friendFilter.map((friend) => ({
                ...friend,
                isFriend: true,
            }));
        } else if (userInfo.length > 0) {
            return userInfo.map((user) => ({
                ...user,
                isFriend: false,
            }));
        }
    },
);

/**
 * get conversation by id
 */
export const getConversationIdByIdFriendSelector = createSelector(
    friendIdSelector,
    conversationsLocalListSelector,
    (friendId, conversations) => {
        const conversation = conversations.filter(
            (_conversation) => _conversation.isGroup == false && _conversation.members.includes(friendId),
        );

        if (conversation.length > 0) {
            return conversation[0];
        }
        return 0;
    },
);

export const getConversationIdByIdGroupConversation = createSelector(
    conversationsIdSelector,
    conversationsListSelector,
    (conversationId, conversations) => {
        const conversation = conversations.filter(
            (_conversation) => _conversation.isGroup && _conversation.id === conversationId,
        );

        if (conversation.length > 0) {
            return conversation[0];
        }
        return 0;
    },
);

export const getConversationWithDeleteBy = createSelector(
    userInfoSelector,
    conversationsListSelector,
    (user, conversations) => {
        // console.log(conversations);
        try {
            if (user && conversations) {
                const _conversations = conversations.filter((conversation) => {
                    return !conversation?.deleteBy.includes(user._id);
                });
                return _conversations;
            }
        } catch (error) {
            console.warn('getConversationWithDeleteBy ->', error);
        }
    },
);

export const getMessageByIdConversationSelector = createSelector(
    userInfoSelector,
    userListSelector,
    messageListSelector,
    (userInfo, users, messages) => {
        try {
            const _messages = messages.map((message) => {
                const user = users.find((_user) => _user._id === message.senderID);
                return message.deleteBy.includes(userInfo._id)
                    ? null
                    : {
                          _id: message._id,
                          action: message.action ? message.action : null,
                          content: message.action ? null : message.content,
                          imageLink: message.imageLink,
                          fileLink: message.fileLink ? message.fileLink.replace(/%20/g, ' ') : null,
                          createdAt: message.action
                              ? moment(message.createdAt).format('DD/MM/YYYY hh:mm')
                              : moment(message.createdAt).format('hh:mm'),
                          user: {
                              id: user?._id,
                              name: message.action ? null : user?.fullName,
                              avatar: message.action ? null : user?.avatarLink,
                          },
                      };
            });

            return _messages; //data receive reversed
        } catch (err) {
            console.log('getMessageByIdConversationSelector ->', err);
        }
    },
);

export const getUserByPhoneNumber = createSelector(
    userListSelector,
    getFriendsByUserSelector,
    userInfoSelector,
    searchTextSelector,
    (users, friends,user, search) => {
        if (search) {
            if (search.startsWith('0')) {
                const usersFilter = users.filter((_user) => _user.phoneNumber === search  && _user.phoneNumber !== user.phoneNumber );

                const friendFilter = friends.filter((friend) => friend.phoneNumber === search);

                if (friendFilter.length > 0) {
                    return friendFilter.map((friend) => ({
                        ...friend,
                        isFriend: true,
                    }));
                } else if (usersFilter.length > 0) {
                    return usersFilter.map((user) => ({
                        ...user,
                        isFriend: false,
                    }));
                }
                //don't find
                if (!usersFilter.length) {
                    return 1;
                }
            } else {
                return 1;
            }
        }
        return false;
    },
);

export const getUserRegister = createSelector(userListSelector, searchTextSelector, (users, search) => {
    if (search) {
        if (search.startsWith('0')) {
            const usersFilter = users.filter((_user) => _user.phoneNumber === search);

            //don't find
            if (!usersFilter.length) {
                return 1;
            }

            return usersFilter;
        } else {
            return 1;
        }
    }
    return false;
});

export const getImageMessage = createSelector(getMessageByIdConversationSelector, (messages) => {
    if (messages.length) {
        const imageMessages = messages.map((message) => (message?.imageLink ? message.imageLink : null));

        return imageMessages;
    }
});

export const getFileMessage = createSelector(getMessageByIdConversationSelector, (messages) => {
    if (messages.length) {
        const fileMessages = messages.map((message) => (message?.fileLink ? message.fileLink : null));

        return fileMessages;
    }
});

export const getFriendsWithMembers = createSelector(
    getFriendsByUserSelector,
    conversationMembersSelector,
    conversationBlockBySelector,
    userListSelector,
    (friends, members, blockBy, users) => {
        const _members = users.filter((user) => members.includes(user._id));
        const _friends = friends.map((friend) => friend._id);
        const friendWithMember = _members.map((member) => {
            return _friends.includes(member._id) ? { ...member, isFriend: true } : { ...member, isFriend: false };
        });
        const _memberBlockBy = friendWithMember.map((member) => {
            return blockBy.includes(member._id) ? { ...member, isBlock: true } : { ...member, isBlock: false };
        });
        return _memberBlockBy;
    },
);
