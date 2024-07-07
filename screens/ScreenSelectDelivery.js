/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */

import * as React from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import {
  bg_button_grey,
  c_loading_icon,
  c_text_grey,
  delivery_type_internal,
  delivery_scooter,
  greyHasOpacity,
  delivery_type_external,
  delivery_bicycle,
  delivery_scooter_eletric,
  delivery_car,
  order_type,
  delivery_truck,
  delivery_huge_truck,
  modal_select_product,
  modal_submit_bid,
} from '../resource/BaseValue';
import getLanguage, {getPerfectSize} from '../resource/LanguageSupport';
import {globalStyles} from '../resource/style/global';
import {SubmitBidHeader} from './submitBidHeader';
import {
  getHourFormat,
  getItemLogoSource,
  getTotalPrice,
} from '../resource/SupportFunction';
export default class SelectDeliveryScreen extends React.Component {
  constructor(props) {
    super(props);
    let orderSelected = this.props.orderSelected;
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      indicatorDisplay: false,
      orderItem: orderSelected,
      isShowVehicleSelect: false,
    };
  }
  componentDidMount() {}
  callCloseSelf = (data) => {
    if (data == '') {
      this.props.closeModal();
    } else {
      this.props.goToFrame(this.state.orderItem, modal_submit_bid);
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

  saveVehicleType = (type) => {
    let allState = this.state;
    allState.orderItem.delivery_type = type;
    this.setState(allState);
  };

  backButtonFunctionality = () => {
    this.props.goToFrame(
      {...this.state.orderItem, cameFromDelivery: true},
      modal_select_product,
    );
  };
  getTotalItems(order) {
    let total = 0;
    order.products.forEach((prod) => {
      total += parseInt(prod.amount);
    });
    return total;
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
          />

          <View
            style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
            <Text
              style={[
                globalStyles.textOscarFmRegular_70,
                {alignSelf: 'center', marginTop: 10},
              ]}>
              {this.state.isShowVehicleSelect
                ? langObj.selectDeliveryType
                : langObj.chooseShippingMethod}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                width: perfectSize(700),
                display: this.state.isShowVehicleSelect ? 'none' : 'flex',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_type_internal);
                  }}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type ==
                      delivery_type_internal
                        ? require('../image/carrier_type_internal_slt.png')
                        : require('../image/carrier_type_internal_normal.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(182),
                      height: perfectSize(182),
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    globalStyles.textAlmoniDLAAA_40,
                    {color: c_text_grey},
                  ]}>
                  {langObj.internalCarrier}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_type_external);
                  }}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type ==
                      delivery_type_external
                        ? require('../image/carrier_type_external_slt.png')
                        : require('../image/carrier_type_external_normal.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(182),
                      height: perfectSize(182),
                    }}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    globalStyles.textAlmoniDLAAA_40,
                    {color: c_text_grey},
                  ]}>
                  {langObj.externalCarrier}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
                width: perfectSize(1100),
                display: this.state.isShowVehicleSelect ? 'flex' : 'none',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_scooter);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type == delivery_scooter
                        ? require('../image/st_scooter_sl.png')
                        : require('../image/st_scooter.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.scooter}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_bicycle);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type == delivery_bicycle
                        ? require('../image/st_bicycle_sl.png')
                        : require('../image/st_bicycle.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.bicycle}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_scooter_eletric);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type ==
                      delivery_scooter_eletric
                        ? require('../image/st_electric_scooter_sl.png')
                        : require('../image/st_electric_scooter.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.scooterElectric}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_car);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type == delivery_car
                        ? require('../image/st_car_sl.png')
                        : require('../image/st_car.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.car}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_truck);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type == delivery_truck
                        ? require('../image/st_truck_sl.png')
                        : require('../image/st_truck.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.truck}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.saveVehicleType(delivery_huge_truck);
                  }}
                  style={[mStyle.vehicleTypeButton]}>
                  <Image
                    source={
                      this.state.orderItem.delivery_type == delivery_huge_truck
                        ? require('../image/st_huge_truck_sl.png')
                        : require('../image/st_huge_truck.png')
                    }
                    resizeMode="contain"
                    style={{
                      width: perfectSize(120),
                      height: perfectSize(120),
                    }}
                  />
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_30,
                      mStyle.textSelectVehicle,
                    ]}>
                    {langObj.hugeTruck}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
           <View
            style={{
              marginTop: 'auto',
              marginBottom: perfectSize(70),
              flexDirection: 'column',
            }}>
 
            <TouchableOpacity
              onPress={() => {
                if (
                  this.state.orderItem.delivery_type == delivery_type_internal
                ) {
                  this.callCloseSelf(this.state.orderItem);
                } else if (
                  this.state.orderItem.delivery_type == delivery_type_external
                ) {
                  //new_flow change
                  if (this.props.new_flow) {
                    //this.setState({isShowVehicleSelect: true});
                    this.callCloseSelf(this.state.orderItem);
                  } else {
                    this.setState({isShowVehicleSelect: true});
                  }
                } else if (this.state.orderItem.delivery_type > 1) {
                  this.callCloseSelf(this.state.orderItem);
                }
              }}
              style={[
                mStyle.button,
                {width: perfectSize(1050), height: perfectSize(110)},
              ]}>
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {color: '#ffffff'},
                ]}>
                {langObj.continue}
              </Text>
            </TouchableOpacity>
          </View>
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
  textGeneral: {
    fontFamily: 'HelveticaNeue',
    fontSize: 17,
  },
  textGeneralBold: {
    fontFamily: 'HelveticaNeue',
    fontSize: 17,
    fontWeight: 'bold',
  },
  vehicleTypeButton: {
    flexDirection: 'column',
    alignItems: 'center',
    width: perfectSize(120),
  },
  button: {
    width: perfectSize(1050),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  buttonGrey: {
    width: perfectSize(1050),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: bg_button_grey,
  },
  textNoticeLarge: {
    fontFamily: 'HelveticaNeue',
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  textSelectVehicle: {
    color: c_text_grey,
    textAlign: 'center',
    width: perfectSize(120),
  },
});
