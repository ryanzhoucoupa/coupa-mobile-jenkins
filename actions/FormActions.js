import {
  AsyncStorage
 } from 'react-native';
import axios from 'axios';
import qs from 'qs';
import {
  FETCH_GITHUB_LOGIN,
  FORM_CLEAR,
  FORM_GITHUB_LOGIN_UPDATE,
  FORM_GITHUB_LOGIN_SUCCESS,
  FORM_GITHUB_LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';
import {
  GITHUB_LOGIN,
  CREATE_USER_ENDPOINT,
  UNREGISTER_DEVICE_ENDPOINT,
  EXPO_PUSH_TOKEN
} from '../src/constants';

export const logOut = () => async dispatch => {
  let githubLogin = await AsyncStorage.getItem(GITHUB_LOGIN);
  const payload = qs.stringify({ github_login: githubLogin });

  axios.put(UNREGISTER_DEVICE_ENDPOINT, payload)
    .then(response => {
      AsyncStorage.clear()
        .then(resp => dispatch({ type: FORM_CLEAR }));
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: REGISTER_FAIL, payload: 'Unable to unregister device' });
    });
};

export const readQrCode = (qrCode) => async dispatch => {
  try {
    const split = qrCode.split('?');
    const parsed = qs.parse(split[1]);
    const githubLogin = parsed.ghUser;
    console.log(`QR CODE= ${qrCode}`);
    await AsyncStorage.setItem(GITHUB_LOGIN, githubLogin);
    let pushToken = await AsyncStorage.getItem(EXPO_PUSH_TOKEN);

    const payload = qs.stringify({
      github_login: githubLogin,
      expo_push_token: pushToken
    });

    axios.put(split[0], payload)
      .then(response => {
        dispatch({ type: REGISTER_SUCCESS, payload: githubLogin });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: REGISTER_FAIL, payload: 'Unable to register device' });
      })
  } catch (e) {
    console.log(e);
  }
};

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
