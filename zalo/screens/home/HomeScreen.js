import HomeTabNavigator from '../../routers/HomeTabNavigator';
import { socket } from '../../config';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import friendListSlice, { fetchListFriendRequestSent, fetchLoadFriendsRequest } from '../../redux/slice/friendSlice';
import { userInfoSelector } from '../../redux/selector';
function HomeScreen() {
    const dispatch = useDispatch();

    const _userInfoSelector = useSelector(userInfoSelector);
    useEffect(() => {
        socket.on('get_users', (users) => {
            const usersOnline = users.map((user) => user.userId);
            dispatch(friendListSlice.actions.receiveFriendOnlineWithSocket(usersOnline));
        });
        if(_userInfoSelector){
            dispatch(fetchListFriendRequestSent(_userInfoSelector._id))
        }
    }, []);
    return <HomeTabNavigator />;
}

export default HomeScreen;
