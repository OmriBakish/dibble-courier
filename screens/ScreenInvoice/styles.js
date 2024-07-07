import {Dimensions, I18nManager, StyleSheet} from 'react-native';
import {
  bg_incomingOrder,
  bg_white,
  bg_yellow_bubble,
  c_orange,
  c_text_blue,
  c_text_grey,
  c_text_order_id,
  greyHasOpacity,
} from '../../resource/BaseValue';
import {getPerfectSize} from '../../resource/LanguageSupport';
let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export const screenInvoiceStyle = StyleSheet.create({
  titleStyle: {
    fontSize: perfectSize(60),
    position: 'absolute',
    top: perfectSize(42),
    fontWeight: 'normal',
    flexWrap: 'wrap',
    letterSpacing: perfectSize(-1),
    fontFamily: 'OscarFM-Regular',
  },
});
