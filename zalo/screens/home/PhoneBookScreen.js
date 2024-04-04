import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SearchBar from '../../components/SearchBar';
import Header from '../../components/Header';
import FriendScreen from './phonebook/FriendScreen';
import GroupChatScreen from './phonebook/GroupChatScreen';
import NewFriendScreen from './phonebook/NewFriendScreen';
import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { socket } from '../../config';
import { useDispatch, useSelector } from 'react-redux';
import userInfoSlice from '../../redux/slice/userInfoSlice';
import { friendListSelector } from '../../redux/selector';

const Tab = createMaterialTopTabNavigator();
function PhoneBookScreen({ navigation }) {
    const dispatch = useDispatch();

    const friendRequest = useSelector(friendListSelector);

    // socket
    useEffect(() => {
        socket.off('send_friends');
        socket.on('send_friends', (friends) => {
            //console.log('send_friends', friends);
            dispatch(userInfoSlice.actions.receiveFriendListFromSocket(friends));
        });

        socket.off('receive_friends');
        socket.on('receive_friends', (friends) => {
            //console.log('receive_friends', friends);
            dispatch(userInfoSlice.actions.receiveFriendListFromSocket(friends));
        });
    }, []);

    // UI
    return (
        <>
            <Header />
            <SearchBar navigation={navigation} />
            <Tab.Navigator>
                <Tab.Screen name="Friend" component={FriendScreen} options={{ tabBarLabel: 'Bạn bè' }} />
                <Tab.Screen name="GroupChat" component={GroupChatScreen} options={{ tabBarLabel: 'Nhóm' }} />
                <Tab.Screen
                    name="NewFriend"
                    component={NewFriendScreen}
                    options={{
                        tabBarBadge: () => (
                            <View
                                style={
                                    friendRequest.length > 0
                                        ? {
                                              marginTop: 14,
                                              marginRight: 14,
                                              width: 20,
                                              height: 20,
                                              backgroundColor: 'red',
                                              borderRadius: 16,
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                          }
                                        : null
                                }
                            >
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                                    {friendRequest.length}
                                </Text>
                            </View>
                        ),
                        tabBarLabel: 'Lời mời',
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export default PhoneBookScreen;
