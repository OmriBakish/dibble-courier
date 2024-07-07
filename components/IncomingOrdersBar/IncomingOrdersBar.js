import React from 'react';
import {
  Dimensions,
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';

import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import CollapsibleCard from '../CollapsibleCard/CollapsibleCardComponent';

import {
  getHourFormat,
  getItemLogoSource,
  getTotalItems,
  getTotalPrice,
} from '../../resource/SupportFunction';
import pure from 'recompose/pure';
import TimeOrderList from '../ScheduledOrdersList/ScheduledOrdersList';
import {
  bg_order_grey_end,
  bg_order_grey_start,
  c_text_grey,
  c_loading_icon,
  c_text_white,
  modal_select_product,
  order_type,
} from '../../resource/BaseValue';
import moment from 'moment';
import {globalStyles} from '../../resource/style/global';
import LinearGradient from 'react-native-linear-gradient';
import Product_Item from '../ProductCard/ProductCard';
import {approvedOrderBarStyle as barStyle} from '../ApprovedOrdersBar/style';
import {IncomingBarStyle} from './style';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

let langObj = getLanguage();
let perfectSize = getPerfectSize();
function renderProduct({item, index}) {
  return <Product_Item item={item} />;
}

let DisplayIncomingOrder = ({
  item,
  index,
  showModalBox,
  rejectOrder,
  biddedOrders,
  time_left_floats,
  time_left,
}) => {
  // alert(JSON.stringify(item))
  if (item.bid_was_placed == 1) {
    // alert(JSON.stringify(res))
    // alert('render')
    return (
      <TouchableOpacity
        onPress={() => {
          showModalBox(item, 3);
        }}
        style={[
          IncomingBarStyle.orderCardContainerOption2,
          {
            width: perfectSize(560),
            height: perfectSize(201),
            backgroundColor: '#fcfcfc',
            marginTop: perfectSize(10),
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            flexDirection: 'row',
            shadowRadius: 10,
            shadowOpacity: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={{
            justifyContent: 'center',
            marginStart: 'auto',
            alignItems: 'center',
          }}>
          <View style={IncomingBarStyle.orderCardTitleDetailContainer}>
            <Text style={[IncomingBarStyle.orderIdTitle]}>
              {langObj.orderID}
            </Text>
            <Text style={[IncomingBarStyle.orderIdItems]}>
              {item.order_id}{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[IncomingBarStyle.orderTotalItems]}>
              {langObj.totalItems}: {getTotalItems(item)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'AlmoniDLAAA',
                fontSize: perfectSize(42),
                fontWeight: 'normal',
                fontStyle: 'normal',
                letterSpacing: perfectSize(-1.68),
                textAlign: 'right',
                color: '#46474b',
              }}>
              {langObj.totalCost}: {getTotalPrice(item)} {langObj.nis}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginStart: 'auto',
            marginBottom: 'auto',
            marginTop: 'auto',
            paddingRight: perfectSize(28),
          }}>
          {item.time_left === undefined ? (
            <ActivityIndicator
              animating={true}
              size="large"
              color={c_loading_icon}
            />
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {/* Circular indicator */}
              <Text style={{position: 'absolute'}}>
                {Math.ceil(item.time_left_floats)}
              </Text>
              <View style={{position: ''}}>
                {/* {item.time_left_floats?<Text>{item.total_auction_time} {time_left_floats}</Text>:null} */}

                <AnimatedCircularProgress
                  size={perfectSize(80)}
                  width={perfectSize(10)}
                  fill={(item.time_left_floats / item.total_auction_time) * 100}
                  rotation={360}
                  backgroundWidth={perfectSize(6)}
                  tintColor="#f7ba48"
                  //   onAnimationComplete={() => console.log('onAnimationComplete')}
                  backgroundColor="#ededed"
                />
              </View>
            </View>
          )}

          <Text
            style={{
              fontFamily: 'AlmoniDLAAA',
              fontSize: perfectSize(24),
              lineHeight: 16,
              letterSpacing: -0.64,
              textAlign: 'center',
              color: '#858586',
            }}>
            {langObj.waitForSupplier}
          </Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={[IncomingBarStyle.orderCardContainerOption2]}>
        <View style={IncomingBarStyle.orderCardHeaderContainer}>
          <View style={IncomingBarStyle.orderCardTitleContainer}>
            <View style={IncomingBarStyle.orderCardTitleDetailContainer}>
              <Text style={[IncomingBarStyle.orderIdTitle]}>
                {langObj.orderID}
              </Text>
              <Text style={[IncomingBarStyle.orderIdItems]}>
                {item.order_id}{' '}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[IncomingBarStyle.orderTotalItems]}>
                {langObj.totalItems}: {getTotalItems(item)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              marginEnd: 10,
            }}>
            <View style={IncomingBarStyle.orderCardLogoContainerStyle}>
              <Image
                source={getItemLogoSource(item)}
                resizeMode="contain"
                style={IncomingBarStyle.orderCardLogoImageStyle}
              />
            </View>
            <Text style={IncomingBarStyle.orderCardOrderTypeTextStyle}>
              {order_type[item.order_type]}
            </Text>
            <Text style={[IncomingBarStyle.deliveryTimer]}>
              {/* {item.order_type == 1 ? langObj.delivery : langObj.pickup} */}
              {getHourFormat(item)}
            </Text>
          </View>
        </View>

        <FlatList
          listKey={moment().valueOf().toString()}
          style={IncomingBarStyle.orderProductListStyle}
          data={item.products}
          showsVerticalScrollIndicator={false}
          renderItem={renderProduct}
          keyExtractor={item => item.product_id + item.option}
        />

        {/* USER DESCRIPTION */}
        {/*** CHECKING IF THERE IS USER COMMENT IN CASE NOT - THIS SECTION WILL NOT BE DISPLAYED ***/}
        {item.notes ? (
          <View style={IncomingBarStyle.orderNotesContainer}>
            <Text style={IncomingBarStyle.orderNotesTitle}>
              {langObj.orderComment}
            </Text>
            <ScrollView style={IncomingBarStyle.notesContainer}>
              <Text style={[IncomingBarStyle.userNotes]}>{item.notes}</Text>
            </ScrollView>
          </View>
        ) : null}
        {/* Submit a bid */}
        <TouchableOpacity
          onPress={() => {
            showModalBox(item, modal_select_product);
          }}
          style={IncomingBarStyle.orderReadyButtonContainer}>
          <Text style={[globalStyles.textGeneral, {color: c_text_white}]}>
            {langObj.submitABid}
          </Text>
        </TouchableOpacity>

        {/* reject a bid */}

        <TouchableOpacity
          onPress={() => {
            rejectOrder(item.order_id);
          }}
          style={IncomingBarStyle.orderRejectButtonContainer}>
          <Text style={IncomingBarStyle.orderRejectButtonText}>
            {langObj.reject}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

function IncomingOrdersBar(props) {
  const {
    orders,
    approvedTimedOrders,
    acceptBid,
    refreshList,
    showModalBox,
    rejectOrder,
  } = {...props};
  let [time_out, set_time_out] = React.useState(null);
  let [has_one, setHasOne] = React.useState(false);
  let [renderDummy, setRenderDummy] = React.useState(false);

  function renderOrder({item, index}) {
    return (
      <DisplayIncomingOrder
        item={item}
        index={index}
        time_left={item.time_left}
        time_left_floats={item.time_left_floats}
        showModalBox={showModalBox}
        rejectOrder={rejectOrder}></DisplayIncomingOrder>
    );
  }

  let update_order_once = () => {
    console.log('once');
    let has_one_current = false;
    let now = moment.utc(moment());
    orders.forEach(order => {
      if (order.bid_was_placed) {
        let end = moment.utc(order.auction_end_time);
        // alert(end.format('HH:MM'))
        // alert('end '+end)
        // alert('now:' +now.format('HH:mm') + 'end:' +end.format("HH:mm"))
        let time_left = end.diff(now, 'minutes');
        let time_left_floats = moment.duration(end.diff(now)).asMinutes();
        // alert(time_left)
        order.time_left_floats = time_left_floats;
        order.time_left = time_left;
        if (time_left_floats <= 0) {
          order.time_left_floats = 0;
          order.time_left = 0;
        } else {
          has_one_current = true;
        }
        order.total_auction_time = moment(order.auction_end_time).diff(
          moment(order.placed_on),
          'minutes',
        );
      }
    });
    setHasOne(has_one_current);
    setRenderDummy(c => !c);
  };

  React.useEffect(() => {
    console.log('in use effect orders');

    update_order_once();
  }, [orders]);

  React.useEffect(() => {
    //there is a need for a timout
    if (has_one == true) {
      clearTimeout(time_out);
      let timer = setTimeout(update_order_once, 10000);
      set_time_out(timer);
    }
  }, [renderDummy]);

  //console.count('IncomingOrdersBar');
  function TimedBarHeader() {
    return (
      <View style={IncomingBarStyle.scheduledHeaderContainerOuter}>
        <View style={IncomingBarStyle.scheduledHeaderContainerInner}>
          {/*number of active scheduled orders*/}
          <Text style={[globalStyles.textAlmoniDLAAA_30]}>
            {
              acceptBid.filter(
                order =>
                  approvedTimedOrders.find(app => app == order.order_id) !=
                  undefined,
              ).length
            }
          </Text>
        </View>
        <Text
          style={[
            globalStyles.textAlmoniDLAAA_40,
            {marginStart: perfectSize(36)},
          ]}>
          {langObj.timedDelivery}
        </Text>
      </View>
    );
  }

  return (
    <View style={[barStyle.columnBarContainer]}>
      <View style={[barStyle.barHeaderContainer]}>
        <View style={[barStyle.barTitleContainer]}>
          <Text
            style={[
              globalStyles.textOscarFmRegular_50,
              {
                color: c_text_grey,
              },
            ]}>
            {orders.length} {langObj.incoming}
          </Text>
        </View>
        <Image
          source={require('../../image/icon_arrow_left_black_d2.png')}
          resizeMode="contain"
          style={barStyle.barHeaderArrowImageStyle}
        />
      </View>

      <LinearGradient
        colors={[bg_order_grey_start, bg_order_grey_end]}
        style={[barStyle.barLinearGradientStyle, {overflow: 'visible'}]}>
        <FlatList
          listKey={moment().valueOf().toString()}
          data={orders}
          extraData={renderDummy}
          renderItem={renderOrder}
          keyExtractor={item => item.order_id}
        />

        <CollapsibleCard
          Header={TimedBarHeader}
          refreshList={refreshList}
          contentHeight={perfectSize(900)}
          style={{
            display:
              acceptBid.filter(
                order =>
                  approvedTimedOrders.find(app => app == order.order_id) !=
                  undefined,
              ).length > 0
                ? 'flex'
                : 'none',
          }}>
          <TimeOrderList
            acceptBid={acceptBid}
            l={props.l}
            approvedTimedOrders={approvedTimedOrders}></TimeOrderList>
        </CollapsibleCard>
      </LinearGradient>
    </View>
  );
}

export default pure(IncomingOrdersBar);
