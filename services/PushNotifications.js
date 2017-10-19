import { AsyncStorage } from 'react-native';
import { Permissions, Notifications } from 'expo';
import {
  EXPO_PUSH_TOKEN
} from '../src/constants';

export default async () => {
  const previousToken = await AsyncStorage.getItem(EXPO_PUSH_TOKEN);
  console.log(`PREVIOUS TOKEN ${previousToken}`);

  if (previousToken) {
    return;
  } else {
    let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    await AsyncStorage.setItem(EXPO_PUSH_TOKEN, token);
  }
};
