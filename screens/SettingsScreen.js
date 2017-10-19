import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import {
  Icon,
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../actions';

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: 'Settings',
    headerLeft: null,
    headerRight: null,
    tabBarIcon: ({ tintColor }) => (
      <Icon
        name='settings'
        size={30}
        color={tintColor}
      />),
  });

  async componentDidMount() {
    this.props.fetchGithubLogin();
  }

  saveUserInfo() {
    this.props.saveUserInfo(this.props.githubLogin);
  }

  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <FormLabel>Github Account</FormLabel>
        <FormInput
          disabled
          placeholder='Github Account'
          autoCapitalize='none'
          value={this.props.githubLogin}
          onChangeText={value => this.props.formTextInputUpdate({ prop: 'githubLogin', value })}
        />
        <Text>{this.props.expoPushToken}</Text>
        <FormValidationMessage>{ this.props.errorMessage }</FormValidationMessage>
        <Button
          title='Register'
          onPress={() => this.props.navigation.navigate('Camera')}
        />
        <Button
          title="Clear"
          onPress={() => this.props.logOut()}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ register }) => {
//  const { githubLogin, errorMessage, expoPushToken } = forms;
//  return { githubLogin, expoPushToken, errorMessage };
  const { githubLogin, errorMessage } = register;
  return { githubLogin, errorMessage };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
