import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-elements';

import Header from '../../../components/Header';
function SendCallVoice({ navigation }) {
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

                <TouchableOpacity onPress={_endCall} style={styles.buttonCall}>
                    <Avatar size={40} source={require('../../../assets/end-call.png')} />
                </TouchableOpacity>
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
    buttonCall: {
        bottom: '20%',
        marginTop: 10,
        width: 60,
        height: 60,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
});
export default SendCallVoice;
