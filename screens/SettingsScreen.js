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
import {
  COLOR_RED,
  COLOR_GREEN
} from '../src/constants';

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

  logOut() {
    this.props.logOut();
    this.props.clearAll();
  }

  renderLogOutButton() {
    const loggedIn = (this.props.githubLogin || '') !== '';

    if (loggedIn) {
      return (<Button
        title="Logout"
        backgroundColor={COLOR_RED}
        onPress={() => this.logOut()}
      />);
    }
  }

  render() {
    const registered = (this.props.githubLogin || '') === '' ? 'camera' : 'check';
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
        <Text>{}</Text>
        <FormValidationMessage>{ this.props.errorMessage }</FormValidationMessage>
        <Button
          icon={{ name: registered }}
          title='Register Device'
          backgroundColor={COLOR_GREEN}
          onPress={() => this.props.navigation.navigate('Camera')}
          style={{ marginBottom: 20 }}
        />
        { this.renderLogOutButton() }
      </View>
    );
  }
}

const mapStateToProps = ({ forms }) => {
  const { githubLogin, errorMessage, expoPushToken } = forms;
  return { githubLogin, expoPushToken, errorMessage };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
