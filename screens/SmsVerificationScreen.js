import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import Intercom from 'react-native-intercom';
import {
  rq_verify_sms_code,
  rq_login_with_phone,
  rq_send_sms_code,
  rq_get_app_version,
} from '../resource/BaseValue';
import {SmsVerificationScreenName} from '../src/constants/Routes';
import {makeAPostRequest, openIntercomChat} from '../resource/SupportFunction';
import getLanguage from '../resource/LanguageSupport';
import {COLORS, FONTS, SHADOWS, SIZES} from '../src/constants/theme';
import {useNavigation} from '@react-navigation/native';
import SectionTitle from '../components/SectionTitle/SectionTitle';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import {save} from '../src/services/utils/storage';
import {AuthenticateStore} from '../src/services/store/store/authenticate.store';
import moment from 'moment';

const screenWidth = Math.round(Dimensions.get('window').width);

const SmsVerificationScreen = props => {
  const navigation = useNavigation();
  const [indicatorDisplay, setIndicatorDisplay] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showInputError, setShowInputError] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
  const [appVersion, setAppVersion] = useState({});
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [code5, setCode5] = useState('');
  const [countDownTime, setCountDownTime] = useState(0);
  const [isMaxSmsSent, setIsMaxSmsSent] = useState(false);

  const code1Ref = useRef(null);
  const code2Ref = useRef(null);
  const code3Ref = useRef(null);
  const code4Ref = useRef(null);
  const code5Ref = useRef(null);
  const langObj = getLanguage();

  useEffect(() => {
    if (props.route != null && props.route.params != null) {
      setPhoneNumber(props.route.params.userPhone);
    }
    code1Ref.current.focus();
  }, [props]);

  useEffect(() => {
    getAppVersion();
  }, []);

  useEffect(() => {
    if (code1 && code2 && code3 && code4 && code5) {
      verifyCode();
    }
  }, [code1, code2, code3, code4, code5]);

  const verifyCode = async () => {
    if (code1 && code2 && code3 && code4 && code5) {
      const verificationCode = code1 + code2 + code3 + code4 + code5;
      let dataObj = {
        phone_num: phoneNumber,
        verification_code: verificationCode,
      };
      makeAPostRequest(
        rq_verify_sms_code,
        dataObj,
        () => setIndicatorDisplay(true),
        () => setIndicatorDisplay(false),
        (isSuccess, responseJson) => {
          if (isSuccess) {
            _onVerifyOtpSuccess(responseJson);
          } else {
            setIsShowErrorMessage(true);
          }
        },
      );
    }
  };
  const getAppVersion = () => {
    makeAPostRequest(
      rq_get_app_version,
      null,
      () => setIndicatorDisplay(true),
      () => setIndicatorDisplay(false),
      (success, responseJson) => {
        if (success) {
          _onGetAppVersionSuccess(responseJson);
        }
      },
    );
  };
  const _onGetAppVersionSuccess = responseJson => {
    setAppVersion(responseJson.apps[5]);
  };
  const _onVerifyOtpSuccess = responseJson => {
    if (responseJson.is_registered) {
      loginWithPhone(responseJson.auth_key);
    }
  };

  const loginWithPhone = async authKey => {
    // console.log(DeviceInfo.getVersion());
    const dataObj = {
      auth_key: authKey,
      app_version: appVersion.last_version,
      os_type: Platform.OS === 'ios' ? 6 : Platform.OS === 'android' ? 5 : 0,
    };

    makeAPostRequest(
      rq_login_with_phone,
      dataObj,
      () => setIndicatorDisplay(true),
      () => setIndicatorDisplay(false),
      (isSuccess, responseJson) => {
        if (isSuccess) {
          _onLoginWithPhoneSuccess(responseJson);
        } else {
          // _onRequestFailure(true);
        }
      },
    );
  };

  const _onLoginWithPhoneSuccess = responseData => {
    if (responseData.type == 4) {
      setPhoneNumber(responseData.phone_number);
      saveUserInfo(responseData);
      AuthenticateStore.createAuth(responseData);
      save('token', {
        token: responseData.token,
        first_name: responseData.first_name,
        last_name: responseData.last_name,
        email: responseData.email,
        phone_number: phoneNumber,
        expired: moment().unix(),
      });
      registerIntercom();
      navigation.reset({
        index: 0,
        routes: [{name: SmsVerificationScreenName}],
      });
    }
  };

  const registerIntercom = () => {
    Intercom.loginUserWithUserAttributes({
      userId: phoneNumber,
      email: '',
    }).then(() => {
      let phone = '';
      if (phoneNumber != null) {
        phone = phoneNumber;
      }
      Intercom.updateUser({
        name:
          AuthenticateStore.authentication.first_name +
          ' ' +
          AuthenticateStore.authentication.last_name,
        phone: phone,
        custom_attributes: {
          user_type: 'courier',
        },
      });
    });
  };

  const saveUserInfo = async dataJson => {
    Keyboard.dismiss();
    try {
      let userInfo = {
        type: dataJson.type,
        firstName: dataJson.first_name,
        lastName: dataJson.last_name,
        phoneNumber: phoneNumber,
      };
      AsyncStorage.setItem('key_user_info', JSON.stringify(userInfo));
    } catch (e) {
      alert(e);
    }
  };

  const handleInputChange = (text, setCode, nextRef, prevRef) => {
    setCode(text);
    if (text) {
      if (nextRef.current) {
        nextRef.current.focus();
      }
    } else {
      if (prevRef.current) {
        prevRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e, prevRef) => {
    if (e.nativeEvent.key === 'Backspace' && prevRef.current) {
      prevRef.current.focus();
    }
  };
  const sendSmsCodeAgain = async () => {
    let sendTime = await AsyncStorage.getItem('key_resend_password_time');
    if (sendTime != null && sendTime != '' && parseInt(sendTime) > 4) {
      setIsMaxSmsSent(true);
    } else {
      if (countDownTime <= 0) {
        let dataObj = {
          phone_num: phoneNumber,
        };
        console.log(dataObj);

        makeAPostRequest(
          rq_send_sms_code,
          dataObj,
          () => setIndicatorDisplay(true),
          () => setIndicatorDisplay(false),
          (isSuccess, responseJson) => {
            if (isSuccess) {
              _onSendOtpSuccess(responseJson);
            } else {
              setIsShowErrorMessage(true);
            }
          },
        );
      }
    }
  };
  const _onSendOtpSuccess = responseData => {
    setIndicatorDisplay(false);
    setCode1('');
    setCode2('');
    setCode3('');
    setCode4('');
    setCode5('');
    saveResendCodeCount();
    code1Ref.current.focus();
    countDown();
  };
  const saveResendCodeCount = async () => {
    let sendTime = await AsyncStorage.getItem('key_resend_password_time');
    if (sendTime != null && sendTime != '') {
      AsyncStorage.setItem(
        'key_resend_password_time',
        parseInt(sendTime) + 1 + '',
      );
    } else {
      AsyncStorage.setItem('key_resend_password_time', '1');
    }
  };
  const countDown = () => {
    if (countDownTime > 0) {
      setTimeout(() => {
        setCountDownTime(countDownTime - 1);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.innerContainer}>
              <View style={styles.inputContainer}>
                <SectionTitle title={langObj.verificationCode} center={true} />
                <Text style={[styles.textDescription, {alignSelf: 'center'}]}>
                  {langObj.codeHaveBeenSentTo + ' ' + phoneNumber}
                </Text>
                <View style={styles.codeInputContainer}>
                  <TextInput
                    ref={code1Ref}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text =>
                      handleInputChange(text, setCode1, code2Ref, code1Ref)
                    }
                    onKeyPress={e => handleKeyPress(e, code1Ref)}
                    value={code1}
                  />
                  <TextInput
                    ref={code2Ref}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text =>
                      handleInputChange(text, setCode2, code3Ref, code1Ref)
                    }
                    onKeyPress={e => handleKeyPress(e, code1Ref)}
                    value={code2}
                  />
                  <TextInput
                    ref={code3Ref}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text =>
                      handleInputChange(text, setCode3, code4Ref, code2Ref)
                    }
                    onKeyPress={e => handleKeyPress(e, code2Ref)}
                    value={code3}
                  />
                  <TextInput
                    ref={code4Ref}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text =>
                      handleInputChange(text, setCode4, code5Ref, code3Ref)
                    }
                    onKeyPress={e => handleKeyPress(e, code3Ref)}
                    value={code4}
                  />
                  <TextInput
                    ref={code5Ref}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text => {
                      handleInputChange(text, setCode5, code5Ref, code4Ref);
                    }}
                    onKeyPress={e => handleKeyPress(e, code4Ref)}
                    value={code5}
                  />
                </View>
                {showInputError && (
                  <Text style={styles.errorText}>
                    {langObj.wrongPhoneNumber}
                  </Text>
                )}
                <View style={styles.resend_sms_wrapper}>
                  <Text style={[styles.textBasicStyle, styles.textDescription]}>
                    {langObj.codeNotArrived}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      isMaxSmsSent ? openIntercomChat() : sendSmsCodeAgain();
                    }}
                    style={{
                      marginStart: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: '#000000',
                    }}>
                    <Text
                      style={[
                        styles.textBasicStyle,
                        styles.textDescription,
                        {fontWeight: 'bold'},
                      ]}>
                      {isMaxSmsSent
                        ? langObj.goToSupport
                        : countDownTime == 0
                        ? langObj.sendAgain
                        : countDownTime + ' ' + langObj.seconds}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {indicatorDisplay && (
              <View
                style={[
                  styles.loadingContainer,
                  {width: SIZES.screenWidth, height: SIZES.screenHeight},
                ]}>
                <ActivityIndicator
                  animating={indicatorDisplay}
                  size="large"
                  color={COLORS.dibbleYellow}
                />
                <Text style={styles.loadingText}>רק רגע ...</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  textBasicStyle: {
    fontFamily: 'AlmoniDLAAA',
  },
  resend_sms_wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textDescription: {
    ...FONTS.body1,
    fontSize: 20,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...FONTS.h2,
    textAlign: 'center',
    color: COLORS.ParagraphGray,
  },
  logo: {
    alignSelf: 'center',
    width: 150,
    height: 120,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.space16,
    paddingHorizontal: SIZES.space12,
    borderRadius: SIZES.radius,
    ...SHADOWS.cardsAndButtons,
    gap: SIZES.space16,
    width: '100%',
  },
  codeInputContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginVertical: 20,
  },
  codeInput: {
    fontSize: 24,
    textAlign: 'center',
    color: COLORS.black,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    width: screenWidth * (1 / 7),
    height: screenWidth * (5 / 28),
    marginHorizontal: 5,
    shadowColor: '#000',
    fontFamily: 'OscarFM-Regular',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fieldContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: SIZES.space8,
    paddingHorizontal: SIZES.space12,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    marginVertical: SIZES.space8,
    ...SHADOWS.cardsAndButtons,
  },
  focusedFieldContainer: {
    borderBottomColor: COLORS.dibbleYellow,
    borderBottomWidth: 2,
  },
  fieldText: {
    ...FONTS.body1,
    height: 30,
    flex: 1,
    textAlign: 'right',
  },
  fieldName: {
    ...FONTS.body1,
    color: COLORS.ParagraphGray,
  },
  eyeIconContainer: {
    alignItems: 'center',
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  loginButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginVertical: SIZES.space12,
    borderRadius: SIZES.buttonRadius,
    backgroundColor: COLORS.dibbleYellow,
    ...SHADOWS.cardsAndButtons,
  },
  loginButtonText: {
    color: COLORS.white,
    ...FONTS.h2,
  },
  loadingContainer: {
    backgroundColor: COLORS.background,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  loadingText: {
    ...FONTS.body1,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.space8,
    width: '100%',
  },
  errorMessageText: {
    color: COLORS.errorRed,
    ...FONTS.body2,
  },
  supportText: {
    ...FONTS.body2,
    ...FONTS.fontBold,
    color: COLORS.dibbleYellow,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: COLORS.errorRed,
    ...FONTS.body2,
    marginBottom: 5,
  },
});

export default SmsVerificationScreen;
