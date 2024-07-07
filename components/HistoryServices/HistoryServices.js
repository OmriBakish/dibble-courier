import AsyncStorage from '@react-native-community/async-storage';
import {key_user_info, rq_send_invoice} from '../../resource/BaseValue';
import {makeAPostRequest} from '../../resource/SupportFunction';

export async function sendInvoice(filter_from_date, filter_to_date, callback) {
  let token = await AsyncStorage.getItem(key_user_info);
  if (token != null) {
    token = JSON.parse(token).token;
  }
  let dataObj = {
    request: rq_send_invoice,
    token: token,
    filter_from_date: filter_from_date,
    filter_to_date: filter_to_date,
    send_email: true,
  };
  makeAPostRequest(
    dataObj,
    () => {},
    () => {},
    (isSuccess, responseJson) => {
      if (isSuccess) {
        callback(true);
      } else {
        callback(false);

        console.log(responseJson);
      }
    },
  );
  // set the should fetch call to false to prevent fetching
  // on page number update
}
