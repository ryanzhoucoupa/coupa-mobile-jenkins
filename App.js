import React from 'react';
import { Provider } from 'react-redux';
import { TabNavigator, StackNavigator } from 'react-navigation';

import store from './store';
import MainScreen from './screens/MainScreen';
import SettingsScreen from './screens/SettingsScreen';
import CameraScreen from './screens/CameraScreen';

export default class App extends React.Component {
  render() {
    const MainNavigator = TabNavigator({
      Main: { screen: MainScreen },
      Settings: {
        screen: StackNavigator({
          Settings: { screen: SettingsScreen },
          Camera: { screen: CameraScreen }
        })
      }
    }, {
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
