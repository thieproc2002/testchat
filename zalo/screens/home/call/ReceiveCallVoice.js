import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-elements';

import Header from '../../../components/Header';
function ReceiveCallVoice({ navigation }) {
    const _endCall = () => {
        navigation.goBack();
    };

    return (
        <>
            <Header />
            <View style={styles.container}>
                <View style={{ alignItems: 'center', flex: 1, top: '20%' }}>
                    <Avatar rounded size={120} source={require('../../../assets/anh-shinichi.jpg')} />
                    <Text style={{ fontSize: 18, marginTop: 15, color: 'white' }}>Thành Nhớ</Text>
                </View>

                <View style={styles.views}>
                    <TouchableOpacity onPress={_endCall} style={styles.buttonAcceptCall}>
                        <Avatar size={40} source={require('../../../assets/phone.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={_endCall} style={styles.buttonCloseCall}>
                        <Avatar size={40} source={require('../../../assets/end-call.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#3777F3',
    },
    views: {
        flexDirection: 'row',
        width: 300,
        justifyContent: 'space-between',
        bottom: '40%',
    },
    buttonAcceptCall: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
    },
    buttonCloseCall: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
});
export default ReceiveCallVoice;
