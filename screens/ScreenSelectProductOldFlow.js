/* eslint-disable react-native/no-inline-styles */
/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */ƒ

import * as React from 'react';
import {
  View, Text, TextInput, Dimensions, Image, StyleSheet, FlatList, Keyboard,
  TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Platform
} from 'react-native';

import {
  bg_button_grey,
  bg_dark,
  bg_grey, bg_grey_no_opacity, bg_red, bg_white,
  bg_yellow_bubble,
  c_loading_icon, c_orange,
  c_text_blue,
  c_text_grey, c_text_yellow,
  greyHasOpacity,
} from '../resource/BaseValue';
import CheckBox from '@react-native-community/checkbox';
import getLanguage, { getPerfectSize } from '../resource/LanguageSupport';
import { globalStyles } from '../resource/style/global';
import { getProductName, getTotalPrice } from '../resource/SupportFunction'
export default class SelectProductScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log(JSON.stringify(this.props.orderSelected));
    let orderSelected = this.props.orderSelected;
    for (let i = 0; i < orderSelected.products.length; i++) {
      orderSelected.products[i]['isSelected'] = false;
      orderSelected.products[i]['price'] = '';
    }
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      indicatorDisplay: false,
      isShowEnterPrice: false,
      orderItem: orderSelected,
      selectedIndex: 0,
      selected_product_avialable_quntity: 0,
      selectedAmount: 0,
      isShowSummary: false,
    };
  }

  componentDidMount() {
    this.props.orderSelected.products.forEach(prod => {
      prod.max_amount = prod.amount
    })
    console.log('componentDidMount');
  }

  callCloseSelf = (data) => {
    if (data == '') {
      this.props.closeSelectProductDialog(data, 1, false);
    } else {
      let returnOrderSubmitPrice = JSON.parse(JSON.stringify(data));
      returnOrderSubmitPrice.products = [];
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i]['isSelected']) {
          console.log('data.products true' + i);
          returnOrderSubmitPrice.products.push(data.products[i]);
        } else {
          console.log('data.products false' + i);
        }
      }
      console.log('full: ' + JSON.stringify(returnOrderSubmitPrice));
      this.props.closeSelectProductDialog(returnOrderSubmitPrice, 4, true);
    }
  };

  _showLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = screenWidth;
    allState.indicatorSizeH = screenHeight;
    allState.indicatorDisplay = true;
    this.setState(allState);
  }

  _closeLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = 0;
    allState.indicatorSizeH = 0;
    allState.indicatorDisplay = false;
    this.setState(allState);
  }

  updateSelectProduct = (index) => {
    let allState = this.state;
    allState.orderItem.products[index]['isSelected'] = !allState.orderItem.products[index]['isSelected'];
    allState.selectedIndex = 0;
    allState.selectedAmount = 0;
    for (let i = 0; i < allState.orderItem.products.length; i++) {
      if (allState.orderItem.products[i]['isSelected']) {
        allState.selectedAmount = allState.selectedAmount + 1;
        allState.selectedIndex = i;
      }
    }
    this.setState(allState);
  };

  checkButtonState() {
    if (this.state.isShowEnterPrice) {
      return this.checkIfProductEnteredPrice();
    } else {
      return this.checkIfProductSelected();
    }
  }

  checkIfProductSelected() {
    let isSelected = false;
    for (
      let i = 0;
      i < this.state.orderItem.products.length && !isSelected;
      i++
    ) {
      if (this.state.orderItem.products[i]['isSelected']) {
        isSelected = true;
      }
    }
    return isSelected;
  }

  checkIfProductEnteredPrice() {
    let isEntered = true;
    for (let i = 0; i < this.state.orderItem.products.length && isEntered; i++) {
      // if (this.state.orderItem.products[i]['isSelected']) {
      //   if (this.state.orderItem.products[i]['price'] == '' || this.state.orderItem.products[i]['price'] == '0') {
      //     isEntered = false;
      //   }
      // }
      if (this.state.orderItem.products[i]['isSelected']) {
        if (this.state.orderItem.products[i]['price'] == '' || this.state.orderItem.products[i]['price'] == '0') {
          isEntered = false;
        }
      }
    }
    return isEntered;
  }

  updateProductPrice = (index, price) => {
    let allState = this.state;
    allState.orderItem.products[index]['price'] = price.replace(/[^0-9.]/g, '');
    this.setState(allState);
  };

  getTotalItem = () => {
    let totalItem = 0;
    if (this.state.isShowEnterPrice || this.state.isShowSummary) {
      for (let i = 0; i < this.state.orderItem.products.length; i++) {
        if (this.state.orderItem.products[i]['isSelected']) {
          totalItem = totalItem
            + parseInt(this.state.orderItem.products[i].amount);
        }
      }
    } else {
      for (let i = 0; i < this.state.orderItem.products.length; i++) {
        totalItem = totalItem
          + parseInt(this.state.orderItem.products[i].amount);
      }
    }
    return totalItem;
  }

  comeToNextSelectedProduct = () => {


    this.state.orderItem.products[this.state.selectedIndex]['amount'] = this.state.selected_product_avialable_quntity;
    let selectedIndex = this.state.selectedIndex;

    if (selectedIndex == this.state.orderItem.products.length - 1) {
      selectedIndex = 0;
    } else {
      selectedIndex = selectedIndex + 1;
    }
    if (!this.state.orderItem.products[selectedIndex]['isSelected']) {
      this.setState({
        selectedIndex: selectedIndex
      }, () => {
        this.comeToNextSelectedProduct();
      }
      )
    } else {
      this.setState({
        selectedIndex: selectedIndex
      })
    }
    this.setState({ selected_product_avialable_quntity: this.state.orderItem.products[selectedIndex]['amount'] })
  }

  comeToPreviousSelectedProduct = () => {
    this.state.orderItem.products[this.state.selectedIndex]['amount'] = this.state.selected_product_avialable_quntity;
    let selectedIndex = this.state.selectedIndex;
    if (selectedIndex == 0) {
      selectedIndex = this.state.orderItem.products.length - 1;
    } else {
      selectedIndex = selectedIndex - 1;
    }
    if (!this.state.orderItem.products[selectedIndex]['isSelected']) {
      this.setState({
        selectedIndex: selectedIndex
      }, () => {
        this.comeToPreviousSelectedProduct();
      }
      )
    } else {
      this.setState({
        selectedIndex: selectedIndex
      })
    }
    this.setState({ selected_product_avialable_quntity: this.state.orderItem.products[selectedIndex]['amount'] })
  }

  render() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{
          width: screenWidth,
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: greyHasOpacity,
        }}>
        <View
          style={{
            width: perfectSize(1700),
            height: this.state.isShowEnterPrice ? perfectSize(900) : perfectSize(1180),
            flexDirection: 'column',
            backgroundColor: 'rgb(252,252,252)',
            borderRadius: 10,
            padding: 10,
            marginRight: 167,
            marginLeft: 167,
            marginTop: 200,
            marginBottom: 200,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 20,
          }}>
          {/* ORDER ID  */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingEnd: 30,
              paddingStart: 30,
              paddingTop: 25,
              paddingBottom: 13,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.isShowEnterPrice) {
                  this.setState({
                    isShowEnterPrice: false
                  })

                } else {

                  this.callCloseSelf('');
                }
                this.props.hide_enter_price()
              }}>
              <Image
                source={require('../image/icon_arrow_grey_right.png')}
                resizeMode="contain"
                style={{
                  width: perfectSize(55),
                  height: perfectSize(55),
                  alignSelf: 'flex-start',
                }}
              />
            </TouchableOpacity>

            <View
              style={{
                flex: 2,
                maxWidth: 1050 / 2,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'column',
                  marginStart: perfectSize(180),
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_71,
                      { color: c_text_grey, letterSpacing: -2.13 / 2, marginEnd: 5 },
                    ]}>
                    {langObj.orderID}
                  </Text>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_Bold_71,
                      { color: c_text_grey, letterSpacing: -2.13 / 2, paddingBottom: 7 },
                    ]}>
                    {this.state.orderItem.order_id}{' '}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_40,
                      { color: 'rgb(70,71,75)', letterSpacing: -1.68 / 2, marginEnd: 5 },
                    ]}>
                    {langObj.totalItems}:
                  </Text>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_40,
                      { color: 'rgb(70,71,75)', letterSpacing: -1.68 / 2, paddingBottom: 3 },
                    ]}>
                    {this.getTotalItem() + " "}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginStart: 10,
                }}>
                <View
                  style={{
                    width: perfectSize(85),
                    height: perfectSize(85),
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../image/pickup_icon.png')}
                    resizeMode="contain"
                    style={{
                      width: perfectSize(85),
                      height: perfectSize(85),
                    }}
                  />
                </View>
                <Text
                  style={[
                    globalStyles.textAlmoniDLAAA_40,
                    { letterSpacing: -1.41 / 2 },
                  ]}>
                  01:32:16
                  {/* {this.state.orderItem.order_type == 1
                    ? langObj.delivery
                    : langObj.pickup} */}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginStart: 20,
              }}
              onPress={() => {
                this.callCloseSelf('');
              }}>
              <Image
                source={require('../image/quantity_icon.png')}
                resizeMode="contain"
                style={{
                  width: perfectSize(40),
                  height: perfectSize(40),
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              display: this.state.isShowEnterPrice ? 'none' : 'flex'
            }}>
            <FlatList
              data={this.state.orderItem.products}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    height: perfectSize(170),
                    width: perfectSize(1050),
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingStart: 10,
                    paddingEnd: 10,
                    backgroundColor: bg_white,
                    margin: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.16,
                    shadowRadius: 5,
                    elevation: 5,
                    display: this.state.isShowSummary && !item.isSelected ? "none" : "flex"
                  }}>
                  <CheckBox
                    boxType={'square'}
                    tintColor={c_text_grey}
                    onTintColor={c_text_grey}
                    onCheckColor="#ffffff"
                    onFillColor={c_text_grey}
                    animationDuration={0}
                    style={{ marginStart: perfectSize(20.1), width: perfectSize(30), height: perfectSize(30), display: this.state.isShowSummary ? "none" : "flex" }}
                    value={item.isSelected}
                    onValueChange={() => {
                      this.updateSelectProduct(index);
                    }}
                  />
                  <View style={{ flexDirection: 'column', flex: 5 }}>
                    {/* <View style={[mStyle.line]} /> */}
                    <View style={[mStyle.itemContainer]}>
                      <View>
                        <Image
                          source={{ uri: item.product_image }}
                          resizeMode="cover"
                          style={{
                            marginTop: perfectSize(20),
                            marginStart: perfectSize(28.7),
                            width: perfectSize(124),
                            height: perfectSize(124),
                          }}
                        />
                      </View>
                      <Image
                        source={require("../image/quantity_icon.png")}
                        resizeMode="cover"
                        style={{
                          marginTop: perfectSize(62.4),
                          width: perfectSize(28),
                          height: perfectSize(28),
                          marginEnd: perfectSize(50),
                          marginStart: perfectSize(14.1)
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'column',

                          alignItems: 'center',
                        }}>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_112,
                            {
                              color: 'rgb(133,133,134)',
                             },
                          ]}>
                          {this.state.isShowSummary ? item.amount : item.max_amount}
                        </Text>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_30,
                            {
                              color: 'rgb(133,133,134)',
                              letterSpacing: -1.55 / 2,
                              marginBottom: perfectSize(6)

                            },
                          ]}>
                          {langObj.quantity}
                        </Text>
                      </View>
                      <View style={{ flex: 1, marginStart: perfectSize(48), marginTop: perfectSize(20) }}>
                        <Text style={[globalStyles.textAlmoniDLAAA_40, { fontSize: perfectSize(41), color: c_text_grey }]}>
                          {getProductName(item)}
                        </Text>
                        {/* MAKAT VIEW  */}
                        {/* <View style={{flex:0.6,flexDirection:"row",paddingTop:10, alignContent:"space-between",width:80}}>
                        <Text style={[globalStyles.textAlmoniDLAAA_30, {flex:1,fontSize:perfectSize(27),paddingTop:1.4,color:c_text_grey}]}>
                        מק״ט    
                        </Text>
                        <Text style={[globalStyles.textAlmoniDLAAA_30, {fontSize:perfectSize(32),color:c_text_grey}]}>
                           33767678
                        </Text>
                        </View> */}
                      </View>
                    </View>
                    <View
                      style={[
                        mStyle.line,
                        {
                          display:
                            index != this.state.orderItem.products.length - 1
                              ? 'none'
                              : 'flex',
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={{ display: this.state.isShowSummary ? 'flex' : 'none', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Text style={[globalStyles.textOscarFmRegular_70]}>
                      {item.price}
                    </Text>
                    <Text style={[globalStyles.textOscarFmRegular_30]}>
                      {langObj.nis}
                    </Text>
                  </View>
                  <View
                    style={{ flex: 1, alignSelf: 'flex-end', marginBottom: 10, display: this.state.isShowSummary ? "none" : "flex" }}>
                    <Text
                      style={
                        ([globalStyles.textAlmoniDLAAA_40],
                        {
                          color: 'rgb(247,186,72)',
                          textDecorationLine: 'underline',
                          letterSpacing: -1.28 / 2,
                        })
                      }>
                      {/* {langObj.productLink} */}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.product_id + item.option}
            />
          </View>
          <View style={{ flexDirection: 'column', display: this.state.isShowEnterPrice ? 'none' : 'flex' }}>
            <View style={{ flexDirection: 'column', display: this.state.isShowEnterPrice || this.state.isShowSummary ? 'none' : this.state.orderItem.notes == "" ? 'none' : 'flex' }}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_40,
                  {
                    width: perfectSize(1050),
                    margin: 0,
                    alignSelf: 'center',
                    color: 'rgb(209,210,212)',
                  },
                ]}>
                {langObj.orderComment}
              </Text>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_24,
                  {
                    width: perfectSize(1050),
                    margin: 10,
                    alignSelf: 'center',
                    backgroundColor: 'rgba(237,237,237, 0.5)',
                    borderRadius: 22,
                    paddingTop: 30,
                    paddingBottom: 30,
                    paddingEnd: 27,
                    paddingStart: 160,
                    color: 'rgb(133,133,134)',
                    letterSpacing: -0.5,
                  },
                ]}>
                {this.state.orderItem.notes}
              </Text>
            </View>
            <View style={{ flexDirection: 'column', display: this.state.isShowSummary ? "flex" : "none", width: perfectSize(1050), alignSelf: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ paddingEnd: 40, borderBottomWidth: 5, borderBottomColor: c_orange }}>
                  <Text style={[globalStyles.textOscarFmRegular_40]}>{langObj.summary}</Text>
                </View>
                <View style={{ flex: 1 }} />
                <Text style={[globalStyles.textOscarFmRegular_40]}>{getTotalPrice(this.state.orderItem) + " " + langObj.priceUnit}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={[globalStyles.textOscarFmRegular_40]}>{langObj.shippingCost}</Text>
                <View style={{ flex: 1 }} />
                <Text style={[globalStyles.textOscarFmRegular_40]}>{"100 " + langObj.priceUnit}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={[globalStyles.textOscarFmRegular_40]}>{langObj.total}</Text>
                <View style={{ flex: 1 }} />
                <Text style={[globalStyles.textOscarFmRegular_50]}>{getTotalPrice(this.state.orderItem) + 100).toFixed(2) + " " + langObj.priceUnit}</Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={this.checkButtonState() ? 0.5 : 1}
              onPress={() => {
                if (this.state.isShowEnterPrice || this.state.isShowSummary) {
                  if (this.checkIfProductEnteredPrice()) {
                    this.callCloseSelf(this.state.orderItem);
                    this.props.hide_enter_price();
                  }
                } else {
                  if (this.checkIfProductSelected()) {
                    this.setState({ isShowEnterPrice: true }, () => {
                      this.setState({
                        selected_product_avialable_quntity: this.state.orderItem.products[this.state.selectedIndex]['amount']
                      })
                      this.props.show_Enter_Price();
                      this.textInputPrice.focus();
                    });
                  }
                }
              }}
              style={[
                this.checkButtonState() ? mStyle.button : mStyle.buttonGrey,
                { marginTop: 15, height: perfectSize(110), marginBottom: perfectSize(77.3), width: perfectSize(1050) },
              ]}>
              <Text
                style={[globalStyles.textOscarFmRegular_50, { color: '#ffffff' }]}>
                {this.checkButtonState()
                  ? langObj.continue
                  : this.state.isShowEnterPrice
                    ? langObj.someProductMissPrice
                    : langObj.noProductSelected}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, display: this.state.isShowEnterPrice ? 'flex' : 'none', flexDirection: "row", alignItems: 'center', alignSelf: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.comeToNextSelectedProduct();
              }}
              style={{ flexDirection: "row", alignItems: 'center', padding: 10, display: this.state.selectedAmount == 1 ? "none" : "flex" }}>
              <Image
                source={require('../image/icon_arrow_grey_right.png')}
                resizeMode="cover"
                style={{
                  width: perfectSize(55),
                  height: perfectSize(55),
                }}
              />
            </TouchableOpacity>
            <View
              style={[mStyle.enterPriceContainer]}>
              <View style={{ flex: 1, backgroundColor: "#fffffff", flexDirection: 'column' }}>
                <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: this.state.orderItem.products[this.state.selectedIndex]['product_image'] }}
                    resizeMode="cover"
                    style={{
                      width: perfectSize(300),
                      height: perfectSize(300),
                    }} />
                </View>

                <View style={{ flexDirection: 'row', margin: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.textAlmoniDLAAA_40]}>
                      {getProductName(this.state.orderItem.products[this.state.selectedIndex])}
                    </Text>
                    <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                      {/* {langObj.sku + " " + this.state.orderItem.products[this.state.selectedIndex]['product_id']} */}
                    </Text>
                  </View>
                  <View
                    style={{ alignSelf: 'flex-end', }}>
                    <Text
                      style={
                        ([globalStyles.textAlmoniDLAAA_40],
                        {
                          color: 'rgb(247,186,72)',
                          textDecorationLine: 'underline',
                          letterSpacing: -1.28 / 2,
                        })
                      }>
                      {/* {langObj.productLink} */}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: bg_grey_no_opacity, flexDirection: 'column', padding: 5 }}>
                <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                  {langObj.itemNumber + ": " + (this.state.selectedIndex + 1)}
                </Text>
                <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                  {langObj.color + " " + langObj.unchanged}
                </Text>
                <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                  {langObj.customerNote + " " + this.state.orderItem.notes}
                </Text>
                <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                  {langObj.quantityWithD + " " + this.state.orderItem.products[this.state.selectedIndex]['max_amount'] + " " + langObj.orderUnit}
                </Text>
                <View
                  style={{
                    flexDirection: 'row', display: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] < 2 ? 'none' : 'flex'
                    , alignItems: 'center', marginTop: 5
                  }}>
                  <Text style={[globalStyles.textAlmoniDLAAA_24, { width: perfectSize(70) }]}>
                    {langObj.amountAvailable}
                  </Text>
                  <View style={{ flexDirection: 'column', flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flex: 1, display: this.state.orderItem.products[this.state.selectedIndex]['amount'] < 2 ? 'none' : 'flex' }} />


                      {/* MINUS SIGN */}
                      <TouchableOpacity
                        onPress={() => {
                          let allState = this.state;
                          if (allState.selected_product_avialable_quntity > 1) {
                            allState.selected_product_avialable_quntity = allState.selected_product_avialable_quntity - 1
                          }
                          this.setState(allState);
                        }}>
                        <Image
                          source={require('../image/icon_quantity_decrease.png')}
                          resizeMode="cover"
                          style={{
                            width: perfectSize(55),
                            height: perfectSize(55), margin: 5,
                            display: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] < 2 ? 'none' : 'flex'
                          }}
                        />
                      </TouchableOpacity>

                      {/* Quantity Input */}

                      <View style={{ flex: 1 }} />
                      <View style={{
                        flexDirection: 'row', display: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] < 2 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#ffffff', borderRadius: 10, marginStart: 10, marginEnd: 10, width: perfectSize(160), height: perfectSize(90)
                      }}>
                        <Text style={[globalStyles.textOscarFmRegular_50, { color: c_text_grey }]}>
                          {this.state.selected_product_avialable_quntity}
                        </Text>
                      </View>


                      {/* PLUS SIGN */}
                      <View style={[{ flex: 1 }]} />
                      <TouchableOpacity
                        onPress={() => {
                          let allState = this.state;
                          if (allState.selected_product_avialable_quntity < this.state.orderItem.products[this.state.selectedIndex]['max_amount']) allState.selected_product_avialable_quntity = allState.selected_product_avialable_quntity + 1
                          this.setState(allState);
                        }}>
                        <Image
                          source={require('../image/icon_quantity_increase.png')}
                          resizeMode="cover"
                          style={{
                            width: perfectSize(55),
                            height: perfectSize(55), margin: 5,
                            display: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] < 2 ? 'none' : 'flex',
                            opacity: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] <= this.state.selected_product_avialable_quntity ? 0.2 : 1

                          }}
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                    </View>
                    <Text style={[globalStyles.textAlmoniDLAAA_24, { color: bg_red, alignSelf: 'center', marginTop: 10 }]}>
                      {langObj.minium + " " + this.state.orderItem.products[this.state.selectedIndex]['max_amount'] + " " + langObj.orderUnit}
                    </Text>
                  </View>
                </View>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Text style={[globalStyles.textAlmoniDLAAA_24, { width: perfectSize(70) }]}>
                    {langObj.pricePerUnitInNIS}
                  </Text>
                  <TextInput
                    ref={input => this.textInputPrice = input}
                    value={this.state.orderItem.products[this.state.selectedIndex]['price']}
                    keyboardType="decimal-pad"
                    onChangeText={(value) => {
                      this.updateProductPrice(this.state.selectedIndex, value);
                      // let allState = this.state;
                      // allState.orderItem.products[this.state.selectedIndex]['price'] = value;
                      // this.setState(allState, ()=>{
                      //     this.checkIfProductEnteredPrice();
                      // });
                    }}
                    style={[
                      globalStyles.textOscarFmRegular_50,
                      { width: perfectSize(324), height: perfectSize(90), backgroundColor: "#ffffff", borderRadius: 10, flex: 1, margin: 10, textAlign: 'center' }
                    ]}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    if (this.checkIfProductEnteredPrice()) {
                      // this.callCloseSelf(this.state.orderItem);
                      Keyboard.dismiss();
                      let allState = this.state;
                      // for (let i = 0; i < allState.orderItem.products.length; i++){
                      //     allState.orderItem.products[i].isSelected = true;
                      // }
                      allState.isShowEnterPrice = false;
                      allState.isShowSummary = true;
                      this.props.hide_enter_price();
                      this.setState(allState);
                      this.state.orderItem.products[this.state.selectedIndex]['amount'] = this.state.selected_product_avialable_quntity;
                    } else {
                      this.comeToNextSelectedProduct();
                    }
                  }}
                  style={[
                    mStyle.button, {
                      marginTop: this.state.orderItem.products[this.state.selectedIndex]['max_amount'] < 2 ? 90 : 5
                      , width: '95%'
                    }
                  ]}>
                  <Text
                    style={[globalStyles.textOscarFmRegular_50, { color: '#ffffff' }]}>
                    {this.checkIfProductEnteredPrice() ? langObj.orderSummary : langObj.continue}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.comeToPreviousSelectedProduct();
              }}
              style={{ flexDirection: "row", alignItems: 'center', padding: 10, display: this.state.selectedAmount == 1 ? "none" : "flex" }}>
              <Image
                source={require('../image/icon_arrow_grey_left.png')}
                resizeMode="cover"
                style={{
                  width: perfectSize(55),
                  height: perfectSize(55),
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity
          onPress={() => {
            this.callCloseSelf('');
          }}
          style={[mStyle.buttonGrey, {margin: 10, width: screenWidth * 0.2}]}>
          <Text style={[globalStyles.textGeneral, {color: '#ffffff'}]}>
            {langObj.cancel}
          </Text>
        </TouchableOpacity> */}
        <View
          style={{
            width: this.state.indicatorSizeW,
            height: this.state.indicatorSizeH,
            backgroundColor: greyHasOpacity,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            animating={this.state.indicatorDisplay}
            size="large"
            color={c_loading_icon}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

let langObj = getLanguage();
let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const mStyle = StyleSheet.create({
  textTimeCirle: {
    fontFamily: 'HelveticaNeue',
    fontSize: 22,
    fontWeight: 'bold',
    width: screenWidth * 0.07,
    height: screenWidth * 0.07,
    borderRadius: screenWidth * 0.035,
    borderColor: c_text_grey,
    borderWidth: 1,
    textAlign: 'center',
    lineHeight: screenWidth * 0.06,
  },
  textBubble: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    backgroundColor: bg_yellow_bubble,
    color: '#000000',
    padding: 10,
    borderRadius: 5,
  },
  line: {
    alignItems: 'stretch',
    height: 1,
    backgroundColor: greyHasOpacity,
    margin: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
  },
  button: {
    width: screenWidth * 0.3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: bg_dark,
    color: '#ffffff',
  },
  buttonGrey: {
    width: screenWidth * 0.3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: bg_button_grey,
    color: '#ffffff',
  },
  footerLabel: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    backgroundColor: c_text_blue,
    color: '#ffffff',
  },
  enterPriceContainer: {
    width: perfectSize(1050),
    height: perfectSize(570),
    flexDirection: 'row',
    backgroundColor: bg_white,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 5,
  }
});
