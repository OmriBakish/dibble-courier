import React from 'react';
 import {SketchCanvas} from 'react-native-sketch-canvas';
import ProgressImage from 'react-native-image-progress';
import {ProgressBar} from 'react-native-progress/Bar';
 import {getOptionsArray} from '../resource/dibbleCommon';
 import {IncomingBarStyle} from '../components/IncomingOrdersBar/style';

import {getHourFormat, getItemLogoSource,thousandsFilter} from '../resource/SupportFunction';
import {
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacityComponent,
} from 'react-native';
import {globalStyles} from '../resource/style/global';
import {
  greyHasOpacity,
  rq_get_bid_order,
  key_user_info,
  bg_white,
   c_orange,
 
  sub_key_token,
  c_loading_icon,
  c_text_grey,
  rq_set_order_picked_up,
  c_text_label,
  order_type,
} from '../resource/BaseValue';
import getLanguage, {getPerfectSize} from '../resource/LanguageSupport';
import {getTotalItems} from '../resource/SupportFunction';
import {getDataWithSubKey, makeAPostRequest,getProductName} from '../resource/SupportFunction';
import {Repeat} from 'react-feather';
import {useEffect} from 'react';
let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let langObj = getLanguage();
function render_prod({item, index}) {
  let width,
    no_price = null;
  return (
    <View
      style={{
        paddingTop: perfectSize(20),
        paddingBottom: perfectSize(16),
        width: width ? width : perfectSize(1050),
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 10,
        paddingEnd: 10,
        backgroundColor: bg_white,
        margin: 10,
        shadowColor: '#000',
        opacity: item.removed ? 0.5 : 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
      }}>
      <View style={{flexDirection: 'column', flex: 5}}>
        <View style={[mStyle.itemContainer]}>
          <View>
            <ProgressImage
              indicator={ProgressBar}
              indicatorProps={{
                color: c_orange,
              }}
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
              marginEnd: perfectSize(25),
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
              {item.prev_amount ? item.prev_amount : item.amount}
            </Text>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_30,
                {
                  color: 'rgb(133,133,134)',
                   marginBottom: perfectSize(6),
                },
              ]}>
              {langObj.quantity}
            </Text>
          </View>

          {item.prev_amount ? (
            <View
              style={{
                marginStart: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../image/orangeArrow/path.png')}
                style={{
                  width: perfectSize(20.7),
                  height: perfectSize(33.6),
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  marginStart: perfectSize(20.3),
                  marginEnd: perfectSize(39),
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
                       marginBottom: perfectSize(6),
                    },
                  ]}>
                  {langObj.quantity}
                </Text>
              </View>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flexShrink: 1,
            }}>
            <View style={[mStyle.textContainer]}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_40,
                  {fontSize: perfectSize(41), flexShrink: 1},
                ]}>{
                getProductName(item)}
              </Text>
            </View>

            <View style={{flexDirection:'row',marginTop:perfectSize(10)}}>
            {getOptionsArray(item).map((option,index) => (
              <Text style={[globalStyles.textAlmoniDLAAA_40,{marginStart:index>0?perfectSize(20):0}]}>
               <Text style={globalStyles.textAlmoniDLAAA_Bold_40}> {option.name}</Text>: {option.value}
              </Text>
            ))}
            </View>
          </View>
          {no_price ? null : (
            <View
              style={{
                marginStart: 'auto',
                marginEnd: perfectSize(30),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(50),
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  letterSpacing: perfectSize(-1),
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {thousandsFilter(item.price)}
              </Text>
              <Text style={[globalStyles.textOscarFmRegular_30,{marginStart:'auto'}]}>
            {langObj.nis} {item.amount > 1 ? langObj.perUnit : ''}
          </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
export default function ScreenPickup(props) {
  let canvasSignature = React.useRef();
  let [token, setToken] = React.useState('');
  let [order, setOrder] = React.useState('');
  let [frame, setFrame] = React.useState(0);
  let [signatureEmpty, setSignatureEmpty] = React.useState(true);
  let [signature, setSignature] = React.useState('');
  let [requestSent, setRequestSent] = React.useState(false);
  let [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (frame == 1 && !signatureEmpty) {
      perform_pickup_operation();
    }
  }, [signature]);

  let perform_pickup_operation = async () => {
    let dataObj = {
      request: rq_set_order_picked_up,
      token: token,
      order_version: props.order.order_version,

      order_id: parseInt(props.order.order_id),
      receiver_signature: signature,
    };
    //    alert(JSON.stringify(dataObj));
    makeAPostRequest(
      dataObj,
      () => {
        setLoading(true);
      },
      () => {
        setLoading(false);
      },
      (isSuccess, responseJson) => {
        if (isSuccess) {
          //alert(JSON.stringify(responseJson))
          setRequestSent(true);
          setFrame(2);
        } else {
          // alert(responseJson);
        }
      },
    );
  };
  React.useEffect(() => {
    getDataWithSubKey(key_user_info, sub_key_token, (token) => {
      let dataObj = {
        request: rq_get_bid_order,
        token: token,
        bid_id: props.order.bid_id,
      };
      setToken(token);
      //console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          setLoading(true);
        },
        () => {
          setLoading(false);
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            //alert(JSON.stringify(responseJson))
            setOrder(responseJson);
          } else {
            // alert(responseJson);
          }
        },
      );
    });
  }, [props.order.bid_id, props.order.order_id]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
           width: perfectSize(1700),
          height: perfectSize(1500),
 
          backgroundColor: '#fcfcfc',
          borderRadius: 20,
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: perfectSize(20),
          shadowOpacity: 1,
          justifyContent: 'center',
        }}>
        <ImageBackground
          source={require('../image/PickUpBG.png')}
          style={{
            flexDirection: 'row',

            width: '100%',
            height: '100%',
          }}
          imageStyle={frame < 2 && {height: 0}}>
          <View style={{width: perfectSize(336.5), alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                display: frame > 0 && frame < 2 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                height: perfectSize(60),
                marginTop: perfectSize(40.5),
              }}
              onPress={() => {
                setFrame(frame - 1);
              }}>
              <Image
                source={require('../image/rightArrow.png')}
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
              flexDirection: 'column',
              flex: 1,
              marginTop: perfectSize(48.5),
            }}>
            <View
              style={{
                display: frame == 2 ? 'flex' : 'none',
                flex: 1,
                width: perfectSize(1050),
                marginTop: perfectSize(200),
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(130),
                  letterSpacing: perfectSize(-2.6),
                  textAlign: 'left',
                  color: '#000000',
                }}>
                תתחדשו!
              </Text>
 
              <Image
                source={require('../image/login_logo.png')}
                style={{height: perfectSize(400), width: perfectSize(500)}}
                resizeMode="contain"></Image>
            </View>

 
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: perfectSize(300),
              }}>
              <View style={{flexDirection: 'column', alignItems: 'center'}}>
                <Text
                  style={[
                    {
                      display: frame == 1 ? 'flex' : 'none',
                      fontFamily: 'OscarFM-Regular',
                      fontSize: perfectSize(75),
                      letterSpacing: perfectSize(-1.5),
                      color: '#000000',
                    },
                  ]}>
                  {langObj.clientSignature}{' '}
                </Text>
                <View
                  style={{
                    display: frame < 2 ? 'flex' : 'none',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: perfectSize(70),
                  }}>
                  <Text
                    style={[
                      {
                        fontFamily: 'AlmoniDLAAA',
                        fontSize: perfectSize(71),
                        fontWeight: 'normal',
                        letterSpacing: perfectSize(-2.13),
                        textAlign: 'right',
                        color: '#46474b',
                      },
                    ]}>
                    {langObj.orderID}{' '}
                  </Text>

                  <Text
                    style={[
                      {
                        marginStart: perfectSize(8),
                        fontFamily: 'AlmoniDLAAA-Bold',
                        fontSize: perfectSize(71),
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        letterSpacing: perfectSize(-2.13),
                        color: '#46474b',
                      },
                    ]}>
                    {props.order.order_id}{' '}
                  </Text>
                </View>

                <View
                  style={{
                    display: frame < 2 ? 'flex' : 'none',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_40,
                      {
                        fontFamily: 'AlmoniDLAAA',
                        fontSize: perfectSize(42),
                        fontWeight: 'normal',
                        textAlign: 'right',
                        color: frame == 0 ? '#46474b' : '#d1d2d4',
                      },
                    ]}>
                    {langObj.totalItems}:
                  </Text>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_40,
                      {
                        fontFamily: 'AlmoniDLAAA',
                        fontSize: perfectSize(42),
                        fontWeight: 'normal',
                         textAlign: 'right',
                        color: frame == 0 ? '#46474b' : '#d1d2d4',
                      },
                    ]}>
                    {order.products ? getTotalItems(order) : 0}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 'auto',
                  display: frame < 2 ? 'flex' : 'none',
                  marginStart: 'auto',
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
                    source={getItemLogoSource(order)}
                    resizeMode="contain"
                    style={{
                      width: perfectSize(85),
                      height: perfectSize(85),
                    }}
                  />
                </View>
                <Text
                  style={[
                    globalStyles.textAlmoniDLAAA_30,
                   ]}>
                  {order_type[order.order_type]}
                </Text>
                <Text
                  style={[
                    globalStyles.textAlmoniDLAAA_40,
                   ]}>
                  {getHourFormat(order)}
                </Text>
              </View>
            </View>

            <View style={{flex:1,flexDirection:'column',   width: perfectSize(1080), display: frame == 0 ? 'flex' : 'none'}}>
              <FlatList
                style={{
                  marginTop: perfectSize(27),
                  marginBottom: perfectSize(40),
               
                  flex:1
                }}
                data={order.products}
                 renderItem={render_prod}
                keyExtractor={(item) => item.product_id + item.option}
 
              />
              {order.notes ? (
          <View style={IncomingBarStyle.orderNotesContainer }>
            <Text style={IncomingBarStyle.orderNotesTitle}>
              {langObj.orderComment}
            </Text>
             <ScrollView style={IncomingBarStyle.notesContainerFull}>
              <Text style={[IncomingBarStyle.userNotes]}>{order.notes}</Text>
            </ScrollView>
 
          </View>
        ) : null}
            </View>

            <View
              style={{
                display: frame === 0 ? 'flex' : 'none',
                marginBottom: perfectSize(40),
                width: perfectSize(1080),
                height: perfectSize(10),
                backgroundColor: '#ffca1a',
              }}
            />

            <Text
              style={{
                marginTop: perfectSize(23),
                fontFamily: 'OscarFM-Regular',
                display: frame == 1 ? 'flex' : 'none',
                fontSize: perfectSize(50),
                fontWeight: 'normal',
                fontStyle: 'normal',
                 textAlign: 'center',
                color: '#000000',
              }}>
              {langObj.total} {thousandsFilter(order.total_order_price)} {langObj.priceUnit}
            </Text>
            <Text
              style={{
                fontFamily: 'AlmoniDLAAA',
                fontSize: perfectSize(40),
                letterSpacing: perfectSize(-1.2),
                textAlign: 'center',
                marginTop: perfectSize(46),
                display: frame == 1 ? 'flex' : 'none',
                color: '#46474b',
              }}>
              {langObj.approveRevieved}
            </Text>

            <View
              style={{
                flex: 1,
                display: frame == 1 ? 'flex' : 'none',
                marginTop: perfectSize(31),
                width: perfectSize(1040),
                height: perfectSize(427),
                padding: 3,
                borderRadius: perfectSize(21),
                backgroundColor: '#ffffff',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: '#707070',
 
              }}>
              <SketchCanvas
                ref={(ref) => (canvasSignature = ref)}
                style={{flex: 1}}
                strokeColor={'black'}
                strokeWidth={5}
                onStrokeStart={() => setSignatureEmpty(false)}
              />
              <TouchableOpacity
                style={{
                  width: perfectSize(80),
                  height: perfectSize(80),
                  position: 'absolute',
                }}
                onPress={() => {
                  canvasSignature.clear();
                  setSignatureEmpty(true);
                }}>
                <Image
                  source={require('../image/clear_btn.png')}
                  resizeMode="contain"
                  style={{
                    width: perfectSize(80),
                    height: perfectSize(80),
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                display: frame == 0 ? 'flex' : 'none',
                marginBottom: order.order_type != 2 ? perfectSize(76) : 0,
              }}>
              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(50),
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  letterSpacing: -1,
                  textAlign: 'right',
                  color: '#000000',
                }}>
                {langObj.total}
              </Text>

 

              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(75),
                  fontWeight: 'normal',
                  fontStyle: 'normal',
    
    
                  textAlign: 'right',
                  color: '#000000',
                  marginStart: 'auto',
                }}>
 
                {langObj.priceUnit} {thousandsFilter(order.total_order_price)}
              </Text>
            </View>
            <TouchableOpacity
              style={{display: order.order_type == 2 ? 'flex' : 'none'}}
              onPress={() => {
                if (frame == 2) {
                  if (requestSent) {
                    props.closeDialog();
                  }
                } else if (frame == 1) {
                  canvasSignature.getBase64(
                    'jpg',
                    false,
                    true,
                    true,
                    true,
                    (err, result) => {
                      setSignature(result);
                      console.log(result);
                    },
                  );
                } else {
                  setFrame(frame + 1);
                }
              }}>
              <View
                style={{
                  marginTop: perfectSize(76),
                  width: perfectSize(1050),
                  height: perfectSize(110),
                  borderRadius: perfectSize(14),
                  backgroundColor: '#000000',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: perfectSize(97.3),
                }}>
                <Text
                  style={{
                    fontFamily: 'OscarFM-Regular',
                    fontSize: perfectSize(63),
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    letterSpacing: perfectSize(-1.26),
                    color: '#ffffff',
                  }}>
                  {frame > 1 ? langObj.close : langObj.continue}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{width: perfectSize(336.5), alignItems: 'flex-end'}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                marginEnd: perfectSize(40),
                 padding: perfectSize(50),

 
                justifyContent: 'center',
                height: perfectSize(60),
                marginTop: perfectSize(40.5),
              }}
              onPress={() => {
                props.closeDialog();
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
        </ImageBackground>
      </View>
      <View
        style={{
          display: loading ? 'flex' : 'none',
          borderRadius: 20,
          backgroundColor: greyHasOpacity,
           width: perfectSize(1700),
          height: perfectSize(1500),
          alignItems: 'center',
          justifyContent: 'center',
 
          position: 'absolute',
        }}>
        <ActivityIndicator
          animating={loading}
          size="large"
          color={c_loading_icon}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
const mStyle = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
  },
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
 
export function renderProduct(width, no_price) {
  return ({item, index}) => (
    <View
      style={{
        paddingTop: perfectSize(20),
        paddingBottom: perfectSize(16),
        width: width ? width : perfectSize(1050),
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 10,
        paddingEnd: 10,
        backgroundColor: bg_white,
        margin: 10,
        shadowColor: '#000',
        opacity: item.removed ? 0.5 : 1,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
      }}>
      <View style={{flexDirection: 'column', flex: 5}}>
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
              marginEnd: perfectSize(25),
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
              {item.prev_amount ? item.prev_amount : item.amount}
            </Text>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_30,
                {
                  color: 'rgb(133,133,134)',
                   marginBottom: perfectSize(6),
                },
              ]}>
              {langObj.quantity}
            </Text>
          </View>

          {item.prev_amount ? (
            <View
              style={{
                marginStart: 0,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../image/orangeArrow/path.png')}
                style={{
                  width: perfectSize(20.7),
                  height: perfectSize(33.6),
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  marginStart: perfectSize(20.3),
                  marginEnd: perfectSize(39),
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
                       marginBottom: perfectSize(6),
                    },
                  ]}>
                  {langObj.quantity}
                </Text>
              </View>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              flexShrink: 1,
            }}>
            <View style={[mStyle.textContainer]}>
 
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_40,
                  {fontSize: perfectSize(41), flexShrink: 1},
                ]}>
                {getProductName(item)}
              </Text>
            </View>
            {getOptionsArray(item).map((option) => (
              <Text style={[globalStyles.textAlmoniDLAAA_30]}>
                {option.name}: {option.value}
              </Text>
            ))}
          </View>
          {no_price ? null : (
            <View
              style={{
                marginStart: 'auto',
                marginEnd: perfectSize(30),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(50),
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                   textAlign: 'right',
                  color: '#000000',
                }}>
                {item.price}
              </Text>
                       <Text style={[globalStyles.textOscarFmRegular_30 ,{marginStart:'auto'}]}>
            {langObj.nis} {item.amount > 1 ? langObj.perUnit : ''}
          </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
let styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
});
