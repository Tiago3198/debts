import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import EditScreen from './screens/EditScreen';

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
          options={{ title: 'Details of debt' }}
        />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Edit Debt' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}