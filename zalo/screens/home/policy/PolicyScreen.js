import { Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../../../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
function PolicyScreen({ navigation }) {
    return (
        <>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>Chính sách</Text>
            </View>

            <ScrollView style={{ marginTop: 20, paddingHorizontal: 8 }}>
                <View style={{ justifyContent: 'center', flex1: 1, alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 23 }}>Chính sách sử dụng của MeChat</Text>
                    <Text style={styles.content}>
                        Các chính sách của chúng tôi đóng vai trò quan trọng trong việc duy trì trải nghiệm tích cực cho
                        người dùng. Vui lòng tuân thủ các chính sách này khi sử dụng Mechat.
                    </Text>

                    <Text style={styles.textTitle}>Hành vi gian lận, lừa đảo và các hình thức lừa dối khác</Text>
                    <Text style={styles.content}>
                        Không dùng ứng dụng Mechat cho mục đích lừa đảo. Không yêu cầu hoặc thu thập dữ liệu nhạy cảm,
                        thông tin tài chính và số an sinh xã hội. Không dùng ứng dụng MeChat để lừa những người dùng
                        khác chia sẻ thông tin vì những lý do bịa đặt. Không mạo danh người khác hoặc cung cấp thông tin
                        không đúng về bản thân hoặc về nguồn gốc của tin nhắn hay cuộc gọi trong Mechat.
                    </Text>
                    <Text style={styles.textTitle}>Hành vi quấy rối</Text>
                    <Text style={styles.content}>
                        Không dùng ứng dụng MeChat để quấy rối, đe dọa hoặc dọa dẫm người khác. Không xúi giục người
                        khác tham gia thực hiện hành vi này.
                    </Text>
                    <Text style={styles.textTitle}>Thông tin cá nhân và thông tin bí mật</Text>
                    <Text style={styles.content}>
                        Không dùng ứng dụng MeChat để quấy rối, đe dọa hoặc dọa dẫm người khác. Không xúi giục người
                        khác tham gia thực hiện hành vi này.
                    </Text>
                    <Text style={styles.textTitle}>Hoạt động bất hợp pháp</Text>
                    <Text style={styles.content}>
                        Không dùng ứng dụng MeChat để quảng bá, tổ chức hoặc tham gia các hoạt động bất hợp pháp
                    </Text>

                    <Text style={[styles.textTitle, { textAlign: 'justify' }]}>
                        Mọi hành vi trên nếu bị phát hiện hoặc người dùng tố cáo thì sẽ bị cảnh cáo hoặc khóa tài khoản.
                        Nên vui lòng cân nhắc mục đích sử dụng ứng dụng trước khi dùng.
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#3475F5',
    },
    textTitle: {
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    },
    content: {
        marginTop: 8,
        textAlign: 'justify'
    }
});
export default PolicyScreen;
