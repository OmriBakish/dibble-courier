import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {IncomingBarStyle} from './style';

const ScheduledOrdersHeader = ({acceptBid, approvedTimedOrders}) => {
  return (
    <View style={IncomingBarStyle.scheduledHeaderContainerOuter}>
      <View style={IncomingBarStyle.scheduledHeaderContainerInner}>
        <Text style={IncomingBarStyle.scheduledHeaderContainerInnerText}>
          {
            acceptBid.filter(
              order =>
                approvedTimedOrders.find(app => app == order.order_id) !=
                undefined,
            ).length
          }
        </Text>
      </View>
      <Text style={IncomingBarStyle.text}>הזמנות מתוזמנות </Text>
      <Text style={IncomingBarStyle.subText}>
        לחץ כאן בשביל לראות את ההזמנות
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

export default ScheduledOrdersHeader;
