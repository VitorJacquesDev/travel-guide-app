import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../contexts/AuthContext';

import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import PointDetailsScreen from '../screens/main/PointDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): JSX.Element {
  const { user, loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          // Show loading screen while checking auth state
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : user ? (
          // User is authenticated
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="PointDetails" 
              component={PointDetailsScreen}
              options={{
                headerShown: true,
                title: 'Detalhes',
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          // User is not authenticated
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}