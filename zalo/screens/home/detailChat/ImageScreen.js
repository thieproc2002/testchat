import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Header from '../../../components/Header';
import ChildFileScreen from './ChildImageScreen/ChildFileScreen';
import ChildImageScreen from './ChildImageScreen/ChildImageScreen';
import ChildVideoScreen from './ChildImageScreen/ChildVideoScreen';

const Tab = createMaterialTopTabNavigator();

function ImageScreen({navigation}) {

    return (
        <>
            <Header />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon style={{ marginLeft: 10 }} name="arrow-back-outline" color="white" size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 15, marginLeft: 10 }}>Ảnh,file,video đã gửi</Text>
            </View>
            <Tab.Navigator>
                <Tab.Screen name="ChildImageScreen" component={ChildImageScreen} options={{ tabBarLabel: 'Ảnh' }} />
                <Tab.Screen name="ChildVideoScreen" component={ChildVideoScreen} options={{ tabBarLabel: 'Video' }} />
                <Tab.Screen name="ChildFileScreen" component={ChildFileScreen} options={{ tabBarLabel: 'File' }} />
            </Tab.Navigator>
        </>
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#3475F5',
    },
});
export default ImageScreen;
