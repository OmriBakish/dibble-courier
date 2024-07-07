import {Dimensions, I18nManager, StyleSheet} from 'react-native';
import {
  bg_white,
  bg_yellow_bubble,
  c_orange,
  c_text_blue,
  c_text_grey,
  c_text_order_id,
  c_text_order_ready_status,
  greyHasOpacity,
} from '../../../resource/BaseValue';
import {getPerfectSize} from '../../../resource/LanguageSupport';

let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
export const mStyle = StyleSheet.create({
  readyOrderCardMainContainer: {
    flexDirection: 'column',
    backgroundColor: bg_white,
    flex: 1,
    margin: perfectSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10.0,
    elevation: 10,
  },
  readyOrderContentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  readyOrderIdTextStyle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(50),
    letterSpacing: perfectSize(-1.35),
    textAlign: 'center',
    margin: perfectSize(20),
    color: c_text_order_id,
  },
  readyOrderWaitingForTextStyle: {
    textAlign: 'center',
    marginBottom: 10,
    color: c_text_order_ready_status,
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(50),
    letterSpacing: perfectSize(-1.35),
  },
  readyOrderMinutesLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  readyOrderMinutesNumericTextStyle: {
    textAlign: 'center',
    color: c_orange,
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(70),
    letterSpacing: perfectSize(-1.35),
  },
  redyOrderMinutesTextStyle: {
    textAlign: 'center',
    marginStart: 5,
    color: '#000000',
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(70),
    letterSpacing: perfectSize(-1.35),
  },
});
