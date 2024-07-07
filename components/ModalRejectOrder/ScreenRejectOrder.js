import React, {useRef} from 'react';
import {Columns} from 'react-feather';
import {
  View,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import {perfectSize} from '../DibbleHeader/style';
import {screenRejectOrderStyle} from './style';
import {Keyboard} from 'react-native';
import {
  getDataWithSubKey,
  openIntercomChat,
  makeAPostRequest,
} from '../../resource/SupportFunction';
import {
  sub_key_token,
  key_user_info,
  rq_reject_order,
  greyHasOpacity,
} from '../../resource/BaseValue';

function renderOptionCard(option, index, setChosenOption) {
  return (
    <TouchableOpacity
      onPress={() => {
        setChosenOption(index);
        console.log(index);
      }}
      style={{
        height: perfectSize(450),
        borderRadius: perfectSize(20),

        width: perfectSize(380),
        marginRight: perfectSize(20),
        height: perfectSize(450),
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
          width: perfectSize(3),
          height: perfectSize(3),
        },
        shadowRadius: perfectSize(5),
        shadowOpacity: 0.3,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#f1f1f3',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: perfectSize(85),
          paddingTop: perfectSize(78),
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <Image
          source={option.img}
          style={{
            height: perfectSize(105.2),
            alignSelf: 'center',
            width: perfectSize(96.3),
          }}></Image>
        <Text
          style={{
            fontFamily: 'OscarFM-Regular',
            fontSize: perfectSize(45),
            fontWeight: 'normal',
            fontStyle: 'normal',
            letterSpacing: perfectSize(-0.9),
            textAlign: 'center',
            color: '#000000',
          }}>
          {option.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ScreenRejectOrder(props) {
  let [keyboardUp, setKeyboardUp] = React.useState(false);
  let [rejectionReason, onChangeText] = React.useState('');

  let [textFocused, setTextFocused] = React.useState(false);
  let [chosenOption, setChosenOption] = React.useState('');
  let [frame, setFrame] = React.useState(0);
  // alert(props.order_id)

  let submitRejection = () => {
    let orderId = props.order_id;
    getDataWithSubKey(key_user_info, sub_key_token, (token) => {
      let dataObj = {
        request: rq_reject_order,
        token: token,
        order_id: orderId,
        reason_type: chosenOption,
        reason_text: rejectionReason,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          // this._showLoadingBox();
        },
        () => {
          // this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess == true) {
            props.remove_order_from_active();
            props.play_success_animation();
            props.closeModal();

            // let allState = this.state;
            // let pos = -1;
            // for (let i = 0; i < allState.orders.length && pos == -1; i++) {
            //     if (allState.orders[i]['order_id'] == orderId) {
            //         pos = i;
            //     }
            // }
            // if (pos > -1) {
            //     allState.orders.splice(pos,1);
            //     allState.refreshList = !allState.refreshList;
            //     this.setState (allState);
            // }
          } else {
            // props.remove_order_from_active();
            props.closeModal();
            props.play_failed_animation();
          }
        },
      );
    });
  };

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      setTextFocused(false);
    });
  }, []);

  const textInput = useRef(null);
  React.useEffect(() => {
    if (textInput.current && frame == 1) {
      textInput.current.focus();
      setTextFocused(true);
    }
  }, [textInput, frame]);

  React.useEffect(() => {
    if (chosenOption === '') {
      return;
    }

    if (chosenOption === 2) {
      setFrame(1);
    } else {
      submitRejection();
    }
  }, [chosenOption]);
  const screenWidth = Math.round(Dimensions.get('window').width);
  let Reasons = [
    {text: 'אחר', img: require('../../image/star.png')},
    {text: 'אין באפשרותי לספק בזמן', img: require('../../image/clock.png')},
    {text: 'אין את המוצרים במלאי', img: require('../../image/search.png')},
  ].reverse();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        width: screenWidth,

        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: greyHasOpacity,
        justifyContent: 'center',
      }}>
      <View
        style={{
          paddingTop: textFocused ? perfectSize(200) : 0,
          width: perfectSize(1489),
          height: perfectSize(1126),
          flexDirection: 'column',
          backgroundColor: 'rgb(252,252,252)',
          borderRadius: perfectSize(20),
          backgroundColor: '#ffffff',
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffset: {
            width: perfectSize(3),
            height: perfectSize(3),
          },
          shadowRadius: perfectSize(30),
          shadowOpacity: 1,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#f1f1f3',
        }}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View
            style={{
              marginStart: 'auto',
              marginTop: perfectSize(35),
              marginEnd: perfectSize(40),
              height: perfectSize(30),
              width: perfectSize(30),
            }}>
            <TouchableOpacity
              onPress={() => {
                props.closeModal();
              }}>
              <Image
                source={require('../../image/quantity_icon.png')}
                style={{
                  marginStart: 'auto',
                  height: perfectSize(40),
                  width: perfectSize(40),
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: frame == 1 ? 'flex' : 'none',
              position: 'absolute',
              marginEnd: 'auto',
              marginTop: perfectSize(35),
              paddingLeft: perfectSize(30),
              height: perfectSize(30),
              width: perfectSize(30),
            }}>
            <TouchableOpacity
              onPress={() => {
                setChosenOption('');
                Keyboard.dismiss();
                setFrame(0);
              }}>
              <Image
                source={require('../../image/icon_arrow_grey_right.png')}
                style={{
                  marginStart: 'auto',
                  height: perfectSize(55),
                  width: perfectSize(55),
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: frame == 0 ? 'flex' : 'none',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../image/heart.png')}
              style={{
                width: perfectSize(111.5),
                height: perfectSize(100.7),
              }}></Image>

            <Text style={screenRejectOrderStyle.titleTextStyle}>
              דחיית הזמנה
            </Text>
            <Text style={screenRejectOrderStyle.contentTextStyle}>
              {' '}
              חשוב לזכור דחיית הזמנה היא פעולה בלתי הפיכה שתוריד מניקוד הספק
              במערכת
            </Text>

            <View style={{marginTop: perfectSize(50), alignItems: 'center'}}>
              <Text style={screenRejectOrderStyle.contentTextStyleBold}>
                רוצים לדבר איתנו לפני דחיית ההזמנה?{' '}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: perfectSize(350),
                }}>
                <Text style={screenRejectOrderStyle.contentTextStyleThick}>
                  לחצו
                </Text>

                <TouchableOpacity
                  onPress={openIntercomChat}
                  style={screenRejectOrderStyle.contentTextStyleThick}>
                  <Text
                    style={[
                      screenRejectOrderStyle.contentTextStyleThick,
                      {color: 'red'},
                    ]}>
                    כאן
                  </Text>
                </TouchableOpacity>

                <Text style={screenRejectOrderStyle.contentTextStyleThick}>
                  כדי לעבור לצ׳אט
                </Text>
              </View>
              <Text style={screenRejectOrderStyle.contentTextStyleThick}>
                או לשיחה עם המוקד הטלפוני
              </Text>
            </View>
            <Text style={screenRejectOrderStyle.pickReasonTitle}>
              סמן את סיבת הדחייה
            </Text>

            <View
              style={{
                height: perfectSize(500),
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FlatList
                horizontal
                contentContainerStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                style={{}}
                data={Reasons}
                renderItem={({item, index}) =>
                  renderOptionCard(item, index, setChosenOption)
                }
                keyExtractor={(item) => item.text}
              />
            </View>
          </View>

          <View
            style={{
              display: frame == 1 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../image/search.png')}
              style={{
                width: perfectSize(110),
                height: perfectSize(110),
              }}></Image>
            <Text
              style={{
                fontFamily: 'OscarFM-Regular',
                marginTop: perfectSize(15),
                fontSize: perfectSize(45),
                fontWeight: 'normal',
                fontStyle: 'normal',
                textAlign: 'center',
                color: '#000000',
              }}>
              אין את המוצרים במלאי
            </Text>

            <Text
              style={{
                marginTop: perfectSize(47),
                fontFamily: 'AlmoniDLAAA',
                fontSize: perfectSize(40),
                fontWeight: 'normal',
                fontStyle: 'normal',
                letterSpacing: perfectSize(-1.2),
                textAlign: 'center',
                color: '#46474b',
              }}>
              {' '}
              לצערנו, לא נוכל להציע לך את המוצרים האלו.
            </Text>

            <TextInput
              onFocus={() => setTextFocused(true)}
              onEndEditing={() => setTextFocused(false)}
              ref={textInput}
              multiline={true}
              style={{
                width: perfectSize(1034),
                textAlign: 'right',
                paddingTop: perfectSize(20),
                height: perfectSize(144),
                textAlignVertical: 'top',
                marginTop: perfectSize(20),
                backgroundColor: '#fdfdfd',
                borderStyle: 'solid',
                borderWidth: 1,
                fontSize: perfectSize(40),
                borderColor: '#707070',
              }}
              onChangeText={(text) => onChangeText(text)}>
              {' '}
            </TextInput>

            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                submitRejection();
              }}
              style={{
                width: perfectSize(1050),
                height: perfectSize(110),
                marginTop: perfectSize(20),
                borderRadius: perfectSize(14),
                backgroundColor: '#000000',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'OscarFM-Regular',
                  fontSize: perfectSize(63),

                  lineHeight: perfectSize(65),
                  letterSpacing: perfectSize(-1.26),
                  textAlign: 'center',
                  color: '#ffffff',
                }}>
                שליחה ללקוח
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
