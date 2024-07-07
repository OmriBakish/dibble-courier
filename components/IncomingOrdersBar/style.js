import {Dimensions, I18nManager, StyleSheet} from 'react-native';
import {
  bg_dark,
  bg_incomingOrder,
  bg_underline,
  bg_white,
  bg_yellow_bubble,
  c_orange,
  c_text_black,
  c_text_blue,
  c_text_grey,
  c_text_order_id,
  greyHasOpacity,
} from '../../resource/BaseValue';
import {getPerfectSize} from '../../resource/LanguageSupport';
import {globalStyles} from '../../resource/style/global';
let perfectSize = getPerfectSize();
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export const IncomingBarStyle = StyleSheet.create({
  scheduledHeaderContainerOuter: {
    flex: 1,
    height: perfectSize(100),
    justifyContent: 'flex-start',
    backgroundColor: '#ffca1a',
  },
  scheduledHeaderContainerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderColor: '#707070',
    borderWidth: perfectSize(4),
    marginRight: perfectSize(30),
    marginTop: perfectSize(-30),
    height: perfectSize(47.6),
    width: perfectSize(47.6),
    borderRadius: 10,
    backgroundColor: '#ffca1a',
  },
  OrderCardContainer: {
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
  orderTotalItems: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(24),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
  },
  deliveryTimer: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(34),
    letterSpacing: -0.6,
    color: 'rgb(70,71,75)',
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
  notesContainer: {
    width: '100%',
    backgroundColor: '#ededed',	
    borderRadius: perfectSize(22),	
    padding: perfectSize(10),	
    maxHeight: perfectSize(150),	
  },	

  notesContainerFull: {
    width: '100%',
    backgroundColor: '#ededed',	
    borderRadius: perfectSize(22),	
    padding: perfectSize(10),	
    maxHeight: perfectSize(200),	
  },	
  userNotes: {	
    fontFamily: 'AlmoniDLAAA',	
    fontSize: perfectSize(40),	
    letterSpacing: -0.6,	
    color: 'red',	
    padding: 10,	
    borderRadius: 10,	
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',	
  },	
  barLinearGradientStyle: {	
    flexDirection: 'column',	
    flex: 1,	
    alignSelf: 'stretch',	
    margin: 10,	
    padding: 10,	
  },	
  columnBarContainer: {	
    flex: 1,	
    flexDirection: 'column',	
    alignItems: 'flex-start',	
    margin: 10,	
  },	
  barHeaderContainer: {	
    flexDirection: 'row',	
    alignItems: 'flex-start',	
  },	
  barTitleContainer: {	
    borderBottomWidth: 6,	
    borderBottomColor: bg_underline,	
    marginEnd: 10,	
    marginStart: 10,	
    paddingBottom: 5,	
  },	
  barHeaderArrowImageStyle: {	
    width: perfectSize(50),	
    height: perfectSize(35),	
    marginTop: 3,	
    alignSelf: 'flex-start',	
  },	
  orderCardContainer: {	
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
  orderCardContainerOption2: {	
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
  orderCardTitleContainer: {	
    flexDirection: 'column',	
    flex: 1,	
    alignItems: 'center',	
  },	
  orderCardHeaderContainer: {	
    flexDirection: 'row',	
    marginStart: 5,	
    marginEnd: 5,	
    marginTop: 10,	
  },	
  orderCardTitleDetailContainer: {	
    flexDirection: 'row',	
    alignItems: 'center',	
  },	
  orderCardLogoImageStyle: {	
    width: perfectSize(70),	
    height: perfectSize(70),	
  },	
  orderCardLogoContainerStyle: {	
    width: perfectSize(70),	
    height: perfectSize(70),	
    alignItems: 'center',	
    justifyContent: 'center',	
  },	
  orderProductListStyle: {marginTop: 5, alignItems: 'center'},	
  orderCardOrderTypeTextStyle: {	
    fontFamily: 'AlmoniDLAAA',	
    fontSize: 15,	
    letterSpacing: -0.5,	
  },	
  orderNotesContainer: {	
       justifyContent:'flex-end',
    alignItems: 'flex-start',
      margin: perfectSize(10),
     marginTop:'auto',
    flexDirection: 'column',
  },
  orderNotesTitle: {
    fontFamily: 'AlmoniDLAAA-Bold',
    fontSize: perfectSize(40),
    color: 'black',
    paddingBottom: 5,
  },
  orderReadyButtonContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: perfectSize(20),
    paddingBottom: perfectSize(20),
    marginStart: perfectSize(20),
    marginEnd: perfectSize(20),
    marginBottom: perfectSize(20),
    borderRadius: perfectSize(20),
    color: '#ffffff',
    backgroundColor: bg_dark,
    marginTop: perfectSize(40),
  },
  orderRejectButtonContainer: {
    marginTop: perfectSize(10),
    paddingBottom: perfectSize(60),
    alignItems: 'center',
  },
  orderRejectButtonText: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(50),
    color: c_text_black,
  },
});
