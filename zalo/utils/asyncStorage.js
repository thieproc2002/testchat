import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, val) => {
    await AsyncStorage.setItem(key, JSON.stringify(val));
    return key;
};

export const getItem = async (key) => {
    const val = await AsyncStorage.getItem(key);
    if (!val) throw new Error('404 token');
    else return val;
};

export const removeItem = (key) => {
    console.log('logout!');
    return AsyncStorage.removeItem(key);
};
