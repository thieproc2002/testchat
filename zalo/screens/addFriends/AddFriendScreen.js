import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../../components/Header';
import filterSlice from '../../redux/slice/filterSlice';
import { getUserByPhoneNumber } from '../../redux/selector';
import SearchItem from '../../components/SearchBar/SearchItem';

function AddFriendScreen({ navigation }) {
    const dispatch = useDispatch();

    //Set phone number when change text
    const [text, setText] = useState(null);
    //Get user by phone number
    const usersByPhone = useSelector(getUserByPhoneNumber);

    useEffect(() => {
        if (text == null) {
            dispatch(filterSlice.actions.searchFilterChange(text));
        }
    });

    //click button remove text
    const clearText = () => {
        setText(null);
        dispatch(filterSlice.actions.searchFilterChange(null));
    };

    //dispatch actions search
    const search = () => {
        dispatch(filterSlice.actions.searchFilterChange(text));
    };

    //click button search
    const _handleClickSearch = () => {
        search();
        usersByPhone;
    };

    return (
        <>
            <Header />
            <View style={styles.viewTitle}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={30} />
                </TouchableOpacity>
                <Text style={styles.title}>Thêm bạn</Text>
            </View>
            <View style={styles.viewSubTitle}>
                <Text style={styles.subTitle}>Thêm bạn bằng số điện thoại</Text>
            </View>
            <View style={styles.viewInput}>
                <TextInput
                    keyboardType="number-pad"
                    style={styles.input}
                    placeholder="Nhập số điện thoại"
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                />

                {text == null ? null : (
                    <TouchableOpacity onPress={clearText}>
                        <Icon name="close" color="#111" size={25} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.viewSearch} onPress={() => _handleClickSearch()}>
                    <Text style={styles.textSearch}>TÌM</Text>
                </TouchableOpacity>
            </View>

            {usersByPhone === 1 ? (
                <View style={{ marginTop: 5 }}>
                    <SearchItem isNull />
                </View>
            ) : (
                <FlatList
                    style={{ marginTop: 5 }}
                    data={usersByPhone}
                    renderItem={({ item }) => (
                        <SearchItem
                            id={item._id}
                            name={item.fullName}
                            phonNumber={item.phoneNumber}
                            image={item.avatarLink}
                            isFriend={item.isFriend}
                            navigation={navigation}
                        />
                    )}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    viewTitle: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        width: '100%',
        backgroundColor: '#33B0E0',
    },
    title: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    viewSubTitle: {
        height: 30,
        width: '100%',
        backgroundColor: '#E1E2E3',
    },
    subTitle: {
        fontSize: 13,
        marginLeft: 20,
        marginTop: 5,
    },
    viewInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        width: '100%',
        backgroundColor: 'white',
    },
    input: {
        padding: 10,
        width: '70%',
    },
    viewSearch: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 30,
        backgroundColor: '#1E99CA',
        borderRadius: 15,
    },
    textSearch: {
        color: 'white',
    },
});

export default AddFriendScreen;
