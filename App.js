import React from 'react';
import { Provider } from 'react-redux';
import { TabNavigator } from 'react-navigation';

import store from './store';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen';

export default class App extends React.Component {
  render() {
    const MainNavigator = TabNavigator({
      Main: { screen: MainScreen },
      Settings: { screen: SettingsScreen }
    },
    {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        labelStyle: {
          fontSize: 12
        }
      }
    });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}
