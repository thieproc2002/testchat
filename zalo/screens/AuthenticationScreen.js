import { View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GlobalStyle from '../styles/GlobalStyle';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import firebase from 'firebase/compat/app';
import { setItem } from '../utils/asyncStorage';
import config from '../config';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

import { firebaseConfig } from '../utils/firebase';
function AuthenticationScreen({ route, navigation }) {
    // firebase captcha
    const recaptchaVerifier = useRef(null);

    //data receiver from login screen
    let confirm = route.params.verificationId;
    let isRegister = route.params.isRegister;
    const phoneNumber = route.params.phoneNumber;
    const isForgetPass = route.params.isForgetPass;

    // variable check forget pass
    let passWord;
    let fullName;

    // check forget pass
    if (isForgetPass == false) {
        passWord = route.params.passWord;
        fullName = route.params.fullName;
    }

    //screen's variables
    const [counter, setCounter] = useState(60);
    const [intervalId, setIntervalId] = useState(null);
    const [code, setCode] = useState('');
    const [isBack, setIsBack] = useState(false);

    // loop time back opt
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => setCounter(prev - 1));
        }, 1000);

        setIntervalId(interval);
    }, [isBack]);

    if (counter === 0) {
        clearInterval(intervalId);
    }

    //functions
    const handleTextChange = (value) => {
        setCode(value);
    };

    //sen otp for phone number
    const sendOtp = async () => {
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

    // back otp 
    // còn lỗi nhẹ nhẹ chưa fix
    const sendBackOTP = () => {
        setCounter(60);
        setIsBack(true);
        sendOtp()
            .then((otp) => {
                confirm = otp;
            })
            .catch((err) => {
                console.log('Error ->', err);
                return;
            });
    };

    // fetch api register
    const register = () => {
        return fetch(`${config.LINK_API}/auths/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                passWord: passWord,
                fullName: fullName,
            }),
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData.status == 'success') {
                    return resData._token;
                }
            });
    };

    // authentication OTP
    const OtpVerify = () => {
        const credential = firebase.auth.PhoneAuthProvider.credential(confirm, code);
        firebase
            .auth()
            .signInWithCredential(credential)
            .then(() => {
                setCode('');
                isForgetPass
                    ? navigation.navigate('ReplacePassWord', {
                          phoneNumber: phoneNumber,
                      })
                    : register().then((token) => {
                          setItem('user_token', token);
                          navigation.navigate('LoadingScreen', { isRegister: isRegister });
                      });
            })
            .catch((err) => {
                Alert.alert('Mã không tồn tại hoặc quá hạn');
            });
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

            <View style={GlobalStyle.centerCol}>
                <Text style={GlobalStyle.textSize}>Nhập OTP được gửi tới số điện thoại của bạn</Text>
                <Text style={[GlobalStyle.textSize, styles.phoneNumberText]}></Text>
            </View>

            <TextInput
                style={[GlobalStyle.textSize, styles.textInput]}
                value={code}
                onChangeText={handleTextChange}
                editable = {counter == 0 ? false: true}
                {...(Platform.OS === 'ios' ? { keyboardType: 'number-pad' } : { keyboardType: 'number-pad' })}
            />

            <TouchableOpacity onPress={sendBackOTP} style={styles.sendBackButton}>
                <FontAwesome5 name="undo" size={15} style={GlobalStyle.primaryColor} />
                <Text style={[GlobalStyle.primaryColor, styles.sendBackText]}>Gửi lại OTP ({counter})</Text>
            </TouchableOpacity>

            <ButtonPrimary title="Xác nhận" onPress={OtpVerify} />
        </View>
    );
}

const styles = StyleSheet.create({
    textView: {
        marginBottom: 16,
    },
    phoneNumberText: {
        fontWeight: '700',
        padding: 8,
    },
    textInput: {
        width: 330,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        textAlign: 'center',
    },
    sendBackButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    sendBackText: {
        marginLeft: 8,
        padding: 8,
    },
});

export default AuthenticationScreen;
