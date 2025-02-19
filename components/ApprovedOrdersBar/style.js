import {I18nManager, StyleSheet} from 'react-native';
import {
  bg_dark,
  bg_incomingOrder,
  bg_underline,
  c_orange,
} from '../../resource/BaseValue';
import {getPerfectSize} from '../../resource/LanguageSupport';
let perfectSize = getPerfectSize();
export const approvedOrderBarStyle = StyleSheet.create({
  barLinearGradientStyle: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',

    padding: 10,
  },
  columnBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  quantityItemsText: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(30),
    marginTop: 5,
    letterSpacing: -0.7,
    color: 'rgb(133,133,134)',
  },
  userNotes: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(40),
    letterSpacing: -0.6,
    color: 'red',

    padding: 10,
    backgroundColor: 'rgba(237,237,237,0.5)',
    borderRadius: 10,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
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
    flex: 2,
    alignItems: 'center',
    marginStart: 10,
  },
  orderCardHeaderContainer: {
    flexDirection: 'row',
    marginStart: 5,
    marginEnd: 5,
    marginTop: 10,
  },
  orderCardTitleDetailContainer: {flexDirection: 'row', alignItems: 'center'},
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
    fontFamily: 'AlmoniDLAAA',
    fontSize: 15,
    alignSelf: 'flex-start',

    letterSpacing: -0.5,
    color: 'rgb(209,210,212)',
    paddingBottom: 5,
  },
  orderReadyButtonContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: perfectSize(20),
    marginHorizontal: perfectSize(20),
    marginVertical: perfectSize(10),
    borderRadius: 10,
    color: '#ffffff',
    backgroundColor: bg_dark,
  },
});
