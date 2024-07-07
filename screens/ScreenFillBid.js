import {SubmitBidHeader} from './submitBidHeader';
import {IncomingBarStyle} from '../components/IncomingOrdersBar/style';
import {
  generateSpecialProductKey,
  getOptionsArray,
} from '../resource/dibbleCommon';
// import globalSass from '../../resource/style/globalSass.scss';
/* eslint-disable react-native/no-inline-styles */
/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */
import ProgressImage from 'react-native-image-progress';
import {ProgressBar} from 'react-native-progress/Bar';
import {
  getDataWithSubKey,
  thousandsFilter,
  callPlaceBid,
  merge_amount_update_with_bid,
  merge_amount_update,
  getProductName,
  makeAPostRequest,
  merge_last_bid_with_current_delete,
} from '../resource/SupportFunction';
import Dialog from 'react-native-dialog';

import * as React from 'react';
import {
  View,
  Text,
  Animated,
  TextInput,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  bg_button_grey,
  bg_dark,
  bg_grey,
  bg_grey_no_opacity,
  bg_red,
  bg_white,
  bg_yellow_bubble,
  rq_supplier_get_order_details,
  c_loading_icon,
  c_orange,
  c_text_blue,
  c_text_grey,
  c_text_yellow,
  modal_submit_bid,
  greyHasOpacity,
  order_type_pickup,
  rq_place_bid,
  modal_select_delivery_method,
  sub_key_token,
  key_user_info,
  order_type,
} from '../resource/BaseValue';
import CheckBox from '@react-native-community/checkbox';
import getLanguage, {getPerfectSize} from '../resource/LanguageSupport';
import {globalStyles} from '../resource/style/global';
import {getTotalPrice} from '../resource/SupportFunction';
export default class SelectProductScreen extends React.Component {
  constructor(props) {
    super(props);
    //console.log(JSON.stringify(this.props.orderSelected));
    let orderSelected = this.props.orderSelected;
    let selectedIndex = orderSelected.products.findIndex(p => p.isSelected);
    if (selectedIndex == null) {
      selectedIndex = -1;
    }
    this.state = {
      isShowAlert: false,
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      endReached: false,
      indicatorDisplay: false,
      isShowEnterPrice: false,
      orderItem: orderSelected,
      selectedIndex: selectedIndex,
      selected_product_avialable_quntity: orderSelected.products[0]['amount'],
      selectedAmount: 0,
      isShowSummary: !this.props.to_reset,
    };
  }

  callCloseSelf = data => {
    if (data == '') {
      this.props.closeModal();
    } else {
      let updatedOrder = {...data};
      updatedOrder.products = [];
      for (let i = 0; i < data.products.length; i++) {
        if (data.products[i]['isSelected']) {
          //console.log('data.products true' + i);
          updatedOrder.products.push(data.products[i]);
        }
      }
      if (data.order_type == order_type_pickup) {
        this.props.goToFrame(this.state.orderItem, modal_submit_bid);
      } else {
        this.props.goToFrame(this.state.orderItem, modal_submit_bid);
      }
    }
  };
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (
      this.props.orderSelected.order_id !== prevProps.orderSelected.order_id
    ) {
      // alert('here')

      let orderSelected = this.props.orderSelected;
      let selectedIndex = orderSelected.products.findIndex(p => p.isSelected);
      if (selectedIndex == null) {
        selectedIndex = -1;
      }
      let new_state = {
        isShowAlert: false,
        indicatorSizeW: 0,
        indicatorSizeH: 0,
        endReached: false,
        indicatorDisplay: false,
        isShowEnterPrice: false,
        orderItem: orderSelected,
        selectedIndex: selectedIndex,
        selected_product_avialable_quntity: orderSelected.products[0]['amount'],
        selectedAmount: 0,
        isShowSummary: !this.props.to_reset,
      };
      this.setState(new_state, this.fetchNewOrder);
    }
  }

  componentDidMount() {
    if (
      !this.state.orderItem.new_bid &&
      !this.state.orderItem.cameFromDelivery
    ) {
      getDataWithSubKey(key_user_info, sub_key_token, token => {
        let dataObj = {
          request: rq_supplier_get_order_details,
          token: token,
          order_id: this.state.orderItem.order_id,
        };
        console.log(dataObj);
        makeAPostRequest(
          dataObj,
          () => {
            this._showLoadingBox();
          },
          () => {
            this._closeLoadingBox();
          },
          (isSuccess, responseJson) => {
            if (isSuccess) {
              console.log('success');
              this.setState({
                orderItem: {
                  ...responseJson,
                  products: responseJson.products.map(p => {
                    return {...p, max_amount: p.amount};
                  }),
                },
              });
            } else {
              console.log(responseJson);
            }
          },
        );
      });
    }
  }

  fetchNewOrder() {
    if (
      !this.state.orderItem.new_bid &&
      !this.state.orderItem.cameFromDelivery
    ) {
      getDataWithSubKey(key_user_info, sub_key_token, token => {
        let dataObj = {
          request: rq_supplier_get_order_details,
          token: token,
          order_id: this.state.orderItem.order_id,
        };
        console.log(dataObj);
        makeAPostRequest(
          dataObj,
          () => {
            this._showLoadingBox();
          },
          () => {
            this._closeLoadingBox();
          },
          (isSuccess, responseJson) => {
            if (isSuccess) {
              console.log('success');
              this.setState({
                orderItem: {
                  ...responseJson,
                  products: responseJson.products.map(p => {
                    return {...p, max_amount: p.amount};
                  }),
                },
              });
            } else {
              console.log(responseJson);
            }
          },
        );
      });
    }
  }

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

  updateSelectProduct = index => {
    let allState = this.state;
    let is_selected = !allState.orderItem.products[index]['isSelected'];
    allState.orderItem.products[index]['isSelected'] = is_selected;
    if (!is_selected && index == allState.selectedIndex) {
      let selectedIndex = allState.orderItem.products.findIndex(
        p => p.isSelected,
      );
      if (selectedIndex == null) {
        selectedIndex = -1;
      }
      allState.selectedIndex = selectedIndex;
    }

    if (is_selected) {
      allState.selectedAmount += 1;
      if (allState.selectedIndex == -1) {
        allState.selectedIndex = index;
      }
    } else {
      allState.selectedAmount -= 1;
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

  checkIfAllProductSelected() {
    let isSelected = true;
    for (let i = 0; i < this.state.orderItem.products.length; i++) {
      isSelected = isSelected && this.state.orderItem.products[i]['isSelected'];
    }
    return isSelected;
  }

  checkIfProductEnteredPrice() {
    for (let i = 0; i < this.state.orderItem.products.length; i++) {
      if (this.state.orderItem.products[i]['isSelected']) {
        if (
          this.state.orderItem.products[i]['price'] == '' ||
          this.state.orderItem.products[i]['price'] == '0'
        ) {
          return false;
        }
      }
    }
    return true;
  }

  checkIfProductEnteredAmount() {
    let count = 0;
    for (let i = 0; i < this.state.orderItem.products.length; i++) {
      if (this.state.orderItem.products[i]['isSelected']) {
        if (!this.state.orderItem.products[i]['amount_updated']) {
          count += 1;
        }
      }
    }
    return count < 2;
  }

  updateProductPrice = (index, price) => {
    let allState = this.state;
    allState.orderItem.products[index]['price'] = price.replace(/[^0-9.]/g, '');
    this.setState(allState);
  };

  getTotalItem = () => {
    let totalItem = 0;
    for (let i = 0; i < this.state.orderItem.products.length; i++) {
      if (this.state.orderItem.products[i]['isSelected']) {
        totalItem =
          totalItem + parseInt(this.state.orderItem.products[i].amount);
      }
    }
    return totalItem;
  };
  proceedFlow = () => {
    this.setState({isShowEnterPrice: true, isShowAlert: false}, () => {
      this.setState({
        selected_product_avialable_quntity:
          this.state.orderItem.products[this.state.selectedIndex]['amount'],
      });
      this.props.show_Enter_Price();
      //this.callCloseSelf(this.state.orderItem);
    });
  };

  renderProduct = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (!this.state.isShowSummary) {
          this.updateSelectProduct(index);
        }
      }}>
      <View
        style={{
          paddingTop: perfectSize(20),
          paddingBottom: perfectSize(16),
          width: perfectSize(1050),
          flexDirection: 'row',
          alignItems: 'center',
          paddingStart: 10,
          paddingEnd: 10,
          backgroundColor:
            item.isSelected && !this.state.isShowSummary ? '#ffe8bc' : bg_white,
          margin: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.16,
          shadowRadius: 5,
          elevation: 5,
          display:
            this.state.isShowSummary && !item.isSelected ? 'none' : 'flex',
        }}>
        {/* <CheckBox
      boxType={'square'}
      tintColor={c_text_grey}
      onTintColor={c_text_grey}
      onCheckColor="#ffffff"
      
      onFillColor={c_text_grey}
      animationDuration={0}
      style={{marginStart:perfectSize(20.1), width:perfectSize(30), height:perfectSize(30), display:this.state.isShowSummary?"none":"flex"}}
      value={item.isSelected}
      onValueChange={() => {
        //this.updateSelectProduct(index);
      }}
    /> */}

        <Image
          source={
            item.isSelected
              ? require('../image/checkbox/checked.png')
              : require('../image/checkbox/unchecked.png')
          }
          resizeMode="cover"
          style={{
            width: perfectSize(24.2),
            height: perfectSize(24.2),
            display: this.state.isShowSummary ? 'none' : 'flex',
          }}></Image>

        <View style={{flexDirection: 'column', flex: 5}}>
          {/* <View style={[mStyle.line]} /> */}
          <View style={[mStyle.itemContainer]}>
            <View>
              <ProgressImage
                source={{uri: item.product_image}}
                indicator={ProgressBar}
                indicatorProps={{
                  color: c_orange,
                }}
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
              source={require('../image/quantity_icon.png')}
              resizeMode="cover"
              style={{
                marginTop: perfectSize(62.4),
                width: perfectSize(28),
                height: perfectSize(28),
                marginEnd: perfectSize(50),
                marginStart: perfectSize(14.1),
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
                    marginBottom: perfectSize(6),
                  },
                ]}>
                {langObj.quantity}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
                marginStart: perfectSize(48),
              }}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_40,
                  {
                    fontSize: perfectSize(41),
                    color: c_text_grey,
                    maxWidth: perfectSize(430),
                  },
                ]}>
                {getProductName(item)}
              </Text>

              <View
                style={{flexDirection: 'row', flexWrap: 'wrap', padding: 0}}>
                {getOptionsArray(item).map((option, index) => (
                  <Text
                  // style={[globalSass.AlmoniDLAAA_20]}
                  >
                    <Text
                    // style={globalSass['AlmoniDLAAA-Bold_20']}
                    >
                      {' '}
                      {option.name}
                    </Text>
                    : {option.value}
                  </Text>
                ))}
              </View>
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
          {/* <View
        style={[
          mStyle.line,
          {
            display:
              index != this.state.orderItem.products.length - 1
                ? 'none'
                : 'flex',
          },
        ]}
      /> */}
        </View>

        {/* Summery View */}
        <View
          style={{
            // display: this.state.isShowSummary ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Text style={[globalStyles.textOscarFmRegular_50]}>
            {thousandsFilter(item.price)}
          </Text>
          <Text style={[globalStyles.textOscarFmRegular_30]}>
            {langObj.nis} {item.max_amount > 1 ? langObj.perUnit : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  showProductsAlert = () => {
    console.log('showProductsAlert');

    this.setState({isShowAlert: true});
    // Alert.alert(
    //   langObj.alert,
    //   langObj.not_all_products,
    //   [
    //     {
    //       text: langObj.no,
    //       onPress: () =>{},
    //       style: "cancel",
    //     },
    //     {
    //       text: langObj.yes,
    //       onPress: () => this.proceedFlow(),
    //       style: "default",
    //     },
    //   ],
    //   {
    //     cancelable: true,

    //   }

    // );
  };
  comeToNextSelectedProduct = () => {
    this.state.orderItem.products[this.state.selectedIndex][
      'amount_updated'
    ] = true;
    this.state.orderItem.products[this.state.selectedIndex]['amount'] =
      this.state.selected_product_avialable_quntity;

    let selectedIndex = parseInt(this.state.selectedIndex);
    let found = false;
    while (!found) {
      selectedIndex =
        (selectedIndex + 1) % this.state.orderItem.products.length;
      if (this.state.orderItem.products[selectedIndex]['isSelected']) {
        found = true;
      }
    }

    this.setState({
      selectedIndex: selectedIndex,
    });

    this.setState({
      selected_product_avialable_quntity:
        this.state.orderItem.products[selectedIndex]['amount'],
    });
  };
  backButtonFunctionality = () => {
    if (this.state.isShowEnterPrice) {
      this.setState({
        isShowEnterPrice: false,
      });
    } else if (this.state.isShowSummary) {
      this.setState({
        isShowSummary: false,
        isShowEnterPrice: true,
      });
    } else {
      this.callCloseSelf('');
    }
    this.props.hide_enter_price();
  };
  comeToPreviousSelectedProduct = () => {
    this.state.orderItem.products[this.state.selectedIndex][
      'amount_updated'
    ] = true;
    this.state.orderItem.products[this.state.selectedIndex]['amount'] =
      this.state.selected_product_avialable_quntity;

    let selectedIndex = parseInt(this.state.selectedIndex);
    let found = false;
    while (!found) {
      selectedIndex = selectedIndex - 1;
      if (selectedIndex < 0) {
        selectedIndex = selectedIndex + this.state.orderItem.products.length;
      }
      selectedIndex = selectedIndex % this.state.orderItem.products.length;
      if (this.state.orderItem.products[selectedIndex]['isSelected']) {
        found = true;
      }
    }

    this.setState({
      selectedIndex: selectedIndex,
    });

    this.setState({
      selected_product_avialable_quntity:
        this.state.orderItem.products[selectedIndex]['amount'],
    });
  };

  render() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
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
            height: perfectSize(1500),
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
          <SubmitBidHeader
            show_total={true}
            show_close={true}
            displayBack={
              this.state.isShowSummary || this.state.isShowEnterPrice
            }
            backButtonFunctionality={this.backButtonFunctionality}
            show_close={!this.state.orderItem.new_bid}
            orderItem={this.state.orderItem}
            callCloseSelf={this.callCloseSelf}
            calculate_total_items={this.getTotalItem}
          />

          {/* Item Selection View */}
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              display: this.state.isShowEnterPrice ? 'none' : 'flex',
            }}>
            {this.state.orderItem.new_bid &&
            !this.state.isShowSummary &&
            !this.state.isShowEnterPrice ? (
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_40,
                  {color: 'red', marginTop: perfectSize(-30)},
                ]}>
                {langObj.selectProductsYouGot}
              </Text>
            ) : null}

            {this.state.isShowSummary ? (
              <FlatList
                ref={list => (this.summaryList = list)}
                indicatorStyle={'black'}
                data={this.state.orderItem.products.filter(p => p.isSelected)}
                onEndReached={() => this.setState({endReached: true})}
                onEndReachedThreshold={0.1}
                renderItem={this.renderProduct}
                keyExtractor={item => generateSpecialProductKey(item)}
                listKey={'summary_list'}
              />
            ) : (
              <FlatList
                indicatorStyle={'black'}
                data={this.state.orderItem.products}
                onEndReached={() => this.setState({endReached: true})}
                onEndReachedThreshold={0.1}
                renderItem={this.renderProduct}
                keyExtractor={item => generateSpecialProductKey(item)}
                listKey={'select_list'}
              />
            )}
            <Animated.View
              style={{
                height: perfectSize(60),
                opacity: this.state.endReached ? 0 : 1,
                width: perfectSize(1050),
                marginTop: perfectSize(20),
                borderRadius: perfectSize(20),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {!this.state.endReached && !this.state.isShowSummary ? (
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(35),
                  }}>
                  {langObj.scrollToEnd}
                </Text>
              ) : null}
            </Animated.View>
            <View
              style={{
                flexDirection: 'column',
                display: this.state.isShowEnterPrice ? 'none' : 'flex',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  display:
                    this.state.isShowEnterPrice || this.state.isShowSummary
                      ? 'none'
                      : this.state.orderItem.notes == ''
                      ? 'none'
                      : 'flex',
                  margin: perfectSize(10),
                }}>
                <Text
                  style={[
                    IncomingBarStyle.orderNotesTitle,
                    {alignSelf: 'flex-start'},
                  ]}>
                  {langObj.orderComment}
                </Text>
                <ScrollView
                  style={[
                    IncomingBarStyle.notesContainerFull,
                    {width: perfectSize(1050), alignSelf: 'center'},
                  ]}>
                  <Text style={[IncomingBarStyle.userNotes]}>
                    {this.state.orderItem.notes}
                  </Text>
                </ScrollView>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'column',
                // display: this.state.isShowSummary ? 'flex' : 'none',
                width: perfectSize(1050),
                alignSelf: 'center',
              }}>
              {/* <View style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
                        <Text style={[globalStyles.textOscarFmRegular_40]}>{langObj.shippingCost}</Text>
                        <View style={{flex:1}}/>
                        <Text style={[globalStyles.textOscarFmRegular_40]}>{"100 " + langObj.priceUnit}</Text>
                    </View> */}

              <View
                style={{
                  width: perfectSize(1050),
                  height: perfectSize(10),
                  backgroundColor: '#ffca1a',
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <Text style={[globalStyles.textOscarFmRegular_40]}>
                  {langObj.total}
                </Text>
                <View style={{flex: 1}} />
                <Text style={[globalStyles.textOscarFmRegular_50]}>
                  {getTotalPrice(this.state.orderItem, true) +
                    ' ' +
                    langObj.priceUnit}
                </Text>
              </View>
            </View>
            {/* Continue BTN */}

            <TouchableOpacity
              disabled={
                !this.state.isShowEnterPrice &&
                !this.state.isShowSummary &&
                !this.state.endReached
              }
              onPress={() => {
                if (this.props.new_flow) {
                  // if (this.state.isShowEnterPrice || this.state.isShowSummary) {
                  //     if (this.checkIfProductEnteredPrice()) {
                  //         this.callCloseSelf(this.state.orderItem);
                  //     }

                  // } else {
                  //     if (this.checkIfProductSelected()) {
                  //         this.setState({isShowEnterPrice: true}, ()=>{
                  //             this.textInputPrice.focus();
                  //         });
                  //     }
                  // }
                  if (this.state.isShowEnterPrice || this.state.isShowSummary) {
                    if (this.checkIfProductEnteredAmount()) {
                      this.callCloseSelf(this.state.orderItem);
                      this.props.hide_enter_price();
                    }
                  }

                  if (this.checkIfProductSelected()) {
                    if (
                      !this.checkIfAllProductSelected() &&
                      !this.state.isShowSummary
                    ) {
                      this.showProductsAlert();
                    } else {
                      this.proceedFlow();
                    }
                  }
                } else {
                  if (this.state.isShowEnterPrice || this.state.isShowSummary) {
                    if (this.checkIfProductEnteredPrice()) {
                      this.callCloseSelf(this.state.orderItem);
                      this.props.hide_enter_price();
                    }
                  } else {
                    if (this.checkIfProductSelected()) {
                      this.setState({isShowEnterPrice: true}, () => {
                        this.setState({
                          selected_product_avialable_quntity:
                            this.state.orderItem.products[
                              this.state.selectedIndex
                            ]['amount'],
                        });
                        this.props.show_Enter_Price();
                        this.textInputPrice.focus();
                      });
                    }
                  }
                }
              }}
              style={[
                (this.state.isShowEnterPrice ||
                  this.state.isShowSummary ||
                  this.state.endReached) &&
                this.checkButtonState()
                  ? mStyle.button
                  : mStyle.buttonGrey,
                {
                  marginTop: 15,
                  height: perfectSize(110),
                  width: perfectSize(1050),
                  marginBottom: this.state.orderItem.new_bid
                    ? 0
                    : perfectSize(80),
                },
              ]}>
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#ffffff'},
                ]}>
                {this.checkButtonState()
                  ? langObj.continue
                  : this.state.isShowEnterPrice
                  ? langObj.someProductMissPrice
                  : langObj.noProductSelected}
              </Text>
            </TouchableOpacity>

            {this.state.orderItem.new_bid ? (
              <TouchableOpacity
                onPress={() =>
                  callPlaceBid(
                    merge_last_bid_with_current_delete(
                      this.state.orderItem.bidded_products,
                      this.state.orderItem.removed_products,
                    ),
                    this.state.orderItem,
                    this.props.closeModalBid,
                    this._showLoadingBox.bind(this),
                    this._closeLoadingBox.bind(this),
                  )
                }
                style={{marginTop: perfectSize(40)}}>
                <Text
                  style={[
                    globalStyles.lackOfProductBtn,
                    {marginBottom: perfectSize(30)},
                  ]}>
                  {langObj.dontHaveProducts}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Bids Screens */}
          {this.state.isShowEnterPrice && this.state.selectedIndex !== -1 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={this.comeToNextSelectedProduct}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  display: this.state.selectedAmount == 1 ? 'none' : 'flex',
                }}>
                <Image
                  source={require('../image/icon_arrow_grey_right.png')}
                  resizeMode="cover"
                  style={{
                    width: perfectSize(55),
                    height: perfectSize(55),
                  }}
                />
              </TouchableOpacity>
              <View style={[mStyle.enterPriceContainer]}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#fffffff',
                    flexDirection: 'column',
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <ProgressImage
                      indicator={ProgressBar}
                      indicatorProps={{
                        color: c_orange,
                      }}
                      source={{
                        uri: this.state.orderItem.products[
                          this.state.selectedIndex
                        ]['product_image'],
                      }}
                      resizeMode="cover"
                      style={{
                        width: perfectSize(700),
                        height: perfectSize(700),
                      }}
                    />
                  </View>

                  <View style={{flexDirection: 'row', margin: 10}}>
                    <View style={{alignSelf: 'flex-end'}}>
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
                <View
                  style={{
                    flex: 1,
                    backgroundColor: bg_grey_no_opacity,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      marginBottom: 'auto',
                      marginTop: perfectSize(50),
                      padding: perfectSize(30),
                    }}>
                    <View style={{}}>
                      <Text
                      // style={[globalSass.AlmoniDLAAA_20]}
                      >
                        {langObj.itemNumber +
                          ': ' +
                          (this.state.selectedIndex + 1)}
                      </Text>
                      <Text
                      // style={[globalSass['AlmoniDLAAA-Bold_30']]}
                      >
                        {getProductName(
                          this.state.orderItem.products[
                            this.state.selectedIndex
                          ],
                        )}
                      </Text>
                      <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                        {/* {langObj.sku + " " + this.state.orderItem.products[this.state.selectedIndex]['product_id']} */}
                      </Text>
                    </View>

                    {/* <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                            {langObj.color + " " +  langObj.unchanged}
                        </Text> */}
                    {/* <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                            {langObj.customerNote + " " + this.state.orderItem.notes}
                        </Text> */}
                    {/* <Text style={[globalStyles.textAlmoniDLAAA_24]}>
                            {langObj.quantityWithD + " " + this.state.orderItem.products[this.state.selectedIndex]['max_amount'] + " " + langObj.orderUnit}
                        </Text> */}

                    <View
                      style={{
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        padding: 0,
                      }}>
                      {getOptionsArray(
                        this.state.orderItem.products[this.state.selectedIndex],
                      ).map((option, index) => (
                        <Text
                        // style={[globalSass.AlmoniDLAAA_20]}
                        >
                          <Text
                          // style={globalSass['AlmoniDLAAA-Bold_20']}
                          >
                            {' '}
                            {option.name}
                          </Text>
                          : {option.value}
                        </Text>
                      ))}
                    </View>

                    <View
                      style={{
                        display:
                          this.state.orderItem.products[
                            this.state.selectedIndex
                          ]['max_amount'] < 2
                            ? 'none'
                            : 'flex',
                        alignItems: 'center',
                        marginTop: perfectSize(40),
                        flexDirection: 'column',
                      }}>
                      <Text style={[globalStyles.textAlmoniDLAAA_30]}>
                        {langObj.amountAvailable}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <View style={{flexDirection: 'column', flex: 1}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                display:
                                  this.state.orderItem.products[
                                    this.state.selectedIndex
                                  ]['amount'] < 2
                                    ? 'none'
                                    : 'flex',
                              }}
                            />

                            {/* MINUS SIGN */}
                            <TouchableOpacity
                              onPress={() => {
                                let allState = this.state;
                                if (
                                  allState.selected_product_avialable_quntity >
                                  1
                                ) {
                                  allState.selected_product_avialable_quntity =
                                    allState.selected_product_avialable_quntity -
                                    1;
                                }
                                this.setState(allState);
                              }}>
                              <Image
                                source={require('../image/icon_quantity_decrease.png')}
                                resizeMode="cover"
                                style={{
                                  width: perfectSize(100),
                                  height: perfectSize(100),
                                  margin: 5,
                                  display:
                                    this.state.orderItem.products[
                                      this.state.selectedIndex
                                    ]['max_amount'] < 2
                                      ? 'none'
                                      : 'flex',
                                }}
                              />
                            </TouchableOpacity>

                            {/* Quantity Input */}

                            <View style={{flex: 1}} />
                            <View
                              style={{
                                flexDirection: 'row',
                                display:
                                  this.state.orderItem.products[
                                    this.state.selectedIndex
                                  ]['max_amount'] < 2
                                    ? 'none'
                                    : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                borderRadius: 10,
                                marginStart: 10,
                                marginEnd: 10,
                                width: perfectSize(160),
                                height: perfectSize(90),
                              }}>
                              <Text
                                style={[
                                  globalStyles.textOscarFmRegular_50,
                                  {color: c_text_grey},
                                ]}>
                                {this.state.selected_product_avialable_quntity}
                              </Text>
                            </View>

                            {/* PLUS SIGN */}
                            <View style={[{flex: 1}]} />
                            <TouchableOpacity
                              onPress={() => {
                                let allState = this.state;
                                if (
                                  allState.selected_product_avialable_quntity <
                                  this.state.orderItem.products[
                                    this.state.selectedIndex
                                  ]['max_amount']
                                )
                                  allState.selected_product_avialable_quntity =
                                    allState.selected_product_avialable_quntity +
                                    1;
                                this.setState(allState);
                              }}>
                              <Image
                                source={require('../image/icon_quantity_increase.png')}
                                resizeMode="cover"
                                style={{
                                  width: perfectSize(100),
                                  height: perfectSize(100),
                                  margin: 5,
                                  display:
                                    this.state.orderItem.products[
                                      this.state.selectedIndex
                                    ]['max_amount'] < 2
                                      ? 'none'
                                      : 'flex',
                                  opacity:
                                    this.state.orderItem.products[
                                      this.state.selectedIndex
                                    ]['max_amount'] <=
                                    this.state
                                      .selected_product_avialable_quntity
                                      ? 0.2
                                      : 1,
                                }}
                              />
                            </TouchableOpacity>
                            <View style={{flex: 1}} />
                          </View>
                          <Text
                            style={[
                              globalStyles.textAlmoniDLAAA_30,
                              {
                                color: bg_red,
                                alignSelf: 'center',
                                marginTop: 10,
                              },
                            ]}>
                            {langObj.alert +
                              ' ' +
                              this.state.orderItem.products[
                                this.state.selectedIndex
                              ]['max_amount'] +
                              ' ' +
                              langObj.unitsInOrder}
                          </Text>
                          <Text
                            style={[
                              globalStyles.textAlmoniDLAAA_30,
                              {
                                color: bg_red,
                                alignSelf: 'center',
                                marginTop: 10,
                              },
                            ]}>
                            {langObj.enterQuantity}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          display:
                            this.props.new_flow == true ? 'none' : 'flex',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_24,
                            {width: perfectSize(70)},
                          ]}>
                          {langObj.pricePerUnitInNIS}
                        </Text>
                        <TextInput
                          ref={input => (this.textInputPrice = input)}
                          value={
                            this.state.orderItem.products[
                              this.state.selectedIndex
                            ]['price']
                          }
                          keyboardType="decimal-pad"
                          onChangeText={value => {
                            this.updateProductPrice(
                              this.state.selectedIndex,
                              value,
                            );
                            // let allState = this.state;
                            // allState.orderItem.products[this.state.selectedIndex]['price'] = value;
                            // this.setState(allState, ()=>{
                            //     this.checkIfProductEnteredPrice();
                            // });
                          }}
                          style={[
                            globalStyles.textOscarFmRegular_50,
                            {
                              width: perfectSize(324),
                              height: perfectSize(90),
                              backgroundColor: '#ffffff',
                              borderRadius: 10,
                              flex: 1,
                              margin: 10,
                              textAlign: 'center',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (
                        this.checkIfProductEnteredPrice() &&
                        this.checkIfProductEnteredAmount()
                      ) {
                        // this.callCloseSelf(this.state.orderItem);
                        Keyboard.dismiss();
                        let allState = this.state;
                        // for (let i = 0; i < allState.orderItem.products.length; i++){
                        //     allState.orderItem.products[i].isSelected = true;
                        // }

                        if (!this.state.orderItem.new_bid) {
                          allState.isShowEnterPrice = false;
                          allState.isShowSummary = true;
                        }
                        allState.orderItem.products[this.state.selectedIndex][
                          'amount'
                        ] = this.state.selected_product_avialable_quntity;
                        if (this.state.orderItem.new_bid) {
                          if (this.state.orderItem.bidded_products.length > 0) {
                            callPlaceBid(
                              merge_amount_update_with_bid(
                                this.state.orderItem.new_order_products,
                                this.state.orderItem.products,
                                this.state.orderItem.bidded_products,
                                this.state.orderItem.added_products,
                              ),
                              this.state.orderItem,
                              this.props.closeModalBid,
                              this._showLoadingBox.bind(this),
                              this._closeLoadingBox.bind(this),
                            );
                          } else {
                            callPlaceBid(
                              merge_amount_update(
                                this.state.orderItem.new_order_products,
                                this.state.orderItem.products,
                              ),
                              this.state.orderItem,
                              this.props.closeModalBid,
                              this._showLoadingBox.bind(this),
                              this._closeLoadingBox.bind(this),
                            );
                          }
                        }
                        this.setState(allState, () => {
                          if (this.state.isShowSummary) {
                            this.summaryList.scrollToOffset(0);
                          }
                        });

                        //   if(!this.state.orderItem.new_bid){
                        //   this.callCloseSelf(this.state.orderItem);
                        // this.props.hide_enter_price();
                        //   }
                      } else {
                        this.comeToNextSelectedProduct();
                      }
                    }}
                    style={[
                      mStyle.button,
                      {
                        marginBottom: perfectSize(20),
                        width: '95%',
                      },
                    ]}>
                    <Text
                      style={[
                        globalStyles.textOscarFmRegular_50,
                        {color: '#ffffff'},
                      ]}>
                      {this.checkIfProductEnteredAmount()
                        ? this.state.orderItem.new_bid
                          ? langObj.close
                          : langObj.orderSummary
                        : langObj.continue}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Previous Product Button */}
              <TouchableOpacity
                onPress={this.comeToPreviousSelectedProduct}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  display: this.state.selectedAmount == 1 ? 'none' : 'flex',
                }}>
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
          ) : null}
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
        <Dialog.Container visible={this.state.isShowAlert}>
          <Dialog.Title>{langObj.alert}</Dialog.Title>
          <Dialog.Description>{langObj.not_all_products}</Dialog.Description>
          <Dialog.Button
            onPress={() => this.setState({isShowAlert: false})}
            label={langObj.no}
          />
          <Dialog.Button onPress={this.proceedFlow} label={langObj.yes} />
        </Dialog.Container>
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
    backgroundColor: 'rgba(0,0,0,1)',
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
    backgroundColor: 'rgba(65,69,66,0.3)',
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
    width: perfectSize(1500),
    height: perfectSize(1100),
    flexDirection: 'row',
    backgroundColor: bg_white,
    margin: perfectSize(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 5,
  },
});
