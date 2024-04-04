import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { TouchableOpacity, Alert } from 'react-native';
import Header from '../../components/Header';
import { removeItem } from '../../utils/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '../../redux/selector';
import userInfoSlice from '../../redux/slice/userInfoSlice';
import conversationsSlice from '../../redux/slice/conversationSlice';
const isWeb = typeof window !== 'undefined';
// set icon in profile
const settings = [
    {
        name: 'Đổi mật khẩu',
        icon: require('../../assets/change.png'),
        key: 'zqsiEw',
    },
    {
        name: 'Đăng xuất',
        icon: require('../../assets/logout.png'),
        key: 'iaT1Ex',
    },
];

function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();

    // selector user info
    const _userInfoSelector = useSelector(userInfoSelector);
    const fullName = _userInfoSelector ? _userInfoSelector.fullName : '';
    const phoneNumber = _userInfoSelector ? _userInfoSelector.phoneNumber : '';
    const avatarLink = _userInfoSelector ? _userInfoSelector.avatarLink : '';
    // variable with user info
    //const { fullName, phoneNumber, avatarLink } = _userInfoSelector;

    // logout
    const logoutScreen = async () => {
        await removeItem('user_token');
        navigation.navigate('LoginScreen');
        dispatch(userInfoSlice.actions.refreshToLogout());
        dispatch(conversationsSlice.actions.resetConversation([]));
    };

    //Question logout
    const showConfirmDialog = () => {
        Alert.alert('ĐĂNG XUẤT', 'Bạn có muốn đăng xuất?', [
            {
                text: 'Có',
                onPress: async () => {
                    await logoutScreen();
                },
            },
            {
                text: 'Không',
            },
        ]);
    };

    // change pass word
    const changePass = () => {
        navigation.navigate('ReplacePassWord', { isChange: true, phoneNumber, userId: _userInfoSelector._id });
    };
    // Render UI Item
    function getUserItem({ item: settings }) {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (settings.key == 'iaT1Ex') {
                        showConfirmDialog();
                    }
                    if (settings.key == 'zqsiEw') {
                        changePass();
                    }
                }}
            >
                <ListItem key={settings.key} bottomDivider>
                    <Avatar rounded size={55} source={settings.icon} />
                    <ListItem.Content>
                        <ListItem.Title>{settings.name}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </TouchableOpacity>
        );
    }

    // UI
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.info}>TRANG CÁ NHÂN</Text>
            </View>
            <View style={styles.viewSettings}>
                <View style={styles.topSetting} />
                <FlatList
                    style={styles.setting}
                    data={settings}
                    keyExtractor={(settings) => settings.key}
                    renderItem={getUserItem}
                />
            </View>
            <TouchableOpacity
                style={styles.image}
                onPress={() =>
                    navigation.navigate('PersonalScreen', {
                        isMe: true,
                    })
                }
            >
                <Avatar rounded size="large" source={{ uri: _userInfoSelector.avatarLink }} />
                <Text style={styles.textName}>{_userInfoSelector.fullName}</Text>
                <Text style={styles.textPhone}>{_userInfoSelector.phoneNumber}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: '#3475F5',
        height: 200,
    },
    info: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
    },
    image: {
        width: '80%',
        height: '18%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: 'absolute',
        marginTop: 150,
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 20,
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
    },
    textPhone: {
        color: '#C2C2C2',
    },
    viewSettings: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        padding: 20,
    },
    setting: {
        flex: 1,
    },
    topSetting: {
        flex: 0.1,
    },
});

export default ProfileScreen;
