import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AlphabetList } from 'react-native-section-alphabet-list';
import { TouchableOpacity, Text } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import {
    conversationBlockBySelector,
    conversationsIdSelector,
    conversationsListSelector,
    getConversationIdByIdFriendSelector,
    getFriendsByUserSelector,
    userInfoSelector,
} from '../../../redux/selector';
import { useEffect, useState } from 'react';
import friendListSlice from '../../../redux/slice/friendSlice';
import ToolTipCustom from '../../../components/SearchBar/Menu/TooltipCustom';
import { fetchDeleteFriend } from '../../../redux/slice/userInfoSlice';
import conversationsSlice from '../../../redux/slice/conversationSlice';

function FriendScreen({ navigation }) {
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);

    //selector
    const _conversation = useSelector(getConversationIdByIdFriendSelector);
    const friends = useSelector(getFriendsByUserSelector);
    const _userInfoSelector = useSelector(userInfoSelector);

    // data info user
    let friendInfo = [];

    if (friends) {
        if (friends.length != 0) {
            for (let i = 0; i < friends.length; i++) {
                friendInfo.push({
                    value: friends[i].fullName,
                    avatar: friends[i].avatarLink,
                    bio: friends[i].bio,
                    key: friends[i]._id,
                    online: friends[i].isOnline,
                });
            }
        }
    }

    //Change screen message with id conversation
    useEffect(() => {
        if (_conversation != 0) {
            dispatch(friendListSlice.actions.clickSendChat(0));
            dispatch(conversationsSlice.actions.getBlockBy(_conversation.blockBy));
            navigation.navigate('MessageScreen', {
                id: _conversation.id,
                name: _conversation.name,
                members: _conversation.members,
                image: _conversation.imageLinkOfConver,
                blockBy: _conversation.blockBy
            });
        }
    }, [_conversation]);

    // click change screen chat
    const handleSendChat = (id) => {
        dispatch(friendListSlice.actions.clickSendChat(id));
    };

    // render ui item
    function getUserItem(item) {
        return (
            <TouchableOpacity
                onPress={() => {
                    handleSendChat(item.key);
                }}
                onLongPress={() => {
                    setIsVisible(true);
                }}
                styles={{ flex: 1 }}
            >
                <ListItem key={item.key} bottomDivider>
                    <ToolTipCustom
                        width={70}
                        height={70}
                        items={[
                            {
                                title: 'Xóa',
                                onPress: () => {
                                    const data = {
                                        userId: _userInfoSelector._id,
                                        status: true,
                                        userDeleteId: item.key,
                                    };
                                    dispatch(fetchDeleteFriend(data));
                                },
                            },
                        ]}
                        backgroundColor="#ccc"
                    >
                        <Avatar rounded size={70} source={{ uri: item.avatar }} />
                    </ToolTipCustom>
                    <ListItem.Content>
                        <ListItem.Subtitle>
                            {item.value} {item.online ? <Icon name="ellipse" size={14} color="#38A3A5" /> : null}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle>{item.bio}</ListItem.Subtitle>
                    </ListItem.Content>
                    <TouchableOpacity>
                        <Icon style={{ marginRight: 20 }} name="call-outline" color="#000" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="videocam-outline" color="#000" size={25} />
                    </TouchableOpacity>
                </ListItem>
            </TouchableOpacity>
        );
    }
    //UI
    return (
        <>
            <AlphabetList
                data={friendInfo}
                key={friendInfo.key + '#'}
                letterItemStyle={{ height: 90 }}
                renderCustomItem={(item) => getUserItem(item)}
                renderCustomSectionHeader={(section) => <Text>{section.title}</Text>}
            />
        </>
    );
}

export default FriendScreen;
