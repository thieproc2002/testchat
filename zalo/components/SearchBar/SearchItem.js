import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import userInfoSlice from '../../redux/slice/userInfoSlice';
import { userInfoSelector, friendListFriendSendSelector } from '../../redux/selector';
import friendListSlice, { fetchFriendsRequest, fetchBackFriendRequest } from '../../redux/slice/friendSlice';
import conversationsSlice, {
    fetchBlockConversation,
    fetchRemoveMember,
    fetchUnBlockConversation,
} from '../../redux/slice/conversationSlice';
import { Alert } from 'react-native';
import { socket } from '../../config';

function SearchItem({
    id,
    createdBy,
    isBlock,
    idConversation,
    isGroup,
    image,
    members,
    name,
    phonNumber,
    isFriend,
    isNull,
    navigation,
}) {
    const dispatch = useDispatch();
    const [isRequest, setIsRequest] = useState(false);
    const [isLeader, setIsLeader] = useState(false);

    //selector
    const _userInfoSelector = useSelector(userInfoSelector);
    const listFriendSend = useSelector(friendListFriendSendSelector);

    // list idFriendRequest and id receiver
    let idFriendRequest;
    let listIdReceiver = [];

    //set list id receiver
    for (let item of listFriendSend) {
        listIdReceiver.push(item.receiverId);
        if (item.receiverId === id) {
            idFriendRequest = item.idFriendRequest;
        }
    }

    //set leader
    useEffect(() => {
        if (createdBy === _userInfoSelector._id) {
            setIsLeader(true);
        }

        if (listIdReceiver.length > 0) {
            if (listIdReceiver.includes(id)) {
                setIsRequest(true);
            } else {
                setIsRequest(false);
            }
        } else {
            setIsRequest(false);
        }
    }, [listFriendSend]);

    useEffect(() => {
        socket.on('remove_request', (_id) => {
            dispatch(friendListSlice.actions.updateFriendRequestSendFromSocket(_id));
        });
    }, []);

    // request make friend
    const _handleSendRequest = () => {
        //Set data for send require make friend
        const data = {
            senderID: _userInfoSelector._id,
            receiverID: id,
        };
        // console.log("Data", data);
        setIsRequest(true);
        dispatch(fetchFriendsRequest(data));
    };

    //Close request make friend
    const _handleCloseRequest = () => {
        setIsRequest(false);
        const data = {
            friendRequestID: idFriendRequest,
            status: isRequest,
            senderID: _userInfoSelector._id,
        };
        dispatch(fetchBackFriendRequest(data));
    };

    // click see info self
    const handleClickSearchItem = () => {
        dispatch(userInfoSlice.actions.clickSearchItem(id));
        id === _userInfoSelector._id
            ? navigation.navigate('PersonalScreen', { isMe: true })
            : navigation.navigate('PersonalScreen', { isMe: false });
    };

    // remove member
    const handleRemoveMember = (id) => {
        const data = {
            idConversation: idConversation,
            memberId: id,
            mainId: _userInfoSelector._id,
        };
        dispatch(fetchRemoveMember(data));
        dispatch(conversationsSlice.actions.getMembers(members));
    };

    //Question remove member
    const showConfirmDialogRemove = (id) => {
        Alert.alert('Xóa thành viên', 'Bạn có muốn xóa thành viên này ra khỏi nhóm ?', [
            {
                text: 'Có',
                onPress: () => {
                    handleRemoveMember(id);
                },
            },
            {
                text: 'Không',
            },
        ]);
    };

    const handleBlockMember = () => {
        const data = {
            idConversation: idConversation,
            userId: id,
        };

        dispatch(fetchBlockConversation(data));
    };

    const handleUnBlockMember = () => {
        const data = {
            idConversation: idConversation,
            userId: id,
        };

        dispatch(fetchUnBlockConversation(data));
    };

    const showConfirmDialogBlockUser = () => {
        Alert.alert('Chặn người dùng', 'Bạn có muốn chặn người dùng này ?', [
            {
                text: 'Có',
                onPress: () => {
                    handleBlockMember();
                },
            },
            {
                text: 'Không',
            },
        ]);
    };

    // UI
    return (
        <View style={[styles.container, isNull ? styles.noSearchText : null]}>
            {isNull ? (
                <Text> Không tìm thấy</Text>
            ) : (
                <>
                    <TouchableOpacity style={styles.body} onPress={isNull ? null : handleClickSearchItem}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{name}</Text>
                            {createdBy ? (
                                id === createdBy ? (
                                    <Text style={styles.phonNumber}>Nhóm trưởng</Text>
                                ) : (
                                    <Text style={styles.phonNumber}>Thành viên</Text>
                                )
                            ) : (
                                <Text style={styles.phonNumber}>{phonNumber}</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    {isGroup ? (
                        isLeader ? (
                            createdBy === id ? null : (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={isBlock ? handleUnBlockMember : showConfirmDialogBlockUser}>
                                        <Icon
                                            name={isBlock ? 'close-circle-outline' : 'remove-circle-outline'}
                                            color="black"
                                            size={25}
                                        ></Icon>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginLeft: 20 }}
                                        onPress={() => {
                                            showConfirmDialogRemove(id);
                                        }}
                                    >
                                        <Icon color="red" name="person-remove-outline" size={25} />
                                    </TouchableOpacity>
                                </View>
                            )
                        ) : !isFriend ? (
                            _userInfoSelector._id === id ? null : (
                                <TouchableOpacity
                                    onPress={() => (isRequest ? _handleCloseRequest() : _handleSendRequest())}
                                    style={styles.buttonAdd}
                                >
                                    <Icon color="#3777F3" name={isRequest ? 'close' : 'person-add-outline'} size={20} />
                                    <Text style={{ marginLeft: 5, color: '#59AFC4' }}>
                                        {isRequest ? 'Thu hồi' : 'Kết bạn'}
                                    </Text>
                                </TouchableOpacity>
                            )
                        ) : null
                    ) : isFriend ? (
                        <View style={styles.call}>
                            <TouchableOpacity>
                                <Icon name="ios-call-outline" size={24} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="md-videocam-outline" size={24} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => (isRequest ? _handleCloseRequest() : _handleSendRequest())}
                            style={styles.buttonAdd}
                        >
                            <Icon color="#3777F3" name={isRequest ? 'close' : 'person-add-outline'} size={20} />
                            <Text style={{ marginLeft: 5, color: '#59AFC4' }}>{isRequest ? 'Thu hồi' : 'Kết bạn'}</Text>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    body: {
        width: '75%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    call: {
        width: '100%',
        flexDirection: 'row',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginLeft: 20,
    },
    info: {
        marginLeft: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    icon: {
        color: '#3777F3',
        marginRight: 24,
    },
    noSearchText: {
        justifyContent: 'center',
    },
    buttonAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 40,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#33B0E0',
        marginRight: 8,
    },
});

export default SearchItem;
