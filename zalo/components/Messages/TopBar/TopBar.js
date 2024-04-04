import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { conversationBlockBySelector, friendOnlineSelector, userInfoSelector } from '../../../redux/selector';
import { fetchConversations } from '../../../redux/slice/conversationSlice';

function TopBar({ idConversation, isGroup, members, createdBy, image, name, navigation }) {
    const friendOnline = useSelector(friendOnlineSelector);

    const handleClickArrowLeftIcon = () => {
        navigation.navigate('HomeScreen');
    };

    const _sendCallVoice = () => {
        navigation.navigate('SendCallVoice');
    };

    const _receiveCallVoice = () => {
        navigation.navigate('ReceiveCallVoice');
    };
    return (
        <View style={[styles.topBar, styles.row]}>
            <View style={[styles.leftBar]}>
                <Icon name="arrow-back-outline" color="white" size={20} onPress={handleClickArrowLeftIcon} />
                <View style={styles.group}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('DetailChat', {
                                idConversation,
                                createdBy,
                                isGroup: isGroup,
                                members: members,
                                name: name,
                                image: image,
                            })
                        }
                    >
                        {/* <Icon name="list-outline" size={24} style={styles.icon} /> */}
                        <Text style={styles.nameText}>{name}</Text>
                        {isGroup && <Text style={{ color: '#fff' }}>{`${members.length} người`}</Text>}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[styles.rightBar]}>
                {isGroup ? (
                    <>
                        <Icon name="cloudy-outline" size={24} style={styles.icon} />
                        <Icon name="videocam-outline" size={24} style={styles.icon} />
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={_sendCallVoice}>
                            <Icon name="call-outline" size={24} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={_receiveCallVoice}
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                        >
                            <Icon name="videocam-outline" size={24} style={[styles.icon, {marginHorizontal: 0}]} />
                            {!isGroup && friendOnline.includes(members[0]) && friendOnline.includes(members[1]) && (
                                <Icon name="ellipse" size={12} color="#38A3A5" />
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: '100%',
        height: 60,
        backgroundColor: '#3777F3',
    },
    leftBar: {
        width: '50%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    group: {
        marginLeft: 8,
    },
    nameText: {
        width: '100%',
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    rightBar: {
        width: '30%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        fontWeight: '500',
        color: '#fff',
        marginHorizontal: 16,
    },
});
export default TopBar;
