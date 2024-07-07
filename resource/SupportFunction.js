import {
  apiUrl,
  rc_success,
  status as statuses,
  req_supplier_get_orders,
  key_user_info,
  key_business_name,
  rq_place_bid,
  sub_key_token,
} from './BaseValue';
import {generateSpecialProductKey} from './dibbleCommon';
import AsyncStorage from '@react-native-community/async-storage';
import getLanguage from '../resource/LanguageSupport';
import moment from 'moment';
import Intercom from 'react-native-intercom';
import {Alert} from 'react-native';
import {getOptionsArray} from './dibbleCommon';
let langObj = getLanguage();

export async function callPlaceBid(
  order_products,
  orderItem,
  closeModal,
  _showLoadingBox,
  _closeLoadingBox,
) {
  console.log('order_products:', order_products);
  getDataWithSubKey(key_user_info, sub_key_token, token => {
    let productList = [];
    for (let i = 0; i < order_products.length; i++) {
      let productItem = {
        product_id: order_products[i]['product_id'],
        amount: order_products[i]['amount'],
        price: order_products[i]['price'],
      };
      let product_options_array = getOptionsArray(order_products[i]);
      product_options_array.forEach((option, index) => {
        productItem['option' + String(index + 1)] = option.value;
      });
      productList.push(productItem);
    }
    let dataObj = {
      request: rq_place_bid,
      token: token,
      order_version: orderItem.order_version,
      delivery_type: 1,
      order_id: orderItem.order_id,
      products: productList,
      reminder_minutes_before: orderItem.reminder_minutes_before,
    };

    //console.log(dataObj);
    makeAPostRequest(
      dataObj,
      () => {
        _showLoadingBox();
      },
      () => {
        _closeLoadingBox();
      },
      (isSuccess, responseJson) => {
        if (isSuccess) {
          closeModal(
            order_products.map(p => {
              return {...p, supplier_price: p.price};
            }),
            orderItem.order_id,
          );
        } else {
          Alert.alert('', responseJson.message, [
            {text: 'OK', onPress: closeModal},
          ]);
        }
      },
    );
  });
}

export async function fetchOrdersWithFilter(
  status_filter,
  input,
  date_string,
  date_from,
  date_to,
  page,
  setNewOrders,
) {
  let token = await AsyncStorage.getItem(key_user_info);
  if (token != null) {
    token = JSON.parse(token).token;
  }
  let dataObj = {
    request: req_supplier_get_orders,
    token: token,
  };
  if (status_filter !== langObj.status) {
    status_index =
      Object.keys(statuses)[Object.values(statuses).indexOf(status_filter)];
    dataObj = {...dataObj, filter_statuses: parseInt(status_index)};
    //alert(status_index)
  }
  if (input !== '') {
    dataObj = {...dataObj, filter_search: input};
  }
  if (date_string != langObj.dates) {
    dataObj = {
      ...dataObj,
      filter_from_date: date_from,
      filter_to_date: date_to,
    };
    //alert(JSON.stringify(dataObj))
  }
  if (page > 0) {
    dataObj = {...dataObj, page: page};
    //alert(JSON.stringify(dataObj))
  }

  // console.log(JSON.stringify(dataObj))
  //alert(JSON.stringify(dataObj))
  await makeAPostRequest(
    dataObj,
    () => {},
    () => {},
    (isSuccess, responseJson) => {
      //alert(JSON.stringify(responseJson))
      if (isSuccess) {
        // alert(JSON.stringify(responseJson))

        setNewOrders(responseJson.orders);
        //alert("found")
      } else {
        //alert(responseJson)
      }
    },
  );
}
export function makeAPostRequest(
  requestObject,
  showLoadingBarFunction,
  closeLoadingBarFunction,
  callback,
) {
  showLoadingBarFunction();
  fetch(apiUrl[global.environment], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestObject),
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(JSON.stringify(responseJson));
      closeLoadingBarFunction();
      if (responseJson.rc == rc_success) {
        callback(true, responseJson);
      } else {
        callback(false, responseJson);
      }
    })
    .catch(error => {
      closeLoadingBarFunction();
      callback(false, error);
    });
}

export function saveData(dataInString, key) {
  try {
    AsyncStorage.setItem(key, dataInString);
  } catch (e) {
    //alert(e);
  }
}

export async function getData(key, callback) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {
      callback(value);
    } else {
      callback('');
    }
  } catch (e) {
    callback('');
  }
}
export async function runFunctionsTillSuccess(func_list, params) {
  let success = false;
  func_list.forEach(f => {
    if (!success) {
      console.log('run', f);
      let res = f(...params);
      success = res;
    }
  });
}
export async function getDataWithSubKey(keyMain, subKey, callback) {
  try {
    const value = await AsyncStorage.getItem(keyMain);
    if (value != null) {
      let jsonParse = JSON.parse(value);
      callback(jsonParse[subKey]);
    } else {
      callback('');
    }
  } catch (e) {
    callback('');
  }
}

export function getProductName(product) {
  let illustrationText = '';
  if (product.is_illustrated) {
    illustrationText = ` - ` + langObj.onlyIllustrate;
  }
  return product.product_name + illustrationText;
}

export function getTotalItems(order) {
  let total = 0;

  let prod_list = [];
  if (order.bidded_products) {
    prod_list = order.bidded_products;
  } else {
    prod_list = order.products;
  }
  prod_list.forEach(prod => {
    total += parseInt(prod.amount);
  });
  return total;
}

export async function openIntercomChat() {
  let business_name = await AsyncStorage.getItem(key_business_name);
  let user_info = await AsyncStorage.getItem(key_user_info);
  console.log(user_info);
  if (business_name != null && user_info != null) {
    console.log(business_name);
    Intercom.registerIdentifiedUser({userId: JSON.parse(user_info).email})
      .then(() => {
        Intercom.updateUser({
          // Pre-defined user attributes
          name: JSON.parse(business_name).first_name,
          custom_attributes: {
            user_type: 'Supplier',
          },
        });
      })
      .then(() => {
        // alert("identified")

        Intercom.displayMessageComposer();
      });
  } else {
    Intercom.registerUnidentifiedUser().then(() => {
      // alert("unidentified")
      Intercom.displayMessageComposer();
    });
    // }
  }
}
export function getHourFormat(item) {
  switch (item.order_type) {
    case 1:
      return moment.utc(item.ready_time).local().format('HH:mm');
    case 2:
      return '';
    case 3:
      console.log('blahblah im the way to find time', item);
      let utc_ready_time = moment
        .utc(item.requested_delivery_time)
        .startOf('day');
      let utc_today = moment.utc(new Date()).startOf('day');
      let day = '';
      let set = false;
      if (utc_ready_time.diff(utc_today, 'days') == 0) {
        day = 'היום';
      } else if (utc_ready_time.diff(utc_today, 'days') == 1) {
        day = 'מחר';
      } else if (utc_today.diff(utc_ready_time, 'days') == 1) {
        day = 'אתמול';
      } else {
        day = moment.utc(item.ready_time).local().format('DD.MM.YY');
        set = true;
      }
      if (set) {
        return (
          day +
          ' ,' +
          moment.utc(item.requested_delivery_time).local().format('HH:mm')
        );
      } else {
        return (
          moment.utc(item.requested_delivery_time).local().format('HH:mm') +
          ' ,' +
          day
        );
      }
  }
}

export function getItemLogoSource(item) {
  return item.order_type == 3
    ? require('../image/TimedDelivery.png')
    : item.order_type == 2
    ? require('../image/pickup_icon.png')
    : require('../image/icon_delivery.png');
}
export function getTotalPrice(item, check_if_selected = false) {
  let totalPrice = 0;
  let products = item.products;
  let price_string = 'price';
  if (item.bid_was_placed) {
    price_string = 'supplier_price';
    products = item.bidded_products;
  }

  if (products) {
    for (let i = 0; i < products.length; i++) {
      if (check_if_selected) {
        if (products[i]['isSelected']) {
          totalPrice =
            totalPrice +
            parseFloat(products[i][price_string]) *
              parseFloat(products[i].amount);
        }
      } else {
        totalPrice =
          totalPrice +
          parseFloat(products[i][price_string]) *
            parseFloat(products[i].amount);
      }
    }
  }

  return thousandsFilter(totalPrice);
}
export function isSameProducts(prod1, prod2) {
  return generateSpecialProductKey(prod1) == generateSpecialProductKey(prod2);
}

export function thousandsFilter(num) {
  return parseFloat(num)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function get_order_products_diff(orderObject) {
  let added_products = [];
  let amount_change_products = [];
  let removed_products = [];
  let current_order_version = orderObject.order_version;
  if (current_order_version == 1) {
    return [];
  } else {
    let current_cart = orderObject.products;
    let prev_cart = orderObject.version_products[orderObject.bid_version];
    current_cart.forEach(current_prod => {
      let prev_prod_result = prev_cart.find(prev_prod =>
        isSameProducts(prev_prod, current_prod),
      );
      if (prev_prod_result) {
        if (prev_prod_result.amount != current_prod.amount) {
          amount_change_products.push({
            ...current_prod,
            prev_amount: prev_prod_result.amount,
          });
        }
        if (current_prod.revived == 1) {
          added_products.push(current_prod);
        }
        // else if(prev_prod_result.version<current_prod.version&&current_prod.version<orderObject.bidded_version){
        //   added_products.push(current_prod);
        // }
      } else {
        added_products.push(current_prod);
      }
    });
    prev_cart.forEach(prev_prod => {
      if (
        !current_cart.find(current_prod =>
          isSameProducts(current_prod, prev_prod),
        )
      ) {
        removed_products.push(prev_prod);
      }
    });

    // ADDED, AMOUNT_CHANGE, REMOVED
    return [added_products, amount_change_products, removed_products];
  }
}
export function merge_amount_update(to_update_amount, updated_amounts) {
  let merged_list = [...to_update_amount];
  updated_amounts.forEach(p1 => {
    let result = to_update_amount.find(p2 => isSameProducts(p1, p2));
    result.amount = p1.amount;
    if (!p1.isSelected) {
      merged_list = merged_list.filter(p => !isSameProducts(p, p1));
    }
  });
  return merged_list;
}

export function merge_last_bid_with_current_delete(last_bid, current_delete) {
  return last_bid.filter(
    p1 => !current_delete.find(p2 => isSameProducts(p1, p2)),
  );
}

export function merge_amount_update_with_bid(
  to_update_amount,
  updated_amounts,
  bid,
  added_products,
) {
  let merged_list = [...to_update_amount];
  let to_delete_products = [];

  merged_list.forEach(p1 => {
    if (
      !updated_amounts.find(p2 => isSameProducts(p1, p2)) &&
      !added_products.find(p2 => isSameProducts(p1, p2)) &&
      !bid.find(p2 => isSameProducts(p1, p2))
    ) {
      to_delete_products.push(p1);
    }
  });

  to_delete_products.forEach(p1 => {
    merged_list = merged_list.filter(p2 => !isSameProducts(p1, p2));
  });

  bid.forEach(p1 => {
    let result = to_update_amount.find(p2 => isSameProducts(p1, p2));
    if (result) {
      result.amount = p1.amount;
    }
  });
  updated_amounts.forEach(p1 => {
    let result = to_update_amount.find(p2 => isSameProducts(p1, p2));
    result.amount = p1.amount;
    if (!p1.isSelected) {
      merged_list = merged_list.filter(p => !isSameProducts(p, p1));
    }
  });
  return merged_list;
}
