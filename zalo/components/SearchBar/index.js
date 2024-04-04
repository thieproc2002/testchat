import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from './Menu/MenuItem';
import filterSlice from '../../redux/slice/filterSlice';
import useDebounce from '../../hooks/useDebounce';
const isWeb = typeof window !== 'undefined';
const items = [
    {
        id: 1,
        icon: 'account-multiple-plus-outline',
        title: 'Tạo nhóm',
        isFriends: false,
    },
    {
        id: 2,
        icon: 'account-plus-outline',
        title: 'Thêm bạn',
        isFriends: true,
    },
];

function SearchBar({ navigation }) {
    const [isVisible, setIsVisible] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const debouncedValue = useDebounce(searchInput, 500);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filterSlice.actions.searchFilterChange(searchInput));
    }, [debouncedValue]);

    //func handle
    const onOpenSearch = () => {
        navigation.navigate('SearchScreen');
    };

    const onOpenMenu = () => setIsVisible(true);

    const openAddNewFriend = () => {
        navigation.navigate('AddFriendScreen');
    };

    const openAddNewGroup = () => {
        navigation.navigate('NewGroupChat', {isCreate: true, members: []});
    };

    //ui
    return (
        <View style={styles.searchBar}>
            <Icon name="magnify" size={30} color="#fff" />
            <View style={styles.textSearch}>
                <Text style={styles.textSearch} onPress={onOpenSearch}>
                    Tìm Kiếm
                </Text>
            </View>
            <Tooltip
                isVisible={isVisible}
                content={
                    <>
                        {items.map((item) => (
                            <MenuItem
                                icon={item.icon}
                                title={item.title}
                                key={item.id}
                                onPress={item.isFriends ? openAddNewFriend : openAddNewGroup}
                            />
                        ))}
                    </>
                }
                //style tool tips
                placement={'bottom'}
                onClose={() => setIsVisible(!isVisible)}
                contentStyle={{ width: 150, height: 100 }}
                // {...(Platform.OS === 'ios'
                //     ? { tooltipStyle: { marginLeft: 17, marginTop: 10 } }
                //     : { tooltipStyle: { marginLeft: 17, marginTop: -40 } })}
                tooltipStyle={isWeb ? { marginLeft: 17, marginTop: 10 } : { marginLeft: 17, marginTop: -40 }}
            >
                <Icon name="plus" size={30} color="#fff" onPress={onOpenMenu} />
            </Tooltip>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        height: 50,
        width: '100%',
        backgroundColor: '#3777F3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    inputSearch: {
        width: '70%',
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    textSearch: {
        width: '70%',
        color: '#fff',
        fontSize: 18,
    },
});

export default SearchBar;
