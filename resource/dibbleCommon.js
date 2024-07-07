export function getOrderPrice(order, VAT) {
  let order_price = 0;
  if (order.granted_total_price) {
    order_price = order.granted_total_price;
  } else {
    order_price = order.total_price;
  }
  let maam =
    (VAT / 100) * (parseFloat(order_price) + parseFloat(order.delivery_cost));
  return (
    parseFloat(order.delivery_cost) +
    parseFloat(order_price) +
    maam
  ).toFixed(2);
}

export function getNumberOfOptions(product) {
  let i = 0;
  while (product['option' + (i + 1)]) {
    i += 1;
  }
  return i;
}

/* 
  Return an array of objects {name,value} 
  represents the option name and option choice.
  */
export function getOptionsArray(product) {
  let options = [];
  let i = 0;
  while (product['option' + String(i + 1)]) {
    options.push({
      name: product['option_name' + String(i + 1)],
      value: product['option' + String(i + 1)],
    });
    i += 1;
  }
  return options;
}
export function getOptionsSelectionArray(product) {
  let options = [];
  let i = 0;
  while (product['options' + String(i + 1) + '_name']) {
    options.push({
      name: product['options' + String(i + 1) + '_name'],
      options: product['options' + String(i + 1)].map((opt, index) => {
        return {
          label: opt,
          name: product['options' + String(i + 1) + '_name'],
          index: index,
        };
      }),
    });
    i += 1;
  }
  return options;
}

export function generateRequestOptionsObject(options_array) {
  let options_object = {};
  options_array.forEach((option, index) => {
    options_object['option' + String(index + 1)] = option.value;
    // options_object["option_name" + String(index + 1)] = option.name;
  });
  return options_object;
}
export function generateRequestOptionsString(options_array) {
  return options_array.map((opt) => opt.value).join(',');
}
export function productHasOptions(product) {
  return product['options1_name'] || product['options2_name'];
}
export function generateSpecialProductKey(product) {
  let options_list;
  if (product.options) {
    options_list = product.options;
  } else {
    options_list = getOptionsArray(product);
  }

  return product.product_id + generateRequestOptionsString(options_list);
}
export function isSameProducts(prod1, prod2) {
  return generateSpecialProductKey(prod1) == generateSpecialProductKey(prod2);
}
export function isSameProductsWithAmount(prod1, prod2) {
  let res =
    prod1.product_id == prod2.product_id &&
    prod1.option == prod2.option &&
    prod1.amount == prod2.amount;
  return res;
}
export function isCartsEqual(cart1, cart2) {
  let equal = true;
  cart1.forEach((p1) => {
    if (!cart2.find((p2) => isSameProductsWithAmount(p2, p1))) {
      equal = false;
    }
  });

  cart2.forEach((p1) => {
    if (!cart1.find((p2) => isSameProductsWithAmount(p2, p1))) {
      equal = false;
    }
  });
  return equal;
}
export function findOptionsPrice(prices_list, selections) {
  let opt_indexes = selections.map((s) => s.index);
  let price_found = prices_list.find((obj) => {
    let valid = true;
    opt_indexes.forEach((ind, index) => {
      if (!(obj['option' + String(index + 1) + '_index'] == ind)) {
        valid = false;
      }
    });

    return valid;
  });

  if (price_found) {
    return price_found.price;
  }
}
