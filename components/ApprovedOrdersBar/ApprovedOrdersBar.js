import React, {useMemo} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DisplayAcceptBid from './DisplayAcceptBid';
import {bg_order_grey_end, bg_order_grey_start} from '../../resource/BaseValue';
import getLanguage from '../../resource/LanguageSupport';
import SectionTitle from '../SectionTitle/SectionTitle';

let langObj = getLanguage();

const ApprovedOrdersBar = ({
  approvedTimedOrders,
  acceptBid,
  setBidOrderReady,
  showModalBox,
}) => {
  const filteredOrders = useMemo(
    () =>
      acceptBid.filter(order => !approvedTimedOrders.includes(order.order_id)),
    [approvedTimedOrders, acceptBid],
  );

  return (
    <View style={styles.columnBarContainer}>
      <SectionTitle
        title={langObj.outgoing}
        filteredOrders={filteredOrders.length}
      />
      <LinearGradient
        colors={[bg_order_grey_start, bg_order_grey_end]}
        style={styles.barLinearGradientStyle}>
        <FlatList
          data={filteredOrders}
          renderItem={({item, index}) => (
            <DisplayAcceptBid
              item={item}
              index={index}
              showModalBox={showModalBox}
              setBidOrderReady={setBidOrderReady}
              onSecondBtnPress={showModalBox}
              key={item.order_id}
            />
          )}
          keyExtractor={item => item.order_id.toString()}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  columnBarContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  barHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  barLinearGradientStyle: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    padding: 10,
  },
});

export default React.memo(ApprovedOrdersBar);
