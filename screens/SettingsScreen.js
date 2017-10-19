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
          placeholder='Github Account'
          autoCapitalize='none'
          value={this.props.githubLogin}
          onChangeText={value => this.props.formTextInputUpdate({ prop: 'githubLogin', value })}
        />
        <FormValidationMessage>{ this.props.errorMessage }</FormValidationMessage>
        <Button
          title='Save'
          onPress={() => this.saveUserInfo()}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ forms }) => {
  const { githubLogin, errorMessage } = forms;
  return { githubLogin, errorMessage };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
