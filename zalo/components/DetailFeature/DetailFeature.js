import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

function DetailFeature({ onPress, nameIcon, nameFeature }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.icon}>
                <Icon style={{ marginLeft: 10 }} name={nameIcon} color="black" size={20} />
            </View>
            <Text
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    width: 70,
                    textAlign: 'center',
                }}
            >
                {nameFeature}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    icon: {
        justifyContent: 'center',
        width: 40,
        height: 40,
        backgroundColor: '#E5E5E5',
        borderRadius: 50,
    },
});
export default DetailFeature;
