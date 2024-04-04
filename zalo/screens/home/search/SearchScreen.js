import { useState } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchItem from '../../../components/SearchBar/SearchItem';

import Header from '../../../components/Header';
import { usersRemainingSelector } from '../../../redux/selector';
import filterSlice from '../../../redux/slice/filterSlice';
import { useEffect } from 'react';
import useDebounce from '../../../hooks/useDebounce';
export default function SearchScreen({ navigation }) {
    const dispatch = useDispatch();
    // selector search
    const userSearching = useSelector(usersRemainingSelector);

    // use state
    const [searchInput, setSearchInput] = useState(null);
    const debounce = useDebounce(searchInput, 500);

    // dispatch action search
    useEffect(() => {
        dispatch(filterSlice.actions.searchFilterChange(searchInput));
    }, [debounce]);

    // UI
    return (
        <>
            <Header />
            <View style={styles.searchBar}>
                <Icon
                    style={{ marginLeft: 10 }}
                    name="arrow-back-outline"
                    color="white"
                    size={30}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.inputSearch}>
                    <TextInput
                        placeholder="Tìm kiếm"
                        value={searchInput}
                        onChangeText={(value) => {
                            setSearchInput(value);
                        }}
                    />
                </View>
            </View>
            {userSearching === 1 ? (
                <SearchItem isNull={true} />
            ) : (
                <FlatList
                    data={userSearching}
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
    searchBar: {
        height: 50,
        width: '100%',
        backgroundColor: '#3777F3',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputSearch: {
        marginLeft: 20,
        width: '70%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
});
