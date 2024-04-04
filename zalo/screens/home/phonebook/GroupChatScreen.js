import { ListItem, Avatar } from 'react-native-elements';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { useEffect } from 'react';

import {
    conversationsListSelector,
    getConversationIdByIdGroupConversation,
    userInfoSelector,
} from '../../../redux/selector';
import { fetchConversations } from '../../../redux/slice/conversationSlice';
import conversationsSlice from '../../../redux/slice/conversationSlice';

function GroupChatScreen({ navigation }) {
    const dispatch = useDispatch();
    // use selector
    const _userInfoSelector = useSelector(userInfoSelector);
    const conversation = useSelector(getConversationIdByIdGroupConversation);

    //fetch conversation
    useEffect(() => {
        dispatch(fetchConversations(_userInfoSelector._id));
    }, []);

    const groupChat = useSelector(conversationsListSelector);

    // data info group
    let listGroupChat = [];
    for (let group of groupChat) {
        if (group.isGroup) {
            listGroupChat.push({
                id: group.id,
                name: group.name,
                members: group.members,
                imageLinkOfConver: group.imageLinkOfConver,
                content: group.content,
                imageLinkOfLastMessage: group.imageLinkOfLastMessage,
                time: group.time,
            });
        }
    }

    // change screen message
    useEffect(() => {
        if (conversation) {
            dispatch(conversationsSlice.actions.clickGroupChat(0));
            navigation.navigate('MessageScreen', {
                id: conversation.id,
                createdBy: conversation.createdBy,
                name: conversation.name,
                members: conversation.members,
                image: conversation.imageLinkOfConver,
                isGroup: conversation.isGroup,
            });
        }
    }, [conversation]);

    // click item group change screen
    const handleSendChat = (idGroup) => {
        dispatch(conversationsSlice.actions.clickGroupChat(idGroup));
    };

    //render item group
    function getGroupItem({ item: group }) {
        return (
            <TouchableOpacity
                onPress={() => {
                    handleSendChat(group.id);
                }}
                styles={{ flex: 1 }}
            >
                <ListItem key={group.id} bottomDivider>
                    <Avatar rounded size={70} source={{ uri: group.imageLinkOfConver }} />
                    <ListItem.Content>
                        <ListItem.Title>{group.name}</ListItem.Title>
                        <ListItem.Subtitle>{group.content}</ListItem.Subtitle>
                    </ListItem.Content>
                    <Text style={{ bottom: '7%' }}>{moment(group.time).fromNow()}</Text>
                </ListItem>
            </TouchableOpacity>
        );
    }

    //UI
    return (
        <View>
            <FlatList
                data={listGroupChat}
                keyExtractor={(group) => group.id.toString() + '_'}
                renderItem={getGroupItem}
            />
        </View>
    );
}

export default GroupChatScreen;
