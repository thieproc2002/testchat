import { View, Image, Text, KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

import GlobalStyle from '../../../styles/GlobalStyle';
import LoginStyles from '../../../styles/LoginStyles';
import ButtonPrimary from '../../../components/Buttons/ButtonPrimary';
import TextInputPrimary from '../../../components/Inputs/TextInputPrimary';
import { useDispatch } from 'react-redux';
import { fetchChangePass, fetchForgetPassword } from '../../../redux/slice/userInfoSlice';
import useDebounce from '../../../hooks/useDebounce';
import { Alert } from 'react-native';
import { useEffect } from 'react';
import { useState } from 'react';
import config, { regexPass } from '../../../config';
import { setItem } from '../../../utils/asyncStorage';

function ReplacePassWord({ route, navigation }) {
    const dispatch = useDispatch();

    const phoneNumber = route.params.phoneNumber;
    const isChange = route.params?.isChange;
    const userId = route.params?.userId;
    // use state
    const [passOld, setPassOld] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordAgain, setPasswordAgain] = useState(null);
    const [errPass, setErrPass] = useState(null);
    const [errPassOld, setErrPassOld] = useState(null);
    const [errPassAgain, setErrPassAgain] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const debouncedPass = useDebounce(password, 500);
    const debouncedPassAgain = useDebounce(passwordAgain, 500);
    const debouncedPassOld = useDebounce(passOld, 500);

    // check pass old
    const sign = () => {
        return fetch(`${config.LINK_API}/auths/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                passWord: passOld,
            }),
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData?.error.statusCode === 403) throw new Error(403);
            });
    };

    //check error pass
    useEffect(() => {
        if (password === '') {
            setErrPass('Vui lòng nhập mật khẩu mới');
        } else if (password != null && password.length > 0) {
            if(!regexPass.test(password)){
                setErrPass('Mật khẩu phải có 8 kí tự bao gồm  chữ số,\nký tự hoa, ký tự thường');
            } else{
                setErrPass(null);
            }
        } else {
            setErrPass(null);
        }
    }, [debouncedPass]);

    //check error Old
    useEffect(() => {
        if (passOld === '') {
            setErrPassOld('Vui lòng nhập mật khẩu hiện tại');
        } else {
            setErrPassOld(null);
        }
    }, [debouncedPassOld]);

    // check error pass again
    useEffect(() => {
        if (passwordAgain === '') {
            setErrPassAgain('Vui lòng nhập lại mật khẩu');
        } else if (password != passwordAgain) {
            setErrPassAgain('Vui lòng nhập lại đúng mật khẩu');
        } else {
            setErrPassAgain(null);
        }
    }, [debouncedPassAgain]);

    // function fetch sign with api
    const signWithNewPass = () => {
        return fetch(`${config.LINK_API}/auths/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                passWord: passwordAgain,
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

    const _handleLogin = () => {
        signWithNewPass()
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
                    console.log('Sai mật khẩu');
                }
                if (err.message === '402') {
                    console.log('Số điện thoại này chưa đăng ký tài khoản');
                }
            });
    };

    // login
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                _handleLogin();
            }, 2000);
        }
    }, [isSuccess]);

    //button forgot pass
    const _handleForgotPass = () => {
        if (password === null) {
            setPassword('');
        }
        if (passwordAgain === null) {
            setPasswordAgain('');
        } else if (errPass != null || errPassAgain != null) {
        } else {
            const data = { phoneNumber: phoneNumber, newPassword: passwordAgain };
            dispatch(fetchForgetPassword(data));
            Alert.alert('Đổi mật khẩu thành công');
            setIsSuccess(true);
        }
    };

    //button change pass
    const _handleChangePass = () => {
        if (passOld === null) {
            setPassOld('');
        }
        if (password === null) {
            setPassword('');
        }
        if (passwordAgain === null) {
            setPasswordAgain('');
        } else if (errPass != null || errPassAgain != null || errPassOld != null) {
        } else {
            sign().catch((err) => {
                if (err.message === '403') {
                    setErrPassOld('Sai mật khẩu');
                } else {
                    console.log('Ok');
                    const data = {
                        userId: userId,
                        oldPass: passOld,
                        newPassword: password,
                        confirmNewPass: passwordAgain,
                    };
                    dispatch(fetchChangePass(data));
                    Alert.alert('Thay đổi mật khẩu thành công');
                    navigation.goBack();
                }
            });
        }
    };
    // UI
    return (
        <View style={GlobalStyle.container}>
            {/* logo */}
            <View style={LoginStyles.logo}>
                <Image style={LoginStyles.img} source={require('../../../assets/mechat-logo.png')} />
                <Text style={LoginStyles.title}>{isChange ? 'Thay đổi mật khẩu' : 'Khôi phục mật khẩu'} </Text>
                {isChange ? null : <Text style={LoginStyles.subtitle}>Tạo mật khẩu mới</Text>}
            </View>
            {/* Register */}
            <View style={LoginStyles.enterData}>
                {isChange ? (
                    <View>
                        <TextInputPrimary
                            onChange={(value) => {
                                if (errPass === 'Sai mật khẩu') {
                                    setErrPass(null);
                                }
                                setPassOld(value);
                            }}
                            placeholder="Nhập mật khẩu hiện tại"
                            isPass={true}
                        />
                        {errPassOld ? <Text style={{ marginLeft: 15, color: 'red' }}>{errPassOld}</Text> : null}
                    </View>
                ) : null}
                <TextInputPrimary
                    onChange={(value) => {
                        setPassword(value);
                    }}
                    placeholder="Nhập mật khẩu mới"
                    isPass={true}
                />
                {errPass ? <Text style={{ marginLeft: 15, color: 'red' }}>{errPass}</Text> : null}
                <TextInputPrimary
                    onChange={(value) => {
                        setPasswordAgain(value);
                    }}
                    placeholder="Nhập lại mật khẩu"
                    isPass={true}
                />
                {errPassAgain ? <Text style={{ marginLeft: 15, color: 'red' }}>{errPassAgain}</Text> : null}

                <ButtonPrimary title="Xác nhận" onPress={isChange ? _handleChangePass : _handleForgotPass} />
            </View>
            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20} />
            ) : (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-30} />
            )}
        </View>
    );
}

export default ReplacePassWord;
