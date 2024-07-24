import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import CustomButton from '../components/CustomButton/CustomButton';

import DeviceInfo from 'react-native-device-info';
import {
  key_user_info,
  rq_send_sms_code,
  key_business_name,
} from '../resource/BaseValue';
import {SmsVerificationScreenName} from '../src/constants/Routes';

import {
  makeAPostRequest,
  saveData,
  openIntercomChat,
} from '../resource/SupportFunction';
import getLanguage from '../resource/LanguageSupport';
import {UserContext} from '../resource/auth/UserContext';
import moment from 'moment';
import {COLORS, FONTS, SHADOWS, SIZES} from '../src/constants/theme';
import {useNavigation} from '@react-navigation/native';

const SmsVerificationScreen = props => {
  const navigation = useNavigation();
  const context = useContext(UserContext);
  const [indicatorDisplay, setIndicatorDisplay] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showInputError, setShowInputError] = useState(false);
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
  const langObj = getLanguage();
  const canContinue = inputtxt => {
    if (inputtxt.startsWith('05') && inputtxt.length == 10) {
      return true;
    } else {
      return false;
    }
  };
  const validatePhone = inputTxt => {
    if (inputTxt.length >= 2 && !inputTxt.startsWith('05')) {
      return false;
    }
    return true;
  };

  const handlePhoneNumberChange = text => {
    const onlyNumbers = text.replace(/\D/g, '');
    setPhoneNumber(onlyNumbers);

    if (!validatePhone(onlyNumbers)) {
      setShowInputError(true);
    } else {
      setShowInputError(false);
    }
  };

  const sendSmsCode = async () => {
    if (phoneNumber === '') {
      setIsShowErrorMessage(true);
    } else {
      let dataObj = {
        request: rq_send_sms_code,
        phone_num: phoneNumber,
      };

      makeAPostRequest(
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
  };

  let showErrorMessage = [];
  if (isShowErrorMessage) {
    showErrorMessage = (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageText}>{langObj.loginError}</Text>
        <TouchableOpacity onPress={openIntercomChat}>
          <Text style={styles.supportText}>{langObj.support}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const _onSendOtpSuccess = () => {
    console.log(`______________`);

    navigation.navigate(SmsVerificationScreenName, {
      userPhone: this.state.phoneNumber,
      userCountryCode: this.state.countryPhoneCode,
    });
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
                <Text style={styles.sectionTitle}>
                  {' '}
                  {langObj.verificationCode}
                </Text>

                <View
                  style={[
                    styles.fieldContainer,
                    phoneNumberFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>
                    {langObj.yourPhoneNumber}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.enterYourMobileNumber}
                      onFocus={() => setPhoneNumberFocused(true)}
                      onBlur={() => setPhoneNumberFocused(false)}
                      style={styles.fieldText}
                      value={phoneNumber}
                      secureTextEntry={false}
                      onChangeText={handlePhoneNumberChange}
                      keyboardType={'number-pad'}
                      maxLength={10}
                    />
                  </View>
                </View>
                {showInputError && (
                  <Text style={styles.errorText}>
                    {langObj.wrongPhoneNumber}
                  </Text>
                )}
              </View>
              <View>{showErrorMessage}</View>

              <CustomButton
                text={
                  canContinue(phoneNumber)
                    ? langObj.approve
                    : langObj.putValidPhoneNumber
                }
                onPress={() => {
                  if (canContinue(phoneNumber)) {
                    sendSmsCode();
                  }
                }}
                style={[!canContinue(phoneNumber) && {opacity: 0.2}]}
                backgroundColor={canContinue(phoneNumber) ? null : 'black'}
                noBorder={true}
              />
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
    width: '100%', // Use percentage width to make it responsive
    paddingHorizontal: 16, // Optional: Add padding to adjust inner spacing
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
