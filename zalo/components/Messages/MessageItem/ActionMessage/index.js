import { Text, View, StyleSheet } from 'react-native';

function ActionMessage({ message, createAt }) {
    return (
        <View style={styles.body}>
            <View style={styles.message}>
                <Text style={styles.textMessage}>{message}</Text>
                <Text style={styles.createAt}>{createAt}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        marginVertical: 4,
        justifyContent: 'center',
    },
    message: {
        backgroundColor: '#fff',
        width: '97%',
        paddingVertical: 4,
        borderRadius: 50,
        flexDirection: 'column',
    },
    textMessage: {
        textAlign: 'center',
        fontSize: 12
    },
    createAt: {
        textAlign: 'center',
        color: '#abf',
        fontSize: 12
    },
});
export default ActionMessage;
