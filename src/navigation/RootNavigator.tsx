import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NavigationTestScreen from '../screens/NavigationTestScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={NavigationTestScreen}
          options={{ title: 'Navigation Setup' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}