import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { getItem, removeItem } from '../utils/asyncStorage';
import { fetchUserInfo } from '../redux/slice/userInfoSlice';
import { fetchUsers } from '../redux/slice/usersSlice';
import { userInfoLoadingSelector, userLoadingSelector } from '../redux/selector';
import Loading from '../components/Loading';

function LoadingScreen({ navigation, route }) {
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    let isRegister = route.params?.isRegister;
    const userInfoLoading = useSelector(userInfoLoadingSelector);
    const usersLoading = useSelector(userLoadingSelector);

    // removeItem("user_token");

    useEffect(() => {
        if (userInfoLoading === 1 || usersLoading === 1) return;
        else {
            getItem('user_token')
                .then((token) => {
                    if (token) {
                        //loading all users
                        if (usersLoading === 0) {
                            dispatch(fetchUsers());
                            return;
                        }
                        //loading users success next to loading user info
                        if (userInfoLoading === 0) {
                            dispatch(fetchUserInfo(token));
                            return;
                        }
                    }
                })
                .catch((err) => {
                    navigation.navigate('LoginScreen', { screen: 'LoginScreen' });
                    return err;
                });
        }

        if (usersLoading === 2 && userInfoLoading === 2) {
            // Đăng ký dô đây đi qua cập nhật thông tin
            isRegister
                ? navigation.navigate('InfoSelf', { screen: 'InfoSelf', isRegister: isRegister })
                : navigation.navigate('HomeScreen', { screen: 'HomeScreen' });
        }
        // else if(usersLoading === 2 && usersLoading === 403){
        //     navigation.navigate('LoginScreen', { screen: 'LoginScreen' });
        // }
    }, [isFocus, userInfoLoading, usersLoading]);

    return <Loading />;
}

export default LoadingScreen;
