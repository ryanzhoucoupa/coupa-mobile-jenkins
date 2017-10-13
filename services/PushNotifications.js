import { AsyncStorage } from 'react-native';
import { Permissions, Notifications } from 'expo';

//const PUSH_ENDPOINT = 'https://rallycoding.herokuapp.com/api/tokens';

export default async () => {
  const previousToken = await AsyncStorage.getItem('pushtoken');
  //console.log(`PREVIOUS TOKEN ${previousToken}`);

  if (previousToken) {
    return;
  } else {
    let { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
//    await axios.post(PUSH_ENDPOINT, { token: { token } });
    await AsyncStorage.setItem('pushtoken', token);
  }
};
