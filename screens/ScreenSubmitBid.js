/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */
import ProgressImage from 'react-native-image-progress';
import {ProgressBar} from 'react-native-progress/Bar';

import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
// import globalSass from '../../resource/style/globalSass.scss';

import {getOptionsArray} from '../resource/dibbleCommon';
import {
  bg_red,
  bg_white,
  c_loading_icon,
  c_orange,
  c_text_grey,
  c_text_label,
  greyHasOpacity,
  key_user_info,
  order_type_scheduled,
  rq_place_bid,
  sub_key_token,
  modal_select_product,
  modal_select_delivery_method,
  order_type,
  order_type_pickup,
} from '../resource/BaseValue';
import getLanguage, {getPerfectSize} from '../resource/LanguageSupport';
import {
  getDataWithSubKey,
  getHourFormat,
  getItemLogoSource,
  getProductName,
  getTotalPrice,
  makeAPostRequest,
} from '../resource/SupportFunction';
import moment from 'moment';
import {globalStyles} from '../resource/style/global';
import {SubmitBidHeader} from './submitBidHeader';

export default class SubmitBidScreen extends React.Component {
  constructor(props) {
    super(props);
    let orderSelected = this.props.orderSelected;
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      called_place_bid: false,
      indicatorDisplay: false,
      isShowEnterPrice: false,
      orderItem: orderSelected,
      isIncreaseMinutes: false,
      isDecreaseMinutes: false,
    };
  }
  componentDidMount() {
    let orderSelected = this.state.orderItem;
    if (!orderSelected.moreMinutesAdded) {
      orderSelected.moreMinutesAdded = 0;
    }
    this.setState({orderItem: orderSelected});
  }

  callIncreaseMoreTime = () => {
    setTimeout(() => {
      let orderSelected = this.state.orderItem;

      if (orderSelected.moreMinutesAdded < 60) {
        orderSelected.moreMinutesAdded += 5;
        this.setState(
          {
            orderItem: orderSelected,
          },
          () => {
            if (this.state.isIncreaseMinutes) {
              this.callIncreaseMoreTime();
            }
          },
        );
      }
    }, 50);
  };

  callDecreaseMoreTime = () => {
    setTimeout(() => {
      let orderSelected = this.state.orderItem;

      if (parseInt(orderSelected.moreMinutesAdded) > 1) {
        orderSelected.moreMinutesAdded -= 5;

        this.setState(
          {
            orderItem: orderSelected,
          },
          () => {
            if (this.state.isDecreaseMinutes) {
              this.callDecreaseMoreTime();
            }
          },
        );
      } else {
        this.setState({
          isDecreaseMinutes: false,
        });
      }
    }, 50);
  };

  callCloseSelf = data => {
    if (data == '') {
      this.props.closeModal();
    } else {
      this.props.closeDialog(data, 3, false);
    }
  };

  getTimeRemainToReadyTime() {
    return 20;
  }

  callPlaceBid = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let productList = [];
      for (let i = 0; i < this.state.orderItem.products.length; i++) {
        if (this.state.orderItem.products[i].isSelected) {
          let productItem = {
            product_id: this.state.orderItem.products[i]['product_id'],
            amount: this.state.orderItem.products[i]['amount'],
            price: this.state.orderItem.products[i]['price'],
          };
          let product_options_array = getOptionsArray(
            this.state.orderItem.products[i],
          );
          product_options_array.forEach((option, index) => {
            productItem['option' + String(index + 1)] = option.value;
          });
          productList.push(productItem);
        }
      }
      let dataObj = {
        request: rq_place_bid,
        token: token,
        order_version: this.state.orderItem.order_version,

        delivery_type: this.state.orderItem.order_type == 2 ? 1 : 0,
        order_id: this.state.orderItem.order_id,
        products: productList,
      };
      if (
        this.state.orderItem.moreMinutesAdded != '' &&
        parseInt(this.state.orderItem.moreMinutesAdded) > 0
      ) {
        dataObj.extra_time_for_ready = parseInt(
          this.state.orderItem.moreMinutesAdded,
        );
      }
      if (this.state.orderItem.order_type == 3) {
        dataObj.reminder_minutes_before = this.getReadyTime() + 60;
      }

      //console.log(dataObj);
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
            this.props.finishBid(this.state.orderItem.order_id);
          } else {
            if (responseJson.rc == 578) {
              // this.props.closeModal()

              this.props.updateBid(this.state.orderItem.order_id);
            } else {
              this.props.removeFromActive(this.state.orderItem.order_id);
              Alert.alert('', responseJson.message, [
                {text: 'OK', onPress: this.props.closeModal},
              ]);

              //   alert(responseJson);
            }
          }
          this.setState({called_place_bid: false});
        },
      );
    });
  };

  getReadyTime = () => {
    return (
      parseInt(
        this.state.orderItem.ready_time[0] + this.state.orderItem.ready_time[1],
      ) + this.state.orderItem.moreMinutesAdded
    );
  };

  backButtonFunctionality = () => {
    if (this.state.isShowAddMoreTime) {
      this.setState({
        isShowAddMoreTime: false,
      });
      this.setState({
        orderItem: {...this.state.orderItem, moreMinutesAdded: 0},
      });
    } else {
      if (this.state.orderItem.order_type != order_type_pickup) {
        this.props.goToFrame(
          {...this.state.orderItem, cameFromDelivery: true},
          modal_select_product,
        );
      } else {
        this.props.goToFrame(
          {...this.state.orderItem, cameFromDelivery: true},
          modal_select_product,
        );
      }
    }
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

  _showLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = screenWidth;
    allState.indicatorSizeH = screenHeight;
    allState.indicatorDisplay = true;
    this.setState(allState);
  }
  decrease_minutes = () => {
    if (this.state.orderItem.moreMinutesAdded > 1) {
      item = this.state.orderItem;
      item.moreMinutesAdded -= 5;
      this.setState({
        orderItem: item,
      });
    }
  };
  renderProduct = ({item, index}) => (
    <View
      style={{
        paddingTop: perfectSize(20),
        paddingBottom: perfectSize(16),
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
      }}>
      {/*<CheckBox*/}
      {/*    boxType={'square'}*/}
      {/*    tintColor={c_text_grey}*/}
      {/*    onTintColor={c_text_grey}*/}
      {/*    onCheckColor="#ffffff"*/}
      {/*    onFillColor={c_text_grey}*/}
      {/*    animationDuration={0}*/}
      {/*    style={{margin: 5, width:perfectSize(30), height:perfectSize(30)}}*/}
      {/*    value={item.isSelected}*/}
      {/*    onValueChange={() => {*/}
      {/*        this.updateSelectProduct(index);*/}
      {/*    }}*/}
      {/*/>*/}
      <View style={{flexDirection: 'column', flex: 5}}>
        {/* <View style={[mStyle.line]} /> */}
        <View style={[mStyle.itemContainer]}>
          <View>
            <Image
              source={{uri: item.product_image}}
              resizeMode="cover"
              style={{
                width: perfectSize(124),
                height: perfectSize(124),
                marginTop: perfectSize(20),
                marginEnd: perfectSize(14.1),
              }}
            />
          </View>
          <Image
            source={require('../image/quantity_icon.png')}
            resizeMode="cover"
            style={{
              marginTop: perfectSize(62.4),
              marginEnd: perfectSize(50),
              width: perfectSize(24.9),
              height: perfectSize(24.9),
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              marginEnd: perfectSize(48),
              alignItems: 'center',
            }}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_112,
                {
                  color: 'rgb(133,133,134)',
                  paddingTop: perfectSize(9),
                },
              ]}>
              {item.amount}
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
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {fontSize: perfectSize(41)},
              ]}>
              {getProductName(item)}
            </Text>

            <View style={{flexDirection: 'row'}}>
              {getOptionsArray(item).map((option, index) => (
                <Text
                  style={[
                    // globalSass.AlmoniDLAAA_20,
                    // globalSass.animatedBg,
                    {marginStart: index > 0 ? perfectSize(20) : 0},
                  ]}>
                  <Text
                  //  style={globalSass['AlmoniDLAAA-Bold_20']}
                  >
                    {' '}
                    {option.name}
                  </Text>
                  : {option.value}
                </Text>
              ))}
            </View>

            {/* MAKAT VIEW  */}
            {/* <View style={{flex:0.8,flexDirection:"row",  alignContent:"space-between",width:80}}>
            <Text style={[globalStyles.textAlmoniDLAAA_30, {flex:1,fontSize:perfectSize(27),color:"#46474b",paddingTop:1.5,color:c_text_grey}]}>
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
      {/* <View
                        style={{flexDirection:'column', alignItems:'flex-end'}}>
                        <Text style={[globalStyles.textOscarFmRegular_70]}>
                            {item.price}
                        </Text>
                        <Text style={[globalStyles.textOscarFmRegular_30]}>
                            {langObj.nis}
                        </Text>
                    </View> */}
      {/*<View*/}
      {/*    style={{flex: 1, alignSelf: 'flex-end', marginBottom: 10}}>*/}
      {/*    <Text*/}
      {/*        style={*/}
      {/*            ([globalStyles.textAlmoniDLAAA_40],*/}
      {/*                {*/}
      {/*                    color: 'rgb(247,186,72)',*/}
      {/*                    textDecorationLine: 'underline',*/}
      {/*                    letterSpacing: -1.28 / 2,*/}
      {/*                })*/}
      {/*        }>*/}
      {/*        {langObj.productLink}*/}
      {/*    </Text>*/}
      {/*</View>*/}
    </View>
  );
  renderProductCool = ({item, index}) => (
    <TouchableOpacity activeOpacity={1} onPress={() => {}}>
      <View
        style={{
          paddingTop: perfectSize(20),
          paddingBottom: perfectSize(16),
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
                {item.amount}
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
                    style={
                      [
                        // globalSass.AlmoniDLAAA_20
                      ]
                    }>
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
            display: this.state.isShowSummary ? 'flex' : 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}>
          <Text style={[globalStyles.textOscarFmRegular_70]}>{item.price}</Text>
          <Text style={[globalStyles.textOscarFmRegular_30]}>
            {langObj.nis} {item.amount > 1 ? langObj.perUnit : ''}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            marginBottom: 10,
            display: this.state.isShowSummary ? 'none' : 'flex',
          }}>
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
    </TouchableOpacity>
  );
  increase_minutes = () => {
    if (this.state.orderItem.moreMinutesAdded < 60) {
      var item = this.state.orderItem;
      item.moreMinutesAdded += 5;
      this.setState({
        orderItem: item,
      });
    }
  };
  _closeLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = 0;
    allState.indicatorSizeH = 0;
    allState.indicatorDisplay = false;
    this.setState(allState);
  }

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
          <SubmitBidHeader
            show_close={true}
            backButtonFunctionality={this.backButtonFunctionality}
            orderItem={this.state.orderItem}
            callCloseSelf={this.callCloseSelf}
            price={getTotalPrice(this.state.orderItem, true)}
          />

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              display: this.state.isShowAddMoreTime ? 'none' : 'flex',
            }}>
            <FlatList
              data={this.state.orderItem.products.filter(p => p.isSelected)}
              renderItem={this.renderProductCool}
              keyExtractor={(item, index) =>
                item.product_id + String(item.option) + String(index)
              }
            />
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 0.8,
              display: this.state.isShowAddMoreTime ? 'flex' : 'none',
            }}>
            <Text
              style={[
                globalStyles.textOscarFmRegular_70,
                {color: '#000000', margin: 10},
              ]}>
              {langObj.addMinute}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onLongPress={() => {
                  this.setState(
                    {
                      isDecreaseMinutes: true,
                    },
                    () => {
                      this.callDecreaseMoreTime();
                    },
                  );
                }}
                onPressOut={() => {
                  this.setState({
                    isIncreaseMinutes: false,
                    isDecreaseMinutes: false,
                  });
                }}
                onPress={this.decrease_minutes}
                style={{padding: 10}}>
                <Image
                  source={require('../image/icon_quantity_decrease.png')}
                  resizeMode="contain"
                  style={{
                    width: perfectSize(110),
                    height: perfectSize(110),
                  }}
                />
              </TouchableOpacity>
              <TextInput
                editable={false}
                value={this.state.orderItem.moreMinutesAdded + ''}
                keyboardType="decimal-pad"
                onChangeText={value => {
                  let item = this.state.orderItem;
                  item.moreMinutesAdded = value;
                  this.setState({orderItem: item});
                }}
                style={[
                  globalStyles.textOscarFmRegular_70,
                  mStyle.inputMoreMinutesTextInput,
                ]}
              />
              <TouchableOpacity
                onLongPress={() => {
                  this.setState(
                    {
                      isIncreaseMinutes: true,
                    },
                    () => {
                      this.callIncreaseMoreTime();
                    },
                  );
                }}
                onPressOut={() => {
                  this.setState({
                    isIncreaseMinutes: false,
                    isDecreaseMinutes: false,
                  });
                }}
                onPress={this.increase_minutes}
                style={{padding: 10}}>
                <Image
                  source={require('../image/icon_quantity_increase.png')}
                  resizeMode="contain"
                  style={{
                    width: perfectSize(110),
                    height: perfectSize(110),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: 15,
              marginBottom: 5,
              width: perfectSize(1050),
            }}>
            {this.state.orderItem.order_type == 3 ? (
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#000000'},
                ]}>
                {langObj.alertWillShow}
              </Text>
            ) : (
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#000000'},
                ]}>
                {langObj.collectWillBeReadyInMinutes1}
              </Text>
            )}
            <Text
              style={[
                globalStyles.textOscarFmRegular_50,
                {color: c_orange, marginStart: 5, marginEnd: 5},
              ]}>
              {this.getReadyTime()}
            </Text>

            {this.state.orderItem.order_type == 3 ? (
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#000000'},
                ]}>
                {langObj.beforeTheCollect}
              </Text>
            ) : (
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#000000'},
                ]}>
                {langObj.collectWillBeReadyInMinutes2}
              </Text>
            )}
          </View>
          <Text
            style={[
              globalStyles.textOscarFmRegular_40,
              {color: '#000000', alignSelf: 'center', marginBottom: 10},
            ]}>
            {langObj.willYouReady}
          </Text>
          <TouchableOpacity
            disabled={this.state.called_place_bid}
            onPress={() => {
              this.setState({called_place_bid: true});
              this.callPlaceBid();
              if (this.state.orderItem.order_type == order_type_scheduled) {
                this.props.addTimedOrder(this.state.orderItem);
              }
            }}
            style={[mStyle.button]}>
            <Text
              style={[
                globalStyles.textOscarFmRegular_50,
                {color: '#ffffff', textAlign: 'center', alginSelf: 'center'},
              ]}>
              {langObj.yesWewillReady}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.orderItem.moreMinutesAdded == 0) {
                this.setState({
                  orderItem: {...this.state.orderItem, moreMinutesAdded: 5},
                });
              }
              this.setState({
                isShowAddMoreTime: true,
              });
            }}
            style={[
              mStyle.buttonCancel,
              {display: this.state.isShowAddMoreTime ? 'none' : 'flex'},
            ]}>
            <Text style={[globalStyles.textAlmoniDLAAA_60, {color: bg_red}]}>
              {langObj.noNeedMoreTime}
            </Text>
          </TouchableOpacity>
        </View>
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
  line: {
    alignItems: 'stretch',
    height: 1,
    backgroundColor: greyHasOpacity,
    margin: 5,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  button: {
    width: perfectSize(1050),
    height: perfectSize(110),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#000000',
  },
  buttonCancel: {
    width: perfectSize(1050),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputMoreMinutesTextInput: {
    width: perfectSize(350),
    height: perfectSize(196),
    backgroundColor: '#ffffff',
    color: c_text_label,
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 5,
    textAlign: 'center',
  },
});
