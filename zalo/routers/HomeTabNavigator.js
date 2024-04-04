import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneBookScreen from '../screens/home/PhoneBookScreen';
import ChatListScreen from '../screens/home/ChatListScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
    tabBarIcon: ({ color }) => {
        let iconName;

        if (route.name === 'Messages') {
            iconName = 'message-processing';
        } else if (route.name === 'PhoneBookScreen') {
            iconName = 'book-account';
        } else if (route.name === 'ProfileScreen') {
            iconName = 'account';
        }

        return <Icon name={iconName} size={20} color={color} />;
    },
    tabBarInactiveTintColor: '#ccc',
    tabBarActiveTintColor: '#219ebc',
    header: () => null,
});

function HomeTabNavigator() {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Messages"
                component={ChatListScreen}
                options={{ tabBarBadge: 3, tabBarLabel: 'Tin nhắn' }}
            />
            <Tab.Screen name="PhoneBookScreen" component={PhoneBookScreen} options={{ tabBarLabel: 'Danh bạ' }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{ tabBarLabel: 'Cá nhân' }} />
        </Tab.Navigator>
    );
}

export default HomeTabNavigator;
