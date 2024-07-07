import {Dimensions, I18nManager, StyleSheet} from 'react-native';
import {getPerfectSize} from '../../resource/LanguageSupport';
let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export const screenRejectOrderStyle = StyleSheet.create({
  titleTextStyle: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(50),
    color: '#000000',
  },
  contentTextStyle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    letterSpacing: perfectSize(-1.2),
    textAlign: 'center',
    color: '#46474b',
  },
  contentTextStyleThick: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    letterSpacing: perfectSize(-1.2),
    textAlign: 'center',
    color: '#46474b',
  },
  contentTextStyleBold: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(40),
    letterSpacing: perfectSize(-1.2),
    textAlign: 'center',
    color: '#46474b',
  },
  pickReasonTitle: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(50),
    lineHeight: 50,
    letterSpacing: perfectSize(-1),
    textAlign: 'center',
    color: '#858586',
  },
});
