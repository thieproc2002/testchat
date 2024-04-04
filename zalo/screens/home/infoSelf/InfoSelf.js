import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput, Platform } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import RadioForm from 'react-native-simple-radio-button';
import Header from '../../../components/Header';
import { ScrollView } from 'react-native';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpdateInfoUsers } from '../../../redux/slice/userInfoSlice';
import { userInfoSelector } from '../../../redux/selector';
import useDebounce from '../../../hooks/useDebounce';
import { useEffect } from 'react';

export default function InfoSelf({ route, navigation }) {
    const dispatch = useDispatch();
    let isRegister = route.params?.isRegister;

    //selector
    const userInfo = useSelector(userInfoSelector);

    //use state
    const [selectedDate, setSelectedDate] = useState(userInfo.birthday);
    const [textName, setTextName] = useState(userInfo.fullName);
    const [textBio, setTextBio] = useState(userInfo.bio);
    const [chosenOption, setChosenOption] = useState(userInfo.gender);
    const [errUserName, setErrUserName] = useState(null);

    const debouncedUseName = useDebounce(textName, 500);

    // check username register
    useEffect(() => {
        if (textName === '') {
            setErrUserName('Vui lòng nhập tên người dùng');
        } else {
            setErrUserName(null);
        }
    }, [debouncedUseName]);

    //selected
    const options = [
        { label: 'Nam', value: '0' },
        { label: 'Nữ', value: '1' },
    ];

    //data info new
    const data = {
        userID: userInfo._id,
        fullName: textName,
        gender: chosenOption,
        birthday: moment(selectedDate, ['YYYY/MM/DD']),
        bio: textBio,
    };

    // update info
    const _handleUpdateInfo = () => {
        if (textName === null) {
            setTextName('');
        } else if (errUserName != null) {
        } else {
            dispatch(fetchUpdateInfoUsers(data));
            navigation.navigate('PersonalScreen', { isMe: true, isRegister: isRegister });
        }
    };

    //UI
    return (
        <>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('PersonalScreen', {
                            isMe: true,
                        })
                    }
                >
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>Chỉnh sửa thông tin</Text>
            </View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.updateSelf}>
                        <View style={styles.infoSelf}>
                            <TextInput
                                placeholder="Họ và tên"
                                style={styles.input}
                                value={textName}
                                onChangeText={(value) => setTextName(value)}
                            ></TextInput>
                           {errUserName ? (<Text style={{color: 'red', marginRight: "45%" }}>{errUserName}</Text>) : (null)} 
                            <TextInput
                                value={textBio}
                                style={styles.input}
                                placeholder="Sở thích"
                                onChangeText={(value) => setTextBio(value)}
                            ></TextInput>

                            <View style={styles.input}>
                                <View style={styles.inputDate}>
                                    <Text>Ngày sinh:</Text>
                                    <Text style={styles.date}>{selectedDate}</Text>
                                </View>
                                <DatePicker
                                    mode="calendar"
                                    selected={getFormatedDate(userInfo.birthday, 'YYYY/MM/DD')}
                                    selectorStartingYear={1967}
                                    selectorEndingYear={2012}
                                    onSelectedChange={(date) => setSelectedDate(date)}
                                    locale="vie"
                                />
                            </View>

                            <View style={styles.input}>
                                <RadioForm
                                    radio_props={options}
                                    initial={chosenOption}
                                    onPress={(value) => {
                                        setChosenOption(value);
                                    }}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.buttonSave} onPress={_handleUpdateInfo}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#3475F5',
    },
    updateSelf: {
        width: '90%',
        margin: 16,
    },
    infoSelf: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        padding: 8,
        margin: 4,
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
    },
    inputDate: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 18,
        marginLeft: 8,
        fontWeight: '700',
    },
    buttonSave: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#33B0E0',
        height: 40,
    },
});
