import React from 'react';
import CollapsibleCard from '../CollapsibleCard/CollapsibleCardComponent';
import ScheduledOrdersHeader from './ScheduledOrdersHeader';
import TimeOrderList from '../ScheduledOrdersList/ScheduledOrdersList';

const ScheduledOrders = ({
  acceptBid,
  approvedTimedOrders,
  refreshList,
  showModalBox,
}) => {
  return (
    <CollapsibleCard
      Header={
        <ScheduledOrdersHeader
          acceptBid={acceptBid}
          approvedTimedOrders={approvedTimedOrders}
        />
      }
      refreshList={refreshList}
      contentHeight={450}
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
        showModalBox={showModalBox}
        acceptBid={acceptBid}
        approvedTimedOrders={approvedTimedOrders}
      />
    </CollapsibleCard>
  );
};

export default ScheduledOrders;
