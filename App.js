/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { setUpServer } from './src/fakeServer/mock_api';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screen1 from './src/screens/Screen1';
import Screen2 from './src/screens/Screen2';

if (window.server) {
  server.shutdown();
}

window.server = setUpServer();

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Screen1">
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="Screen2" component={Screen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
