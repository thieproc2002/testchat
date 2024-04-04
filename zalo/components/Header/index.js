import { View, StyleSheet } from 'react-native';

function Header() {
    return <View style={styles.body}></View>;
}

const styles = StyleSheet.create({
    body: {
        width: '100%',
        height: '5%',
        backgroundColor: '#3777F3',
    },
});
export default Header;
