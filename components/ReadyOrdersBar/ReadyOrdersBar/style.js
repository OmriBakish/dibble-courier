import {StyleSheet} from 'react-native';
import {
  bg_incomingOrder,
  bg_underline,
  bg_white,
  c_text_grey,
  c_text_order_id,
} from '../../../resource/BaseValue';
import {getPerfectSize} from '../../../resource/LanguageSupport';
let perfectSize = getPerfectSize();
export const ReadyBarStyle = StyleSheet.create({
  shippedOrderCardContainer: {
    flexDirection: 'row',
    backgroundColor: bg_white,
    flex: 1,
    margin: 20,
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
  shippedOrderLogoImageStyle: {
    width: perfectSize(120),
    height: perfectSize(120),
    margin: 10,
  },
  shippedOrderDetailsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  shippedOrderOnTheWayTextStyle: {
    textAlign: 'center',
    marginBottom: 10,
    color: c_text_grey,
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
  barLinearGradientWayToCustomer: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
  },
  barLinearGradientStyle: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    margin: 10,
    padding: perfectSize(10),
  },
  barHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  wayToCustumerTitleContainer: {
    marginEnd: 10,
    marginStart: 10,
    paddingBottom: 5,
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
});
