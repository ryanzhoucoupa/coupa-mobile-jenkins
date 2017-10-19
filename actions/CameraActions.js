import {
  AsyncStorage
} from 'react-native';
import qs from 'qs';
import axios from 'axios';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from './types';

import {
  EXPO_PUSH_TOKEN,
  GITHUB_LOGIN
} from '../src/constants';

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
