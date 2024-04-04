import { Text, StyleSheet, TouchableOpacity } from 'react-native';

function ButtonPrimary({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.textButton}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        width: 330,
        height: 50,
        backgroundColor: '#3777F3',
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});
export default ButtonPrimary;
