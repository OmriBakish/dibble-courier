import React from 'react';
import {IncomingBarStyle} from '../IncomingOrdersBar/style';
 
import {getOptionsArray} from '../../resource/dibbleCommon';
 import pure from 'recompose/pure';
import {
  View,
  I18nManager,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Animated,
   ScrollView,
 
  Image,
} from 'react-native';
import moment from 'moment';
import CollapsibleCard from '../CollapsibleCard/CollapsibleCardComponent';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {
  getHourFormat,
  getTotalItems,
  getItemLogoSource,
  getTotalPrice,getProductName
} from '../../resource/SupportFunction';
import {globalStyles} from '../../resource/style/global';
import {
  c_text_grey,
  greyHasOpacity,
  bg_yellow_bubble,
  c_text_blue,
  c_text_order_id,
  order_type,
} from '../../resource/BaseValue';
let langObj = getLanguage();
let perfectSize = getPerfectSize();
function equal_orders(ord1, ord2) {
  return ord1.order_id == ord2.order_id;
}
 
const DisplayTimedOrder = ({item}) => {
  //console.count('displayTimedOrder')
  const comments_space = item.notes ? perfectSize(400) : 0;
  let content_height = 0;
  item.products.forEach((product) => {
    content_height +=
      Math.ceil(product.product_name.length / 15) * perfectSize(100);
  });

  return (
     <View>
      <CollapsibleCard
        contentHeight={content_height + comments_space}
        Header={() => display_timed_order_header(item)}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fcfcfc',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {item.products.map((prod, index) => (
            <DisplayProductItem item={prod} index={index} />
          ))}
          {item.notes ? (
            <View
              style={{
                alignContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                flexDirection: 'column',
              }}>
                 <Text style={IncomingBarStyle.orderNotesTitle}>
                  {langObj.orderComment}
                </Text>
                <ScrollView style={[IncomingBarStyle.notesContainer]}>
                  <Text style={[IncomingBarStyle.userNotes]}>{item.notes}</Text>
                </ScrollView>
             </View>
          ) : null}
        </View>
      </CollapsibleCard>
    </View>
 
  );
};
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

function display_timed_order_header(item) {
  //console.log(item)
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginTop: perfectSize(10),
        backgroundColor: '#fcfcfc',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5.0,
        elevation: 5,
        height: perfectSize(201),
      }}>
      <View
        style={{
          flexDirection: 'row',
           marginStart: perfectSize(10),
          marginEnd: perfectSize(10),
 
          marginTop: 10,
        }}>
        <View style={{flex: 1}} />
        <View style={{flex: 1}} />
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[mStyle.orderIdTitle]}>{langObj.orderID}</Text>
            <Text style={[mStyle.orderIdItems]}>{item.order_id} </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[mStyle.orderTotalItems]}>
              {langObj.totalItems}: {getTotalItems(item)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {
                  fontSize: perfectSize(42),
                  color: '#46474b',
                  letterSpacing: perfectSize(-1.68),
                },
              ]}>
              {langObj.totalCost}: {getTotalPrice(item)} {langObj.nis}
            </Text>
          </View>
        </View>
        <View style={{flex: 1}} />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginEnd: 10,
          }}>
          <View
            style={{
              width: perfectSize(70),
              height: perfectSize(70),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={getItemLogoSource(item)}
              resizeMode="contain"
              style={{
                width: perfectSize(75),
                height: perfectSize(75),
              }}
            />
          </View>
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_24,
              {letterSpacing: -1.41 / 2},
            ]}>
            {order_type[item.order_type]}
          </Text>
          <Text style={[mStyle.deliveryTimer]}>
            {/* {item.order_type == 1 ? langObj.delivery : langObj.pickup} */}
            {getHourFormat(item)}
          </Text>
        </View>
      </View>
    </View>
  );
}
 function DisplayProductItem({item, index}) {
 
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        width: perfectSize(511),
        height: 'auto',
        padding: perfectSize(17),
        margin: perfectSize(17),
        justifyContent: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
      }}>
      <View style={[mStyle.itemContainer]}>
        <View>
          <Image
            source={{uri: item.product_image}}
            resizeMode="cover"
            style={{
              width: perfectSize(70),
              height: perfectSize(70),
            }}
          />
        </View>
        <Image
          source={require('../../image/quantity_icon.png')}
          resizeMode="cover"
          style={{
            width: perfectSize(14),
            height: perfectSize(14),
            marginLeft: perfectSize(10.5),
            marginRight: perfectSize(20.5),
          }}
        />
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View style={{flex: 1, padding: 0, alignItems: 'flex-end'}}>
            <Text style={[mStyle.quantityItems]}>{item.amount}</Text>
          </View>

          <View style={{flex: 1, padding: 0, alignItems: 'flex-start'}}>
            <Text style={[mStyle.quantityItemsText]}>{langObj.quantity}</Text>
          </View>
        </View>

        {/* <Text style={[globalStyles.textAlmoniDLAAA_20, { flex: 3,  ,paddingTop:perfectSize(23),marginStart:perfectSize(24)}]}>
                מק״ט: 3376778
              </Text> */}
        {/* <TouchableOpacity> */}
        {/* <Text style={[globalStyles.textAlmoniDLAAA_20, {textAlign:'right',color: 'rgb(247,186,72)', textDecorationLine: 'underline', letterSpacing: -1.28 / 2}]}>
                  {langObj.productLink}
                </Text> */}
        {/* </TouchableOpacity> */}
      </View>

      <View
        style={{
          height: 'auto',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            globalStyles.textAlmoniDLAAA_24,
            {
              width: perfectSize(250),
              letterSpacing: perfectSize(-1.2),
              marginStart: perfectSize(24),
              fontSize: perfectSize(30),
            },
          ]}>
          {getProductName(item)}
        </Text>
 
        {getOptionsArray(item).map((option) => (
           <Text
            style={[
              globalStyles.textAlmoniDLAAA_24,
              {marginStart: perfectSize(24)},
            ]}>
 
            {option.name}: {option.value}
          </Text>
        ))}
       </View>
    </View>
  );
}
function ScheduledOrdersList(props) {
  const {acceptBid, approvedTimedOrders} = {...props};
  //console.count('ScheduledOrdersList')
   const data = acceptBid.filter(
    (order) =>
      approvedTimedOrders.find((approved) => approved == order.order_id) !==
      undefined,
  );
  // console.count('ScheduledOrdersList Renders')

  return (
    <View>
      <Animated.FlatList
        keyboardShouldPersistTaps="always"
        listKey={moment().valueOf().toString()}
        contentContainerStyle={{paddingBottom: perfectSize(200)}}
        data={data}
        renderItem={DisplayTimedOrder}
 
        keyExtractor={(item) => item.order_id}
      />
    </View>
  );
}
const mStyle = StyleSheet.create({
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

  //NEW DESIGN
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
    fontSize: perfectSize(40),
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
});

export default pure(ScheduledOrdersList);
