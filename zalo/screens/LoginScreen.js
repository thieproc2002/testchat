import { View, Image, Text, KeyboardAvoidingView } from 'react-native';
import { StyleSheet, Platform } from 'react-native';
import { Alert } from 'react-native';
import { useRef, useState } from 'react';

import GlobalStyle from '../styles/GlobalStyle';
import LoginStyles from '../styles/LoginStyles';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import TextInputPrimary from '../components/Inputs/TextInputPrimary';
import config, { checkPhoneNumber } from '../config';
import { setItem } from '../utils/asyncStorage';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

function LoginScreen({ navigation }) {
    //use state
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [password, setPassword] = useState(null);
    const [errPhone, setErrPhone] = useState(null);
    const [errPass, setErrPass] = useState(null);
    const [errAccount, setErrAccount] = useState(null);

    const debouncedPhone = useDebounce(phoneNumber, 500);
    const debouncedPass = useDebounce(password, 500);

    // check phone number
    useEffect(() => {
        if (phoneNumber === '') {
            setErrPhone('Vui lòng nhập số điện thoại');
        } else if (phoneNumber != null && phoneNumber.length != 10) {
            setErrPhone('Vui lòng nhập số điện thoại là 10 số');
        } else if (phoneNumber != null && !checkPhoneNumber(phoneNumber)) {
            setErrPhone('Số điện thoại của bạn không tồn tại');
        } else {
            setErrPhone(null);
        }
    }, [debouncedPhone]);

    // check pass
    useEffect(() => {
        if (password === '') {
            setErrPass('Vui lòng nhập mật khẩu');
        } else {
            setErrPass(null);
        }
    }, [debouncedPass]);

    // function fetch sign with api
    const sign = () => {
        return fetch(`${config.LINK_API}/auths/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                passWord: password,
            }),
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData.status == 'success') {
                    return resData._token;
                }
                if (resData?.error.statusCode === 403) throw new Error(403);
                if (resData?.error.statusCode === 402) throw new Error(402);
            });
    };

    // function change screen register
    const clickRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    // function login with check error and api
    const _handleLogin = () => {
        if (phoneNumber === null) {
            setPhoneNumber('');
        }
        if (password === null) {
            setPassword('');
        } else if (errPhone != null || errPass != null) {
        } else {
            sign()
                .then((token) => {
                    setItem('user_token', token)
                        .then((key) => {
                            console.log(`save ${key} success!`);
                            navigation.navigate('LoadingScreen');
                        })
                        .catch((err) => {
                            console.log(`save ${key} err!`, err);
                        });
                })
                .catch((err) => {
                    if (err.message === '403') {
                        setErrPass('Sai mật khẩu');
                    }
                    if (err.message === '402') {
                        setErrAccount('Số điện thoại này chưa đăng ký tài khoản');
                    }
                });
        }
    };

    // UI
    return (
        <View style={GlobalStyle.container}>
            {/*  logo  */}
            <View style={LoginStyles.logo}>
                <Image style={LoginStyles.img} source={require('../assets/mechat-logo.png')} />
                <Text style={LoginStyles.title}>Đăng nhập</Text>
                <Text style={LoginStyles.subtitle}>Chào mừng bạn</Text>
            </View>
            {/* Login */}
            <View style={LoginStyles.enterData}>
                <TextInputPrimary
                    value={phoneNumber}
                    onChange={(value) => {
                        if (errPass === 'Sai mật khẩu') {
                            setErrPass(null);
                        }
                        setErrAccount(null);
                        setPhoneNumber(value);
                    }}
                    placeholder="Nhập số điện thoại"
                    keyboardType="number-pad"
                />
                {errPhone ? (<Text style={{ marginLeft: 15, color: 'red' }}>{errPhone}</Text>) : (null)}
                {errAccount ? (<Text style={{ marginLeft: 15, color: 'red' }}>{errAccount}</Text>) : (null)}
                <TextInputPrimary
                    value={password}
                    onChange={(value) => {
                        setErrAccount(null);
                        setPassword(value);
                    }}
                    placeholder="Mật khẩu"
                    isPass
                />
                {errPass ? (<Text style={{ marginLeft: 15, color: 'red' }}>{errPass}</Text>) : (null)}

                <View style={styles.newData}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ConfirmPhoneNumber');
                        }}
                    >
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <Text style={styles.register} onPress={clickRegister}>
                        Đăng ký
                    </Text>
                </View>

                <ButtonPrimary title="Đăng nhập" onPress={_handleLogin} />
            </View>
            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40} />
            ) : (
                <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={0} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    newData: {
        width: 340,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        marginRight: 16,
    },
    register: {
        color: '#1E99CA',
        marginRight: 8,
    },
});

export default LoginScreen;
