import Header from '../../../components/Header';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { reportUserByMessage } from '../../../redux/slice/usersSlice';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

function ReportScreen({ navigation, route }) {
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const { message, senderId } = route.params;

    const dispatch = useDispatch();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            const size = result.fileName / 1024 / 1024;
            if (Platform.OS === 'ios') {
                if (size < 5) {
                    //MB
                    if (result.type === 'image') setImage(result.uri);
                    else Alert.alert('Thông báo', 'Vui lòng chọn hình ảnh!');
                } else {
                    Alert.alert(
                        'Thông báo',
                        'Hình ảnh bạn gửi lớn hơn 5MB - Vui lòng chọn lại, Xin lỗi vì sự bất tiện này',
                    );
                }
            } else {
                if (result.type === 'image') setImage(result.uri);
                else Alert.alert('Thông báo', 'Vui lòng chọn hình ảnh!');
            }
        }
    };

    const handleSendReport = () => {
        const data = {
            imageLink: image,
            messageId: message._id,
            senderId,
            contentReport: content,
            navigation: navigation,
        };

        dispatch(reportUserByMessage(data));
    };
    return (
        <>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>Báo cáo tin nhắn</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.inputItem}>
                    <Text style={styles.text}>Tin nhắn:</Text>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        selectTextOnFocus={false}
                        value={message?.imageLink ? '[Hình ảnh]' : message.content}
                    />
                </View>
                <View style={styles.inputItem}>
                    <Text style={styles.text}>Nội dung báo cáo:</Text>
                    <TextInput style={styles.input} value={content} onChangeText={(val) => setContent(val)} />
                </View>
                <View style={styles.inputItem}>
                    <Text style={styles.text}>Hình ảnh minh chứng:</Text>
                    <View style={styles.viewImage}>
                        {image ? (
                            <TouchableOpacity onPress={pickImage} style={{ width: '100%', height: '100%' }}>
                                <Image
                                    source={{ uri: image }}
                                    resizeMode="stretch"
                                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.btnChooseImage} onPress={pickImage}>
                                <Text style={styles.textBtn}>Chọn ảnh</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.btnSend} onPress={handleSendReport}>
                        <Text style={[styles.textBtn, { color: '#fff' }]}>Gửi báo cáo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 60,
        backgroundColor: '#3475F5',
    },
    body: {
        flex: 1,
        padding: '4%',
    },
    inputItem: {
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#3777F3',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 8,
        fontSize: 16,
    },
    viewImage: {
        width: '100%',
        height: '65%',
        borderColor: '#3777F3',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnChooseImage: {
        width: 100,
        height: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 8,
    },
    btnSend: {
        marginTop: 8,
        width: '100%',
        height: 60,
        backgroundColor: '#3777F3',
        justifyContent: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    textBtn: {
        textAlign: 'center',
        fontWeight: '600',
    },
});
export default ReportScreen;
