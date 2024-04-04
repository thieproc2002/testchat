import { useState } from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';

function TextInputPrimary({ value, onChange, placeholder, isPass, keyboardType }) {
    const [isPassState, setIsPassState] = useState(isPass);
    const [nameIcon, setNameIcon] = useState('eye-outline');

    const handleClickIcon = () => {
        setIsPassState(!isPassState);
        if (nameIcon == 'eye-outline') {
            setNameIcon('eye-off-outline');
        } else {
            setNameIcon('eye-outline');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                secureTextEntry={isPassState}
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
            />
            {isPass && <Icon name={nameIcon} color="#000" size={20} onPress={() => handleClickIcon()} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#5D90F5',
        height: 50,
        width: 330,
        paddingLeft: 20,
        margin: 5,
        backgroundColor: '#fff',
    },
    textInput: {
        height: 40,
        fontSize: 16,
        width: 260,
    },
});

export default TextInputPrimary;
