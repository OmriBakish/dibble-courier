import {key_user_info} from '../BaseValue';
import AsyncStorage from '@react-native-community/async-storage';

export async function isLoggedIn() {
  try {
    const value = await AsyncStorage.getItem(key_user_info);
    return value != null;
  } catch (err) {
    return false;
  }
}
