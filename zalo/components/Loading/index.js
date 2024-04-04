import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import GlobalStyle from "../../styles/GlobalStyle";

function Loading() {
    return (
        <View style={GlobalStyle.container}>
            <ActivityIndicator size="large" color={GlobalStyle.primaryColor} />
            <Text>Loading...</Text>
        </View>
    );
}

export default Loading;
