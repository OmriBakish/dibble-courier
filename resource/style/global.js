import {StyleSheet, I18nManager} from 'react-native';
import {getPerfectSize} from '../LanguageSupport';
let perfectSize = getPerfectSize();

export const globalStyles = StyleSheet.create({
  textHeader: {
    fontFamily: 'Oscar FM',
    fontSize: 92,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  lackOfProductBtn: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(60),

    letterSpacing: -3,
    textAlign: 'center',
    color: '#ff0000',
  },
  textGeneral: {
    // fontFamily: 'HelveticaNeue',
    fontFamily: 'OscarFM-Regular',
    fontSize: 25,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textGeneralBold: {
    fontFamily: 'HelveticaNeue',
    fontSize: 17,
    fontWeight: 'bold',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textSmall: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textLarge: {
    // fontFamily: 'HelveticaNeue',
    fontFamily: 'OscarFM-Regular',
    fontSize: 52.25,
    letterSpacing: -1.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textDescription: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },

  // AlmoniDLAAA
  textAlmoniDLAAA_20: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 10,
    letterSpacing: -0.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_10: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(25),
    letterSpacing: -0.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_24: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(24),
    letterSpacing: -0.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_30: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(30),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_40: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_42: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(42),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_BOLD_42: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(42),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_50: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(50),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_60: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(60),
    letterSpacing: -1.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_65: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 65 / 2,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_71: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 71 / 2,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_112: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 112 / 2,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },

  // AlmoniDLAAA-Bold
  textAlmoniDLAAA_Bold_40: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(40),
    letterSpacing: -0.5,

    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textAlmoniDLAAA_Bold_71: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: 71 / 2,
    letterSpacing: -0.5,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },

  // OscarFM
  textOscarFmRegular_70: {
    fontFamily: 'OscarFM-Regular',
    fontSize: getPerfectSize()(70),
    letterSpacing: -1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textOscarFmRegular_50: {
    fontFamily: 'OscarFM-Regular',
    fontSize: getPerfectSize()(50),
    letterSpacing: -1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textOscarFmRegular_40: {
    fontFamily: 'OscarFM-Regular',
    fontSize: getPerfectSize()(40),
    letterSpacing: -1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textOscarFmRegular_30: {
    fontFamily: 'OscarFM-Regular',
    fontSize: getPerfectSize()(30),
    letterSpacing: -1,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  textRedButton: {
    fontFamily: 'AlmoniDLAAA',
    letterSpacing: -0.5,
    lineHeight: 38,
    fontSize: 22,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});
