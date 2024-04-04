import { View, Image, Text, KeyboardAvoidingView, Alert } from 'react-native';
import { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { firebaseConfig } from '../utils/firebase';
import config, { checkPhoneNumber, regexPass } from '../config';
import GlobalStyle from '../styles/GlobalStyle';
import LoginStyles from '../styles/LoginStyles';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import TextInputPrimary from '../components/Inputs/TextInputPrimary';
import useDebounce from '../hooks/useDebounce';
import { useEffect } from 'react';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import { TouchableOpacity } from 'react-native';
import { Platform } from 'react-native'; 

function RegisterScreen({ navigation }) {
    //ui state
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [passwordAgain, setPasswordAgain] = useState(null);
    const [errPhone, setErrPhone] = useState(null);
    const [errUserName, setErrUserName] = useState(null);
    const [errPass, setErrPass] = useState(null);
    const [errPassAgain, setErrPassAgain] = useState(null);
    const [errPolicy, setErrPolicy] = useState(null);
    const [isPolicy, setIsPolicy] = useState(false);
    const [successPolicy, setSuccessPolicy] = useState(null)

    //double text
    const debouncedPhone = useDebounce(phoneNumber, 500);
    const debouncedUseName = useDebounce(userName, 500);
    const debouncedPass = useDebounce(password, 500);
    const debouncedPassAgain = useDebounce(passwordAgain, 500);

    // check phone number register
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

    // check username register
    useEffect(() => {
        if (userName === '') {
            setErrUserName('Vui lòng nhập tên tài khoản');
        } else {
            setErrUserName(null);
        }
    }, [debouncedUseName]);

    // check pass word register
    useEffect(() => {
        if (password === '') {
            setErrPass('Vui lòng nhập mật khẩu');
        }else if (password != null && password.length > 0) {
            if(!regexPass.test(password)){
                setErrPass('Mật khẩu phải có 8 kí tự bao gồm  chữ số,\nký tự hoa, ký tự thường');
            } else{
                setErrPass(null);
            }
        }  else {
            setErrPass(null);
        }
    }, [debouncedPass]);

    // check pass word again register
    useEffect(() => {
        if (passwordAgain === '') {
            setErrPassAgain('Vui lòng nhập lại mật khẩu');
        } else if (password != passwordAgain) {
            setErrPassAgain('Vui lòng nhập lại đúng mật khẩu');
        } else {
            setErrPassAgain(null);
        }
    }, [debouncedPassAgain]);

    // check policy
    useEffect(() => {
        if (isPolicy === false ) {
            setSuccessPolicy('No success!')
        } else {
            setErrPolicy(null)
            setSuccessPolicy(null);
        }
    }, [isPolicy]);

    //firebase captcha
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState(null);

    //function get OTP with phone number
    const senOTP = async () => {
        let _phoneNumber = '+84' + phoneNumber.slice(1);
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(_phoneNumber, recaptchaVerifier.current);
            if (verificationId) {
                return verificationId;
            }
        } catch (err) {
            throw new Error(err);
        }
    };

    // function fetch api get user with phone number
    const getUserByPhoneNumber = async () => {
        return await fetch(`${config.LINK_API}/users/get-user-by-phone/${phoneNumber}`)
            .then((res) => res.json())
            .then((resData) => {
                if (resData._id != null) {
                    return true;
                }
                //return catch
                if (resData?.status == 500) return false;
            });
    };

    //function register with check error, api, senOTP
    const _handleRegister = async () => {
        const userPhone = await getUserByPhoneNumber();
        if (isPolicy == false) {
            setErrPolicy('Vui lòng đồng ý chính sách trước khi đăng ký');
        } else{
            setErrPolicy(null)
        }

        if (phoneNumber === null) {
            setPhoneNumber('');
        }
        if (userName === null) {
            setUserName('');
        }
        if (password === null) {
            setPassword('');
        }
        if (passwordAgain === null) {
            setPasswordAgain('');
        } else if (userPhone) {
            setErrPhone('Số điện thoại đã đăng ký tài khoản');
        } else if (
            errPhone != null ||
            errPass != null ||
            errUserName != null ||
            errPassAgain != null ||
            successPolicy != null
        ) {
        } else {
            senOTP()
                .then((otp) => {
                    setVerificationId(otp);
                    navigation.navigate('AuthenticationScreen', {
                        verificationId: otp,
                        phoneNumber: phoneNumber,
                        passWord: passwordAgain,
                        fullName: userName,
                        isForgetPass: false,
                        isRegister: true,
                    });
                })
                .catch((err) => {
                    console.log('Error', err);
                    return;
                });
        }
    };

    // UI
    return (
        <View style={GlobalStyle.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={firebaseConfig}
                title="Xác thực"
                cancelLabel="Hủy"
            />
            {/* logo */}
            <View style={LoginStyles.logo}>
                <Image style={LoginStyles.img} source={require('../assets/mechat-logo.png')} />
                <Text style={LoginStyles.title}>Đăng ký</Text>
                <Text style={LoginStyles.subtitle}>Chào mừng bạn</Text>
            </View>
            {/* Register */}
            <View style={LoginStyles.enterData}>
                <TextInputPrimary
                    value={phoneNumber}
                    onChange={(value) => {
                        setPhoneNumber(value);
                    }}
                    keyboardType="number-pad"
                    placeholder="Số điện thoại"
                    isPass={false}
                />
                {errPhone ? <Text style={{ marginLeft: 15, color: 'red' }}>{errPhone}</Text> : null}
                <TextInputPrimary
                    onChange={(value) => {
                        setUserName(value);
                    }}
                    placeholder="Tên người dùng"
                    isPass={false}
                />
                {errUserName ? <Text style={{ marginLeft: 15, color: 'red' }}>{errUserName}</Text> : null}
                <TextInputPrimary
                    onChange={(value) => {
                        setPassword(value);
                    }}
                    placeholder="Nhập mật khẩu"
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

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                        checkedColor="green"
                        textStyle={{ color: isPolicy ? 'green' : 'black' }}
                        title="Đồng ý chính sách"
                        checked={isPolicy}
                        containerStyle={{ width: '55%' }}
                        onPress={() => {
                            setIsPolicy(!isPolicy);
                        }}
                    />
                    <TouchableOpacity
                        style={{ marginLeft: '3%' }}
                        onPress={() => {
                            navigation.navigate('PolicyScreen');
                        }}
                    >
                        <Text style={{ textDecorationLine: 'underline' }}>Chính sách</Text>
                    </TouchableOpacity>
                </View>
                {errPolicy ? <Text style={{ marginLeft: 15, color: 'red' }}>{errPolicy}</Text> : null}

                <ButtonPrimary
                    title="Đăng ký"
                    onPress={() => {
                        _handleRegister();
                    }}
                />
            </View>

            {Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20} />
            ) : (
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-30} />
            )}
        </View>
    );
}

export default RegisterScreen;
