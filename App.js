import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Debts' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detail' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}