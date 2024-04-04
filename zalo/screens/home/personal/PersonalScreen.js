import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    friendListFriendSendSelector,
    getConversationIdByIdFriendSelector,
    searchItemClickSelector,
    userInfoSelector,
} from '../../../redux/selector';
import friendListSlice, { fetchBackFriendRequest, fetchFriendsRequest } from '../../../redux/slice/friendSlice';
import * as ImagePicker from 'expo-image-picker';

import moment from 'moment';
import { useEffect } from 'react';
import Header from '../../../components/Header';
import { fetchUpdateAvatarUsers, fetchUpdateBackgroundUsers } from '../../../redux/slice/userInfoSlice';
import { useState } from 'react';
import { socket } from '../../../config';
import { fetchMessagesById } from '../../../redux/slice/messageSlice';
moment().format();

function PersonalScreen({ route, navigation }) {
    const dispatch = useDispatch();

    const [isMe, setIsMe] = useState(route.params.isMe);
    const [isRequest, setIsRequest] = useState(false);
    let isRegister = route.params?.isRegister;

    // selector
    const infoSelf = useSelector(userInfoSelector);
    const conversation = useSelector(getConversationIdByIdFriendSelector);
    const listFriendSend = useSelector(friendListFriendSendSelector);

    const [isClick, setIsClick] = useState(false);

    // list idFriendRequest and id receiver
    let idFriendRequest;
    let listIdReceiver = [];

    useEffect(() => {
        socket.on('remove_request', (_id) => {
            dispatch(friendListSlice.actions.updateFriendRequestSendFromSocket(_id));
        });
    }, []);

    //data info user
    let userInfo;
    let infoMe = [];
    if (isMe) {
        userInfo = infoSelf;
        infoMe.push({
            _id: userInfo._id,
            fullName: userInfo.fullName,
            bio: userInfo.bio,
            gender: userInfo.gender,
            birthday: userInfo.birthday,
            avatarLink: userInfo.avatarLink,
            backgroundLink: userInfo.backgroundLink,
            isFriend: userInfo.isFriend,
        });
    } else {
        userInfo = useSelector(searchItemClickSelector);
        infoMe.push({
            _id: userInfo[0]._id,
            fullName: userInfo[0].fullName,
            bio: userInfo[0].bio,
            gender: userInfo[0].gender,
            birthday: userInfo[0].birthday,
            avatarLink: userInfo[0].avatarLink,
            backgroundLink: userInfo[0].backgroundLink,
            isFriend: userInfo[0].isFriend,
        });
    }

    //set list id receiver
    for (let item of listFriendSend) {
        listIdReceiver.push(item.receiverId);
        if (item.receiverId === infoMe[0]._id) {
            idFriendRequest = item.idFriendRequest;
        }
    }

    useEffect(() => {
        if (listIdReceiver.length > 0) {
            if (listIdReceiver.includes(infoMe[0]._id)) {
                setIsRequest(true);
            } else {
                setIsRequest(false);
            }
        } else {
            setIsRequest(false);
        }
    }, [listFriendSend]);


    //change screen message
    useEffect(() => {
        if (conversation && isClick) {
            dispatch(fetchMessagesById({id: conversation.id}));
            navigation.navigate('MessageScreen', {
                id: conversation.id,
                name: conversation.name,
                members: conversation.members,
                image: conversation.imageLinkOfConver,
            });
        }
    }, [isClick]);

    //sen chat
    const handleSendChat = () => {
        dispatch(friendListSlice.actions.clickSendChat(infoMe[0]._id));
        setIsClick(true)
    };

    // update info
    const _handleUpdateInfo = () => {
        navigation.navigate('InfoSelf');
    };

    // register success
    const _successRegister = () => {
        navigation.navigate('LoadingScreen');
    };

    //Click change avatar or background
    const pickImage = async (isAvatar) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            if (isAvatar) {
                const data = {
                    key: 'avatarLink',
                    userID: infoSelf._id,
                    avatarLink: result.uri,
                };
                dispatch(fetchUpdateAvatarUsers(data));
            } else {
                const data = {
                    key: 'backLink',
                    userID: infoSelf._id,
                    backLink: result.uri,
                };
                dispatch(fetchUpdateBackgroundUsers(data));
            }
            setIsMe(true);
        }
    };

    //send friend request
    const _handleSendRequest = () => {
        //Set data for send require make friend
        const data = {
            senderID: infoSelf._id,
            receiverID: infoMe[0]._id,
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
            senderID: infoSelf._id,
        };
        dispatch(fetchBackFriendRequest(data));
    };

    //UI
    return (
        <>
            <Header />
            <View>
                {isMe ? (
                    <TouchableOpacity onPress={() => pickImage(false)} style={styles.background}>
                        <Image style={styles.backgroundImage} source={{ uri: infoMe[0].backgroundLink }} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.background}>
                        <Image style={styles.backgroundImage} source={{ uri: infoMe[0].backgroundLink }} />
                    </View>
                )}

                <View style={styles.bottomContainer}>
                    {isMe ? (
                        <TouchableOpacity style={{ bottom: '8%' }} onPress={() => pickImage(true)}>
                            <Image style={styles.avatar} source={{ uri: infoMe[0].avatarLink }} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ bottom: '8%' }}>
                            <Image style={styles.avatar} source={{ uri: infoMe[0].avatarLink }} />
                        </View>
                    )}

                    <Text style={styles.name}>{infoMe[0].fullName}</Text>
                    <Text style={styles.bio}>{infoMe[0].bio}</Text>
                    <View style={styles.info}>
                        <Text style={styles.title}>Thông tin cá nhân</Text>
                        <View style={styles.infoDetail}>
                            <Text>Giới tính: {infoMe[0].gender === 0 ? 'Nam' : 'Nữ'}</Text>
                            <Text>Ngày sinh: {moment(infoMe[0].birthday).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    {!isMe ? (
                        !infoMe[0].isFriend ? (
                            <TouchableOpacity
                                style={styles.buttonMakeFriend}
                                onPress={() => (isRequest ? _handleCloseRequest() : _handleSendRequest())}
                            >
                                <Icon
                                    style={{ marginRight: 10 }}
                                    name={isRequest ? 'close' : 'person-add-outline'}
                                    color="#4ACFED"
                                    size={20}
                                />
                                <Text>{isRequest ? 'Thu hồi' : 'Kết bạn'}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.buttonChat}
                                onPress={() => {
                                    handleSendChat();
                                }}
                            >
                                <Icon
                                    style={{ marginRight: 10 }}
                                    name="ios-chatbubble-ellipses-outline"
                                    color="#4F8ADC"
                                    size={25}
                                />
                                <Text style={{ fontSize: 13 }}>Nhắn tin</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <TouchableOpacity style={styles.editInfo} onPress={_handleUpdateInfo}>
                            <Icon style={{ marginRight: 10 }} name="md-pencil" color="white" size={20} />
                            <Text style={{ color: 'white' }}>Cập nhật thông tin</Text>
                        </TouchableOpacity>
                    )}
                    {isRegister ? (
                        <TouchableOpacity style={styles.successRegister} onPress={_successRegister}>
                            <Icon style={{ marginRight: 10 }} name="checkmark-outline" color="#4ACFED" size={20} />
                            <Text style={{ color: '#4ACFED' }}>Hoàn thành</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        with: '100%',
        height: '55%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        position: 'absolute',
        marginTop: '55%',
        height: '190%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        bottom: '8%',
    },
    bio: {
        bottom: '7%',
    },
    info: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom: '4%',
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    infoDetail: {
        margin: 8,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonMakeFriend: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        height: 50,
        borderRadius: 15,
        borderColor: '#1E99CA',
        borderWidth: 2,
    },
    editInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '70%',
        backgroundColor: '#3475F5',
        height: 50,
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 10,
    },
    successRegister: {
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#5D90F5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '70%',
        height: 50,
    },
    buttonChat: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 40,
        borderRadius: 13,
        backgroundColor: 'white',
        borderColor: '#1E99CA',
        shadowColor: '#000',
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 20,
        top: '40%',
        marginStart: '70%',
    },
});

export default PersonalScreen;
