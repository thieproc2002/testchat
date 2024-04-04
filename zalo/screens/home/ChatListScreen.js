import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import moment from 'moment';

import { conversationListLoadingSelector, conversationsListSelector, getConversationWithDeleteBy, userInfoSelector } from '../../redux/selector';
import SearchBar from '../../components/SearchBar';
import ChatItem from '../../components/ChatItem';
import Header from '../../components/Header';
import conversationsSlice, { fetchConversations } from '../../redux/slice/conversationSlice';
import Loading from '../../components/Loading';
import { socket } from '../../config';
import { RefreshControl } from 'react-native';
import { useState } from 'react';

function ChatListScreen({ navigation }) {
    const dispatch = useDispatch();

    // use selector
    const conversationLoading = useSelector(conversationListLoadingSelector);
    const conversations = useSelector(getConversationWithDeleteBy);
    const [refreshing, setRefreshing] = useState(false);
    // socket
    useEffect(() => {
        //init
        if (conversations && conversations.length === 0) {
            dispatch(fetchConversations());
        }
        
        socket.on('update_last_message', (conversation) => {
            dispatch(conversationsSlice.actions.updateLastMessageOfConversation(conversation));
        });
        socket.on('remove_conversation_block_group', (id) => {
            dispatch(conversationsSlice.actions.removeConversationThenRemoveUserInGroup(id));
        });
    }, []);

    // socket
    useEffect(() => {
        //listening socket
        socket.off('send_friends_give_conversation');
        socket.on('send_friends_give_conversation', (conversation) => {
            dispatch(conversationsSlice.actions.addConversationFromSocket(conversation));
        });

        socket.off('receive_friends_give_conversation');
        socket.on('receive_friends_give_conversation', (conversation) => {
            dispatch(conversationsSlice.actions.addConversationFromSocket(conversation));
        });

        socket.on('send_conversation_group', (conversation) => {
            dispatch(conversationsSlice.actions.addConversationFromSocket(conversation));
        });
    }, [conversations]);

    useEffect(() => {
        socket.on('blocked_message_user', (data) => {
            dispatch(conversationsSlice.actions.updateBlockChat(data));
        });
    }, []);
    // loading conversation
    const onRefresh = () => {
        dispatch(fetchConversations());
        if (!conversationLoading) setRefreshing(false);
    };

    // UI
    return (
        <>
            <Header />
            <SearchBar navigation={navigation} />
            {conversationLoading ? (
                <Loading />
            ) : (
                <FlatList
                    data={conversations}
                    initialNumToRender={100}
                    renderItem={({ item }) => (
                        <ChatItem
                            id={item.id}
                            isGroup={item.isGroup}
                            name={item.name}
                            image={item.imageLinkOfConver}
                            members={item.members}
                            blockBy={item.blockBy}
                            message={item.content ? item.content : item.lastMessage}
                            time={moment(item.time).fromNow()}
                            navigation={navigation}
                            key={item.id}
                            createdBy={item.createdBy}
                        />
                    )}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </>
    );
}

export default ChatListScreen;
