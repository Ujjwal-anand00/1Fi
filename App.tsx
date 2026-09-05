import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNavigation } from './src/components/BottomNavigation';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { ShopScreen } from './src/screens/ShopScreen';

export type RootTabParamList = {
  Home: undefined;
  Shop: undefined;
  'EMI Dues': undefined;
  Limit: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          initialRouteName="Shop"
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <BottomNavigation {...props} />}
        >
          <Tab.Screen name="Home">
            {() => <PlaceholderScreen title="Home" />}
          </Tab.Screen>
          <Tab.Screen name="Shop" component={ShopScreen} />
          <Tab.Screen name="EMI Dues">
            {() => <PlaceholderScreen title="EMI Dues" />}
          </Tab.Screen>
          <Tab.Screen name="Limit">
            {() => <PlaceholderScreen title="Limit" />}
          </Tab.Screen>
          <Tab.Screen name="Profile">
            {() => <PlaceholderScreen title="Profile" />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
