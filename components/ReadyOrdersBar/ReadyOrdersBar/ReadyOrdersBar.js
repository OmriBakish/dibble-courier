import * as React from 'react';
import {FlatList, Image, Text, View, TouchableOpacity} from 'react-native';
import {
  bg_incomingOrder,
  bg_order_grey_end,
  bg_order_grey_start,
  bg_order_ready_1,
  c_text_grey,
} from '../../../resource/BaseValue';
import {globalStyles} from '../../../resource/style/global';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import pure from 'recompose/pure';
import getLanguage, {getPerfectSize} from '../../../resource/LanguageSupport';
import ReadyOrderCard from '../OrderCard/ReadyOrderCard';
import {ReadyBarStyle} from './style';
let langObj = getLanguage();
function ReadyOrdersBar({readyOrder, shippedOrder, showModalBox, ...props}) {
  function renderShippedOrderCard({item}) {
    return (
      <TouchableOpacity
        onPress={() => {
          showModalBox(item, 3);
        }}
        style={ReadyBarStyle.shippedOrderCardContainer}>
        <Image
          source={require('../../../image/pickup_icon.png')}
          resizeMode="contain"
          style={ReadyBarStyle.shippedOrderLogoImageStyle}
        />
        <View style={ReadyBarStyle.shippedOrderDetailsContainer}>
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_40,
              ReadyBarStyle.textOrderId,
              {textAlign: 'center'},
            ]}>
            {langObj.order + ' ' + item.order_id}
          </Text>
          <Text
            style={[
              globalStyles.textOscarFmRegular_50,
              ReadyBarStyle.shippedOrderOnTheWayTextStyle,
            ]}>
            {langObj.onTheWayToCustomer}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[ReadyBarStyle.columnContainer]}>
      <View style={ReadyBarStyle.barHeaderContainer}>
        <View style={ReadyBarStyle.barTitleContainer}>
          <Text
            style={[globalStyles.textOscarFmRegular_50, {color: c_text_grey}]}>
            {readyOrder.length} {langObj.ready}
          </Text>
        </View>
        <Image
          source={require('../../../image/icon_arrow_left_black_d2.png')}
          resizeMode="contain"
          style={ReadyBarStyle.barHeaderArrowImageStyle}
        />
      </View>

      <LinearGradient
        colors={[bg_order_ready_1, bg_incomingOrder]}
        style={ReadyBarStyle.barLinearGradientStyle}>
        <FlatList
          listKey={moment().valueOf().toString()}
          data={readyOrder}
          renderItem={({item}) => (
            <ReadyOrderCard item={item} showModalBox={showModalBox} />
          )}
          keyExtractor={item => item.order_id}
        />
      </LinearGradient>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          display: shippedOrder.length > 0 ? 'flex' : 'none',
        }}>
        <View style={ReadyBarStyle.wayToCustumerTitleContainer}>
          <Text
            style={[globalStyles.textOscarFmRegular_50, {color: c_text_grey}]}>
            {shippedOrder.length} {langObj.onTheWayToCustomer}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={[bg_order_grey_start, bg_order_grey_end]}
        style={[
          ReadyBarStyle.barLinearGradientWayToCustomer,
          {display: shippedOrder.length > 0 ? 'flex' : 'none'},
          // backgroundColor: bg_underline,
        ]}>
        <FlatList
          listKey={moment().valueOf().toString()}
          data={shippedOrder}
          renderItem={renderShippedOrderCard}
          keyExtractor={item => item.order_id}
        />
      </LinearGradient>
    </View>
  );
}
export default pure(ReadyOrdersBar);
