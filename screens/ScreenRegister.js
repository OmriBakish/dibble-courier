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
import {rq_send_sms_code} from '../resource/BaseValue';
import {SmsVerificationScreenName} from '../src/constants/Routes';
import {makeAPostRequest, openIntercomChat} from '../resource/SupportFunction';
import getLanguage from '../resource/LanguageSupport';
import {UserContext} from '../resource/auth/UserContext';
import {COLORS, FONTS, SHADOWS, SIZES} from '../src/constants/theme';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen = props => {
  const navigation = useNavigation();
  const context = useContext(UserContext);
  const [indicatorDisplay, setIndicatorDisplay] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [showInputError, setShowInputError] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });
  const [inputValidations, setInputValidations] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);
  const langObj = getLanguage();

  const validateFirstNameLength = value => {
    if (value && value.length > 16) {
      return true;
    } else {
      return false;
    }
  };

  const validateFieldRequired = value => {
    if (value && value.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const validateOnlyHebrew = value => {
    const inputHebrewRegExp = /^[א-ת]+$/;
    if (!value || value === '' || inputHebrewRegExp.test(value)) {
      return false;
    } else {
      return true;
    }
  };

  const validateEmail = email => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()) || email === '') {
      return false;
    }
    return true;
  };

  const handleFirstNameChange = text => {
    setFirstName(text);
    if (
      validateFirstNameLength(text) ||
      validateFieldRequired(text) ||
      validateOnlyHebrew(text)
    ) {
      setShowInputError(prevState => ({
        ...prevState,
        firstName: true,
      }));
      if (validateFirstNameLength(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          firstNameError: langObj.lengthLimit16,
        }));
      } else if (validateFieldRequired(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          firstNameError: langObj.requiredField,
        }));
      } else if (validateOnlyHebrew(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          firstNameError: langObj.onlyHebrew,
        }));
      }
    } else {
      setShowInputError(prevState => ({...prevState, firstName: false}));
    }
  };

  const handleLastNameChange = text => {
    setLastName(text);
    if (validateFieldRequired(text) || validateOnlyHebrew(text)) {
      setShowInputError(prevState => ({...prevState, lastName: true}));
      if (validateFirstNameLength(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          lastNameError: langObj.lengthLimit16,
        }));
      } else if (validateFieldRequired(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          lastNameError: langObj.requiredField,
        }));
      } else if (validateOnlyHebrew(text)) {
        setShowInputError(prevState => ({
          ...prevState,
          lastNameError: langObj.onlyHebrew,
        }));
      }
    } else {
      setShowInputError(prevState => ({...prevState, lastName: false}));
    }
  };

  const handleEmailChange = text => {
    setEmail(text);
    if (validateEmail(text)) {
      setShowInputError(prevState => ({...prevState, email: true}));
    } else {
      setShowInputError(prevState => ({...prevState, email: false}));
    }
  };

  const sendSmsCode = async () => {
    if (phoneNumber === '') {
      setIsShowErrorMessage(true);
    } else {
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

  const _onSendOtpSuccess = responseJson => {
    navigation.navigate(SmsVerificationScreenName, {
      userPhone: phoneNumber,
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
                <Text style={styles.sectionTitle}>{langObj.yourDetails}</Text>
                <View
                  style={[
                    styles.fieldContainer,
                    firstNameFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>{langObj.firstName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.firstNamePlaceHolder}
                      onFocus={() => setFirstNameFocused(true)}
                      onBlur={() => setFirstNameFocused(false)}
                      style={styles.fieldText}
                      value={firstName}
                      secureTextEntry={false}
                      onChangeText={handleFirstNameChange}
                      keyboardType={'default'}
                    />
                  </View>
                </View>
                {showInputError.firstName && (
                  <Text style={styles.errorText}>
                    {showInputError.firstNameError}
                  </Text>
                )}
                <View
                  style={[
                    styles.fieldContainer,
                    lastNameFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>{langObj.lastName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.lastNamePlaceHolder}
                      onFocus={() => setLastNameFocused(true)}
                      onBlur={() => setLastNameFocused(false)}
                      style={styles.fieldText}
                      value={lastName}
                      secureTextEntry={false}
                      onChangeText={handleLastNameChange}
                      keyboardType={'default'}
                    />
                  </View>
                </View>
                {showInputError.lastName && (
                  <Text style={styles.errorText}>
                    {showInputError.lastNameError}
                  </Text>
                )}
                <View
                  style={[
                    styles.fieldContainer,
                    emailFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>{langObj.yourEmail}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.yourEmailPlaceHolder}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      style={styles.fieldText}
                      value={email}
                      secureTextEntry={false}
                      onChangeText={handleEmailChange}
                      keyboardType={'email-address'}
                    />
                  </View>
                </View>

                {showInputError.email && (
                  <Text style={styles.errorText}>
                    {langObj.emailIsNotRight}
                  </Text>
                )}
              </View>
              <View>{showErrorMessage}</View>
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

export default RegisterScreen;
