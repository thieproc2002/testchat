import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userInfoSelector } from '../../redux/selector';
import conversationsSlice, { fetchDeleteConversationYourSide } from '../../redux/slice/conversationSlice';
import ToolTipCustom from '../SearchBar/Menu/TooltipCustom';

function ChatItem({ id, blockBy, createdBy, isGroup, members, name, image, message, time, navigation }) {
    const dispatch = useDispatch();
    const _userInfoSelector = useSelector(userInfoSelector);

    const items = [
        {
            title: 'Xóa',
            onPress: () => {
                const data = {
                    idConversation: id,
                    userId: _userInfoSelector._id,
                };
                dispatch(fetchDeleteConversationYourSide(data));
            },
        },
    ];

    return (
        <TouchableOpacity
            style={styles.body}
            onPress={() => {
                dispatch(conversationsSlice.actions.clickGroupChat(id));
                dispatch(conversationsSlice.actions.getBlockBy(blockBy));
                navigation.navigate('MessageScreen', { id, blockBy, createdBy, isGroup, members, name, image });
            }}
        >
            <View style={styles.left}>
                <ToolTipCustom width={100} height={60} items={items}>
                    <View style={styles.imageView}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <Image source={require('../../assets/no-avatar.png')} style={styles.image} />
                        )}
                    </View>
                </ToolTipCustom>

                <View>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text style={styles.messageText}>
                        {message?.length > 20 ? message.slice(0, 20) + '...' : message}
                    </Text>
                </View>
            </View>
            <View style={styles.right}>
                {/* Thời gian được tính theo thời gian gửi tin nhắn cuối cùng */}
                <Text style={styles.time}>{time}</Text>
                {/* <View style={styles.viewCount}>
                    <Text style={styles.count}>5</Text>
                </View> */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    left: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    imageView: {
        paddingRight: 16,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
    nameText: {
        fontSize: 14,
        fontWeight: '600',
    },
    messageText: {
        fontSize: 14,
    },
    right: {
        width: '30%',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
    },
    viewCount: {
        width: 20,
        height: 20,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    count: {
        textAlign: 'center',
    },
});
export default ChatItem;
