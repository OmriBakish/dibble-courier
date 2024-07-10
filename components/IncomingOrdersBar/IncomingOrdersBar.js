import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import getLanguage from '../../resource/LanguageSupport';
import {
  bg_order_grey_end,
  bg_order_grey_start,
  modal_select_product,
} from '../../resource/BaseValue';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {approvedOrderBarStyle as barStyle} from '../ApprovedOrdersBar/style';
import SectionTitle from '../SectionTitle/SectionTitle';
import BidedOrders from './BidedOrder';
import DisplayAcceptBid from '../ApprovedOrdersBar/DisplayAcceptBid';
import ScheduledOrders from './ScheduledOrders';

const langObj = getLanguage();

const DisplayIncomingOrder = ({item, index, showModalBox, rejectOrder}) => {
  if (item.bid_was_placed == 1) {
    return <BidedOrders item={item} showModalBox={showModalBox} />;
  } else {
    return (
      <DisplayAcceptBid
        item={item}
        index={index}
        onMainBtnPress={() => showModalBox(item, modal_select_product)}
        onSecondBtnPress={() => rejectOrder(item.order_id)}
        key={item.order_id}
        incomingOrders={true}
      />
    );
  }
};

const IncomingOrdersBar = props => {
  const {
    orders,
    approvedTimedOrders,
    acceptBid,
    refreshList,
    showModalBox,
    rejectOrder,
  } = props;

  const [time_out, set_time_out] = useState(null);
  const [has_one, setHasOne] = useState(false);
  const [renderDummy, setRenderDummy] = useState(false);

  const renderOrder = ({item, index}) => {
    return (
      <DisplayIncomingOrder
        item={item}
        index={index}
        time_left={item.time_left}
        time_left_floats={item.time_left_floats}
        showModalBox={showModalBox}
        rejectOrder={rejectOrder}
      />
    );
  };

  const update_order_once = () => {
    console.log('once');
    let has_one_current = false;
    let now = moment.utc(moment());
    orders.forEach(order => {
      if (order.bid_was_placed) {
        let end = moment.utc(order.auction_end_time);
        let time_left = end.diff(now, 'minutes');
        let time_left_floats = moment.duration(end.diff(now)).asMinutes();
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

  useEffect(() => {
    console.log('in use effect orders');
    update_order_once();
  }, [orders]);

  useEffect(() => {
    if (has_one == true) {
      clearTimeout(time_out);
      let timer = setTimeout(update_order_once, 10000);
      set_time_out(timer);
    }
  }, [renderDummy]);

  // New useEffect to handle acceptBid changes
  useEffect(() => {
    if (acceptBid && acceptBid.length > 0) {
      console.log('acceptBid array has arrived or updated:', acceptBid);
      // Perform any operations needed when acceptBid changes
      // For example, you can update the state or trigger a re-render
      setRenderDummy(c => !c);
    }
  }, [acceptBid]);

  return (
    <View style={[barStyle.columnBarContainer]}>
      <SectionTitle title={langObj.incoming} filteredOrders={orders.length} />
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
        <ScheduledOrders
          acceptBid={acceptBid}
          approvedTimedOrders={approvedTimedOrders}
          refreshList={refreshList}
          showModalBox={showModalBox}
        />
      </LinearGradient>
    </View>
  );
};

export default IncomingOrdersBar;
