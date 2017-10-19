import {
  AsyncStorage,
  Notifications
 } from 'react-native';
import axios from 'axios';
import qs from 'qs';
import {
  FETCH_GITHUB_LOGIN,
  FORM_GITHUB_LOGIN_UPDATE,
  FORM_GITHUB_LOGIN_SUCCESS,
  FORM_GITHUB_LOGIN_FAIL
} from './types';
import {
  GITHUB_LOGIN,
  CREATE_USER_ENDPOINT,
  EXPO_PUSH_TOKEN
} from '../src/constants';

export const fetchGithubLogin = () => async dispatch => {
  let githubLogin = await AsyncStorage.getItem(GITHUB_LOGIN);
  let expoPushToken = '';

  try { expoPushToken = await AsyncStorage.getItem(EXPO_PUSH_TOKEN); }
  catch (error) { console.log(error); }

  dispatch({
    type: FETCH_GITHUB_LOGIN,
    payload: { githubLogin, expoPushToken }
  });
};

export const formTextInputUpdate = ({ prop, value }) => {
  return {
    type: FORM_GITHUB_LOGIN_UPDATE,
    payload: { prop, value }
  };
};

export const saveUserInfo = (githubLogin) => async dispatch => {
  await AsyncStorage.setItem(GITHUB_LOGIN, githubLogin);
  let pushToken = await AsyncStorage.getItem(EXPO_PUSH_TOKEN);

  const payload = qs.stringify({
    github_login: githubLogin,
    expo_push_token: pushToken
  });

  axios.post(CREATE_USER_ENDPOINT, payload)
    .then(resp => {
      dispatch({
        type: FORM_GITHUB_LOGIN_SUCCESS
      });
    })
    .catch(error => {
      console.log(error);
      dispatch({
        type: FORM_GITHUB_LOGIN_FAIL,
        payload: `Unable to save: ${error}`
      });
    });
};
