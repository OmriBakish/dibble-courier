import React, {Fragment, useContext} from 'react';
import {Image, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import pure from 'recompose/pure';
import {UserContext} from '../../resource/auth/UserContext';

import Logo from '../../src/assets/icons/logo.svg';
import {COLORS, FONTS, SHADOWS, SIZES} from '../../src/constants/theme';
import CustomButton from '../CustomButton/CustomButton';
import getLanguage from '../../resource/LanguageSupport';

const langObj = getLanguage();

const DibbleHeader = ({
  navigation,
  handleGetPaidModal,
  DashBoardScreen,
  title,
}) => {
  const {loggedIn, setLoggedIn, updateRevenu, setUpdateRevenu} =
    useContext(UserContext);

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.touchableOpacityStyle}
            activeOpacity={1}
            onPress={() => {
              setUpdateRevenu(c => !c);
              navigation.toggleDrawer();
            }}>
            <Image
              source={require('../../image/icon_menu_black.png')}
              resizeMode="contain"
              style={styles.menuHamburgerImageStyle}
            />
            <Text style={styles.mainTitle}>{title}</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Logo width={200} height={24} />
          </View>

          <View style={styles.btnContainer}>
            {DashBoardScreen && (
              <CustomButton
                text={langObj.getEarlyPayment}
                small
                onPress={() => handleGetPaidModal()}
              />
            )}
          </View>
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    ...SHADOWS.cardsAndButtons,
    marginVertical: SIZES.space16,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 10,
    minHeight: 36,
  },
  touchableOpacityStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuHamburgerImageStyle: {
    width: 25,
    height: 25,
  },
  mainTitle: {
    ...FONTS.h2,
    paddingHorizontal: SIZES.space8,
  },
  btnContainer: {
    maxWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: +75}],
  },
});

export default pure(DibbleHeader);
