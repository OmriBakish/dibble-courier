import React from 'react';
import {FlatList} from 'react-native';
import moment from 'moment';
import BidedOrders from '../IncomingOrdersBar/BidedOrder';

const ScheduledOrdersList = ({
  acceptBid,
  approvedTimedOrders,
  showModalBox,
}) => {
  const data = acceptBid.filter(
    order =>
      approvedTimedOrders.find(approved => approved == order.order_id) !==
      undefined,
  );

  return (
    <FlatList
      keyboardShouldPersistTaps="always"
      listKey={moment().valueOf().toString()}
      contentContainerStyle={{paddingBottom: 50}}
      data={data}
      renderItem={({item}) => (
        <BidedOrders item={item} scheduledOrder showModalBox={showModalBox} />
      )}
      keyExtractor={item => item.order_id.toString()}
    />
  );
};

export default ScheduledOrdersList;
