import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
    headerLeft: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='settings'
        size={30}
        color={tintColor}
      />),
    header: {
      style: {
        marginTop: Platform.OS === 'android' ? 24 : 0
      }
    }
  };
/*
  static navigationOptions = {
    header: {
      style: {
        marginTop: Platform.OS === 'android' ? 24 : 0
      }
    }
  }
*/
  render() {
    return (
      <View style={{marginTop: 24}}>
        <Text>HIHIHI</Text>
      </View>
    );
  }
}

export default SettingsScreen;
