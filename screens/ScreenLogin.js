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
import DeviceInfo from 'react-native-device-info';
import {
  key_user_info,
  rq_login,
  key_business_name,
} from '../resource/BaseValue';
import {DashboardScreenName} from '../src/constants/Routes';

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

const LoginScreen = props => {
  const navigation = useNavigation();
  const context = useContext(UserContext);
  const [indicatorDisplay, setIndicatorDisplay] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userNameFocused, setUserNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isShowErrorMessage, setIsShowErrorMessage] = useState(false);

  const login = async () => {
    if (userName === '' || password === '') {
      setIsShowErrorMessage(true);
    } else {
      let dataObj = {
        request: rq_login,
        email: userName,
        password: password,
        app_version: DeviceInfo.getVersion(),
        os_type: Platform.OS === 'ios' ? 2 : Platform.OS === 'android' ? 1 : 0,
      };

      makeAPostRequest(
        dataObj,
        () => setIndicatorDisplay(true),
        () => setIndicatorDisplay(false),
        (isSuccess, responseJson) => {
          if (isSuccess) {
            HandleLogin(responseJson);
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

  const HandleLogin = responseJson => {
    console.log('handle login');
    // let {loggedIn, setLoggedIn, updateRevenu, setUpdateRevenu} = context;

    // setLoggedIn(true);
    // setUpdateRevenu(c => !c);
    saveData(JSON.stringify(responseJson), key_user_info);
    console.log('key_user_info');
    saveData(
      JSON.stringify({
        first_name: responseJson.first_name,
        last_name: responseJson.last_name,
      }),
      key_business_name,
    );
    console.log('setIsShowErrorMessage');
    setIsShowErrorMessage(false);
    console.log('navigation');
    navigation.navigate(DashboardScreenName, {
      refreshScreen: moment(new Date()).millisecond,
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
              <Image
                source={require('../image/login_logo.png')}
                resizeMode="contain"
                style={styles.logo}
              />

              <View style={styles.inputContainer}>
                <Text style={styles.sectionTitle}>התחברות למערכת</Text>
                <View
                  style={[
                    styles.fieldContainer,
                    userNameFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>{langObj.userName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.userName}
                      onFocus={() => setUserNameFocused(true)}
                      onBlur={() => setUserNameFocused(false)}
                      style={styles.fieldText}
                      value={userName}
                      secureTextEntry={false}
                      onChangeText={text => setUserName(text)}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.fieldContainer,
                    passwordFocused && styles.focusedFieldContainer,
                  ]}>
                  <Text style={styles.fieldName}>{langObj.password}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput
                      placeholder={langObj.password}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      style={styles.fieldText}
                      value={password}
                      secureTextEntry={!showPassword}
                      onChangeText={text => setPassword(text)}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setShowPassword(!showPassword);
                      }}
                      style={styles.eyeIconContainer}>
                      <Image
                        source={require('../image/icon_eye.png')}
                        resizeMode="contain"
                        style={styles.eyeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>{showErrorMessage}</View>

              <TouchableOpacity onPress={login} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>{langObj.login}</Text>
              </TouchableOpacity>
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

let langObj = getLanguage();
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
    width: 600,
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
});

export default LoginScreen;
