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
export const mStyle = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityIndicatorPanelStyle: {
    position: 'absolute',
    backgroundColor: greyHasOpacity,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    borderRadius: screenWidth * 0.03,
    borderWidth: 1,
    borderColor: greyHasOpacity,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTimeCirle: {
    fontFamily: 'HelveticaNeue',
    fontSize: 22,
    fontWeight: 'bold',
    width: screenWidth * 0.07,
    height: screenWidth * 0.07,
    borderRadius: screenWidth * 0.035,
    borderColor: c_text_grey,
    borderWidth: 1,
    textAlign: 'center',
    lineHeight: screenWidth * 0.06,
  },
  textTimeCirleSmall: {
    fontFamily: 'HelveticaNeue',
    fontSize: 20,
    fontWeight: 'bold',
    width: screenWidth * 0.04,
    height: screenWidth * 0.04,
    borderRadius: screenWidth * 0.02,
    borderColor: greyHasOpacity,
    borderWidth: 2,
    textAlign: 'center',
    lineHeight: screenWidth * 0.035,
  },
  textBubble: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    backgroundColor: bg_yellow_bubble,
    color: '#000000',
    padding: 20,
    borderRadius: 5,
  },
  line: {
    alignItems: 'stretch',
    height: 1,
    backgroundColor: greyHasOpacity,
    margin: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginStart: 10,
    marginEnd: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: c_text_blue,
    color: '#ffffff',
  },
  textNoticeLarge: {
    fontFamily: 'HelveticaNeue',
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
  },
  textOrderId: {
    margin: 10,
    color: c_text_order_id,
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    margin: 10,
  },
  orderIdTitle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
    marginTop: 5,
  },
  orderIdItems: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(40),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
  },
  orderTotalItemsTextStyke: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(24),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
  },
  deliveryTimer: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
  },
  fillBidScreenStyle: {
    zIndex: 2,
    width: screenWidth,
    height: screenHeight,
    top: 0,
    flex: 1,
  },
  acceptBidCardOptionB: {
    flexDirection: 'column',
    margin: 10,
    backgroundColor: bg_incomingOrder,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.0,
    elevation: 5,
  },
  acceptBidCard: {
    flexDirection: 'column',
    height: perfectSize(960),
    borderWidth: 1,
    borderColor: c_orange,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: bg_incomingOrder,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.0,
    elevation: 5,
  },
  quantityItems: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(70),
    color: 'rgb(133,133,134)',
  },
  quantityItemsText: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(30),
    marginTop: 5,
    letterSpacing: -0.7,
    color: 'rgb(133,133,134)',
  },
  userNotes: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 14,
    letterSpacing: -0.6,
    color: 'rgb(133,133,134)',
    padding: 10,
    backgroundColor: 'rgba(237,237,237,0.5)',
    borderRadius: 10,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  mainDashBoardContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: bg_white,
  },
  noNetworkMessageTextStyle: {
    position: 'absolute',
    top: perfectSize(-20),
    left: perfectSize(400),
    color: 'red',
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(100),
  },
  orderBarsContainerStyle: {
    marginTop: perfectSize(220),
    flex: 1,
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 10,
    backgroundColor: bg_white,
  },
  modalMainContainerStyle: {
    justifyContent: 'center',
     position: 'absolute',
    height: screenHeight,
    backgroundColor: greyHasOpacity,
    width: screenWidth,

 
    alignItems: 'center',
  },
  mainTitleAndClockContainer: {
    position: 'absolute',
    top: perfectSize(69),
    right: 0,
    left: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
