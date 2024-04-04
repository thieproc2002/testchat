import { configureStore } from '@reduxjs/toolkit';
import messageListSlice from './slice/messageSlice';
import filterSlice from './slice/filterSlice';
import userListSlice from './slice/usersSlice';
import userInfoSlice from './slice/userInfoSlice';
import friendListSlice from './slice/friendSlice';
import conversationsSlice from './slice/conversationSlice';

const store = configureStore({
    reducer: {
        messages: messageListSlice.reducer,
        filters: filterSlice.reducer,
        users: userListSlice.reducer,
        usersByPhone: userListSlice.reducer,
        info: userInfoSlice.reducer,
        friends: friendListSlice.reducer,
        conversations: conversationsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export default store;
