import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, RegisterScreen, AuthenticationScreen } from '../screens';
import HomeScreen from '../screens/home/HomeScreen';
import MessageScreen from '../screens/home/messages/MessageScreen';
import PersonalScreen from '../screens/home/personal/PersonalScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
import LoadingScreen from '../screens/LoadingScreen';
import AddFriendScreen from '../screens/addFriends/AddFriendScreen';
import DetailChat from '../screens/home/detailChat/DetailChat';
import InfoSelf from '../screens/home/infoSelf/InfoSelf';
import SearchScreen from '../screens/home/search/SearchScreen';
import ChatListScreen from '../screens/home/ChatListScreen';
import SyncPhoneBook from '../screens/home/phonebook/SyncPhoneBook';
import ConfirmPhoneNumber from '../screens/home/forgotPass/ConfirmPhoneNumber';
import ReplacePassWord from '../screens/home/forgotPass/ReplacePassWord';
import SendCallVoice from '../screens/home/call/SendCallVoice';
import ReceiveCallVoice from '../screens/home/call/ReceiveCallVoice';
import ImageScreen from '../screens/home/detailChat/ImageScreen';
import NewGroupChat from '../screens/home/groupChat/NewGroupChat';
import ViewFileScreen from '../screens/home/messages/ViewFileScreen';
import AllMembers from '../screens/home/detailChat/detailGroup/AllMembers';
import ReportScreen from '../screens/home/messages/ReportScreen';
import PolicyScreen from '../screens/home/policy/PolicyScreen';
const Stack = createNativeStackNavigator();

function RootStackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="LoginScreen"
            >
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="AuthenticationScreen" component={AuthenticationScreen} />
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="MessageScreen" component={MessageScreen} />
                <Stack.Screen name="PersonalScreen" component={PersonalScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="AddFriendScreen" component={AddFriendScreen} />
                <Stack.Screen name="DetailChat" component={DetailChat} />
                <Stack.Screen name="InfoSelf" component={InfoSelf} />
                <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
                <Stack.Screen name="SearchScreen" component={SearchScreen}/>
                <Stack.Screen name="SyncPhoneBook" component={SyncPhoneBook} />
                <Stack.Screen name="ConfirmPhoneNumber" component={ConfirmPhoneNumber} />
                <Stack.Screen name="ReplacePassWord" component={ReplacePassWord} />
                <Stack.Screen name="SendCallVoice" component={SendCallVoice} />
                <Stack.Screen name="ReceiveCallVoice" component={ReceiveCallVoice} />
                <Stack.Screen name="ImageScreen" component={ImageScreen} />
                <Stack.Screen name="NewGroupChat" component={NewGroupChat} />
                <Stack.Screen name='ViewFileScreen' component={ViewFileScreen}/>
                <Stack.Screen name='AllMembers' component={AllMembers}/>
                <Stack.Screen name='ReportScreen' component={ReportScreen}/>
                <Stack.Screen name='PolicyScreen' component={PolicyScreen}/>

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootStackNavigator;
