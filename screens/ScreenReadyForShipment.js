/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */

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
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  NativeModules,
} from 'react-native';

import {
  bg_button_grey,
  bg_button_light_blue,
  bg_dark_line,
  bg_grey,
  bg_yellow_bubble,
  c_loading_icon,
  c_text_blue,
  c_text_grey,
  greyHasOpacity,
  isForceRTL,
  key_user_info,
  rq_get_active_order_requests,
  rq_get_bid_order,
  rq_get_ready_order_requests,
  rq_place_bid,
  sub_key_token,
} from '../resource/BaseValue';
import getLanguage from '../resource/LanguageSupport';
import {
  getDataWithSubKey,
  makeAPostRequest,
  getTotalPrice,getProductName
} from '../resource/SupportFunction';
import moment from 'moment';
import {globalStyles} from '../resource/style/global';

export default class ReadyForShipmentScreen extends React.Component {
  constructor(props) {
    super(props);
    let orderSelected = this.props.orderSelected;
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      indicatorDisplay: false,
      isShowEnterPrice: false,
      orderItem: orderSelected,
    };
  }

  componentDidMount() {
    this.getBidOrder();
  }

  getBidOrder = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, (token) => {
      let dataObj = {
        request: rq_get_bid_order,
        token: token,
        bid_id: this.state.orderItem.bid_id,
      };
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
            let allState = this.state;
            allState.orderItem = responseJson;
            let timeStr = allState.orderItem['ready_time'];
            timeStr = moment(timeStr).local().format('HH:mm');
            //allState.orderItem['ready_time'] = timeStr;

            let timeStrPlaceOn = allState.orderItem['placed_on'];
            timeStrPlaceOn = moment(timeStrPlaceOn).local().format('HH:mm');
            // allState.orderItem['placed_on'] = timeStrPlaceOn;

            this.setState(allState);
          } else {
            alert(responseJson);
          }
        },
      );
    });
  };

  callCloseSelf = (data) => {
    if (data == '') {
      this.props.closeDialog(data, 2, false);
    } else {
      this.props.closeDialog(data, 3, false);
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

  render() {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return (
      <View
        activeOpacity={1}
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
            width: screenWidth * 0.45,
            padding: 5,
            height: screenHeight * 0.8,
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderRadius: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    globalStyles.textGeneralBold,
                    {
                      color: '#000000',
                      backgroundColor: bg_grey,
                      borderRadius: 5,
                      paddingTop: 5,
                      paddingBottom: 5,
                      paddingStart: 10,
                      paddingEnd: 10,
                    },
                  ]}>
                  #{this.state.orderItem.order_id}
                </Text>
                <Text style={[globalStyles.textGeneralBold, {marginStart: 10}]}>
                  {this.state.orderItem.client_name}
                </Text>
              </View>
              <Text
                style={[
                  globalStyles.textSmall,
                  {marginTop: 5, color: c_text_grey},
                ]}>
                {this.state.orderItem.client_phone}
              </Text>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 20,
                  alignSelf: 'stretch',
                  marginEnd: 20,
                }}>
                <Image
                  source={require('../image/bubble_top.png')}
                  resizeMode="contain"
                  style={{
                    width: screenWidth * 0.04,
                    height: screenWidth * 0.04 * (27 / 66),
                    marginStart: 10,
                  }}
                />
                <Text style={[mStyle.textBubble, {alignSelf: 'stretch'}]}>
                  {this.state.orderItem.notes}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                marginEnd: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.callCloseSelf('');
                }}>
                <Image
                  source={require('../image/icon_ok_green.png')}
                  resizeMode="contain"
                  style={{
                    width: screenWidth * 0.05,
                    height: screenWidth * 0.05,
                  }}
                />
              </TouchableOpacity>
              <Text
                style={[
                  globalStyles.textSmall,
                  {fontWeight: 'bold', fontSize: 10},
                ]}>
                2 {langObj.minutesAgo}
              </Text>
              <Text
                style={[
                  globalStyles.textSmall,
                  {color: c_text_grey, fontSize: 10},
                ]}>
                {this.state.orderItem.ready_time}
              </Text>
              <View
                style={{
                  width: screenWidth * 0.04,
                  height: screenWidth * 0.04,
                  marginTop: 10,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: c_text_grey,
                  borderWidth: 1,
                  borderRadius: screenWidth * 0.02,
                }}>
                <Image
                  source={require('../image/icon_car.png')}
                  resizeMode="contain"
                  style={{
                    width: screenWidth * 0.025,
                    height: screenWidth * 0.025 * (202 / 236),
                  }}
                />
              </View>
              <Text style={[globalStyles.textSmall]}>
                {this.state.orderItem.order_type == 1
                  ? langObj.delivery
                  : langObj.pickup}
              </Text>
            </View>
          </View>
          <FlatList
            style={{marginTop: 10}}
            data={this.state.orderItem.products}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <View style={[mStyle.line]} />
                  <View style={[mStyle.itemContainer]}>
                    <View
                      style={{
                        borderRadius: 10,
                        borderColor: greyHasOpacity,
                        borderWidth: 1,
                      }}>
                      <Image
                        source={{uri: item.product_image}}
                        resizeMode="cover"
                        style={{
                          width: screenWidth * 0.05,
                          height: screenWidth * 0.05,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                    <Text style={[globalStyles.textSmall, {margin: 5}]}>
                      x {item.amount}
                    </Text>
                    <Text
                      style={[globalStyles.textSmall, {padding: 5, flex: 1}]}>
                      {getProductName(item)}
                    </Text>
                    <Text style={[globalStyles.textSmall]}>{item.price}</Text>
                    <Text style={[globalStyles.textSmall, {padding: 5}]}>
                      {langObj.priceUnit}
                    </Text>
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
              </View>
            )}
             keyExtractor={(item) => item.product_id + item.option}
 
          />
          <Text
            style={[
              mStyle.globalStyles,
              {
                alignSelf: 'flex-end',
                marginEnd: 5,
                marginBottom: 10,
                marginTop: 10,
              },
            ]}>
            {langObj.total +
              ' ' +
              getTotalPrice(this.state.orderItem, true) +
              ' ' +
              langObj.priceUnit}
          </Text>
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
      </View>
    );
  }
}

let langObj = getLanguage();
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
    alignItems: 'center',
    padding: 5,
  },
  button: {
    width: screenWidth * 0.3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: c_text_blue,
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
  textNoticeLarge: {
    fontFamily: 'HelveticaNeue',
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
});
