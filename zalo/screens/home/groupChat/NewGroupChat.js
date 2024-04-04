import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Pressable } from 'react-native';
import Header from '../../../components/Header';
import React from 'react';
import { useState } from 'react';
import { ListItem, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    conversationsListSelector,
    getFriendsByUserSelector,
    newGroupChatSelector,
    searchGroupChatSelector,
    userIdSelector,
    userInfoSelector,
    usersRemainingSelector,
} from '../../../redux/selector';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import conversationsSlice, { fetchAddMembers, fetchCreateGroupChat } from '../../../redux/slice/conversationSlice';
import useDebounce from '../../../hooks/useDebounce';
import filterSlice from '../../../redux/slice/filterSlice';
import { moveMessage } from '../../../redux/slice/messageSlice';

function NewGroupChat({ route, navigation }) {
    const { isCreate, members, idConversation, isMoveMessage, idMessage } = route.params;
    const dispatch = useDispatch();

    // is move screen
    const [isMove, setIsMove] = useState(isMoveMessage);
    // info me
    const userID = useSelector(userInfoSelector);
    const { _id } = userID;

    // info group
    const group = useSelector(newGroupChatSelector);

    //text search
    const [searchInput, setSearchInput] = useState(null);
    const debounceSearch = useDebounce(searchInput, 500);

    // text name group
    const [nameGroup, setNameGroup] = useState(null);

    // list all friends
    const friends = useSelector(getFriendsByUserSelector);
    const [data, setData] = useState([]);
    let listFriends = [];

    //list id click
    const [idFriend, setIdFriend] = useState([]);

    // search
    useEffect(() => {
        if (isMove) {
            dispatch(filterSlice.actions.searchGroupChange(searchInput));
        } else {
            dispatch(filterSlice.actions.searchFilterChange(searchInput));
        }
        setIsMove(isMoveMessage);
    }, [debounceSearch]);

    const userSearching = useSelector(usersRemainingSelector);
    const conversationSearching = useSelector(searchGroupChatSelector);

    // set first load
    useEffect(() => {
        if (isMove) {
            for (let item of conversationSearching) {
                listFriends.push({
                    _id: item.id,
                    fullName: item.name,
                    avatarLink: item.imageLinkOfConver,
                    isChecked: members.includes(item._id) ? true : idFriend.includes(item._id) ? true : false,
                });
            }
        } else {
            if (userSearching && userSearching !== 1) {
                for (let item of userSearching) {
                    listFriends.push({
                        _id: item._id,
                        fullName: item.fullName,
                        avatarLink: item.avatarLink,
                        isChecked: members.includes(item._id) ? true : idFriend.includes(item._id) ? true : false,
                    });
                }
            } else if (userSearching === 1 || userSearching === false) {
                for (let item of friends) {
                    listFriends.push({
                        _id: item._id,
                        fullName: item.fullName,
                        avatarLink: item.avatarLink,
                        isChecked: members.includes(item._id) ? true : idFriend.includes(item._id) ? true : false,
                    });
                }
            }
        }

        setData(listFriends);
    }, [conversationSearching, userSearching]);

    // handle select items
    const handleChange = (id) => {
        let listFriendsTmp = [];
        let listIdSelect = [...idFriend];

        let newData = data.map((item) => {
            if (id === item._id) {
                return { ...item, isChecked: !item.isChecked };
            }
            return item;
        });

        listFriendsTmp = newData;

        listFriendsTmp.map((item) => {
            if (id === item._id) {
                if (item.isChecked) {
                    listIdSelect = [...idFriend, item._id];
                } else {
                    listIdSelect.splice(idFriend.indexOf(item._id), 1);
                }
            }
        });
        setData(newData);
        setIdFriend(listIdSelect);
    };

    //create group
    const createGroup = () => {
        if (idFriend.length < 2) {
            Alert.alert('Vui lòng chọn 2 thành viên trở lên');
        } else if (nameGroup == null || nameGroup == '') {
            Alert.alert('Vui lòng nhập tên nhóm');
        } else {
            const data = {
                members: idFriend,
                createdBy: _id,
                name: nameGroup,
            };
            dispatch(fetchCreateGroupChat(data));
            // navigation.navigate("HomeScreen");
        }
    };

    // add member
    const handleAddMembers = () => {
        const data = {
            idConversation: idConversation,
            newMemberID: idFriend,
            memberAddID: _id,
        };

        dispatch(fetchAddMembers(data));
    };

    //change screen message
    useEffect(() => {
        if (group) {
            navigation.navigate('MessageScreen', {
                id: group.id,
                isGroup: group.isGroup,
                members: group.members,
                name: group.name,
                image: group.imageLink,
                createdBy: group.createdBy,
            });
            dispatch(conversationsSlice.actions.resetNewGroup());
        }
    }, [group]);

    // move message
    const handleMoveMessage = () => {
        if (idFriend.length < 1) {
            Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một cuộc trò chuyện để chuyển tin nhắn');
        } else {
            const data = {
                idConversation: idFriend,
                idMessage: idMessage,
                userId: _id,
                navigation,
            };

            //console.log('data', data);
            dispatch(moveMessage(data));
        }
    };

    // render item
    function getFriendItem({ item: friend }) {
        return (
            <TouchableOpacity
                disabled={members.includes(friend._id) ? true : false}
                onPress={() => {
                    handleChange(friend._id);
                }}
                styles={{ flex: 1 }}
            >
                <ListItem key={friend._id} bottomDivider>
                    <Avatar rounded size={50} source={{ uri: friend.avatarLink }} />
                    <ListItem.Content>
                        <ListItem.Title>{friend.fullName}</ListItem.Title>
                        {members.includes(friend._id) ? <ListItem.Subtitle>Đã tham gia</ListItem.Subtitle> : null}
                    </ListItem.Content>
                    <Icon
                        style={{ marginLeft: 10 }}
                        name={friend.isChecked ? 'md-radio-button-on-outline' : 'radio-button-off-outline'}
                        size={25}
                        color="#6BC185"
                    />
                </ListItem>
            </TouchableOpacity>
        );
    }

    // ui
    return (
        <>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>
                    {isMove ? 'Chuyển tin nhắn' : isCreate ? 'Tạo nhóm' : 'Thêm thành viên'}
                </Text>
            </View>
            <View style={styles.container}>
                {isCreate ? (
                    <View style={styles.frameNameGroup}>
                        <Icon style={{ marginRight: 10 }} name="pencil" color="black" size={22} />
                        <TextInput
                            value={nameGroup}
                            style={{ fontSize: 18, width: '90%', height: '100%' }}
                            onChangeText={(value) => {
                                setNameGroup(value);
                            }}
                            placeholder="Đặt tên nhóm"
                        ></TextInput>
                    </View>
                ) : null}

                <View style={styles.searchBar}>
                    <Icon style={{ marginLeft: 10 }} name="search-outline" size={22} color="black" />
                    <View style={{ width: '90%' }}>
                        <TextInput
                            style={{ marginLeft: 5, width: '100%', height: '100%' }}
                            placeholder={isMove ? 'Tìm cuộc trò chuyện' : 'Tìm tên hoặc số điện thoại'}
                            value={searchInput}
                            onChangeText={(value) => {
                                setSearchInput(value);
                            }}
                        />
                    </View>
                </View>

                <View
                    style={
                        isCreate
                            ? { width: '100%', height: '56%', marginTop: 10 }
                            : { width: '100%', height: '63%', marginTop: 10 }
                    }
                >
                    <Text style={{ marginLeft: 15, fontSize: 16, width: '70%', fontWeight: 'bold' }}>
                        {isMoveMessage ? 'Cuộc trò chuyện' : 'Danh bạ'}
                    </Text>
                    <FlatList
                        data={data}
                        keyExtractor={(friend) => friend._id.toString() + '_'}
                        renderItem={getFriendItem}
                    />
                </View>
                {isMove ? (
                    <TouchableOpacity style={styles.addMembers} onPress={handleMoveMessage}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Chuyển</Text>
                        <Icon style={{ marginLeft: 10 }} name="arrow-redo-sharp" size={22} color="white" />
                    </TouchableOpacity>
                ) : isCreate ? (
                    <TouchableOpacity style={styles.successRegister} onPress={createGroup}>
                        <Icon style={{ marginRight: 10 }} name="create-outline" size={22} />
                        <Text>Tạo nhóm</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.addMembers} onPress={handleAddMembers}>
                        <Icon style={{ marginRight: 10 }} name="person-add-outline" size={22} color="white" />
                        <Text style={{ color: 'white', fontSize: 18 }}>Thêm</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#3475F5',
    },
    frameNameGroup: {
        padding: 5,
        marginTop: 10,
        height: 60,
        borderRadius: 8,
        borderBottomColor: '#CCE8FF',
        alignItems: 'center',
        borderBottomWidth: 2,
        flexDirection: 'row',
        width: '90%',
    },
    searchBar: {
        marginTop: 20,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E5E5',
    },
    successRegister: {
        marginTop: 10,
        backgroundColor: '#1BA9FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '90%',
        height: 50,
        marginBottom: 0,
    },
    addMembers: {
        marginTop: 10,
        backgroundColor: '#1BA9FF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '90%',
        height: 50,
        marginBottom: 0,
    },
});
export default NewGroupChat;
