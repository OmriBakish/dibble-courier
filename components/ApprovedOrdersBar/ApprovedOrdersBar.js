import React, {useMemo} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DisplayAcceptBid from './DisplayAcceptBid';
import {bg_order_grey_end, bg_order_grey_start} from '../../resource/BaseValue';
import getLanguage from '../../resource/LanguageSupport';
import {COLORS, FONTS, SIZES} from '../../src/constants/theme';

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
      <View style={styles.barTitleContainer}>
        <View style={styles.rightLine}></View>
        <Text style={styles.columnTitle}>
          {filteredOrders.length} {langObj.outgoing}
        </Text>
        <View style={styles.leftLine}></View>
      </View>

      <LinearGradient
        colors={[bg_order_grey_start, bg_order_grey_end]}
        style={styles.barLinearGradientStyle}>
        <FlatList
          data={filteredOrders}
          renderItem={({item, index}) => (
            <DisplayAcceptBid
              showModalBox={showModalBox}
              item={item}
              index={index}
              setBidOrderReady={setBidOrderReady}
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
  barTitleContainer: {
    borderBottomColor: COLORS.dibbleYellow,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLine: {
    width: 20,
    height: 3,
    backgroundColor: COLORS.dibbleYellow,
  },
  leftLine: {
    height: 3,
    backgroundColor: COLORS.dibbleYellow,
    flex: 1,
  },
  columnTitle: {
    ...FONTS.h2,
    paddingHorizontal: SIZES.space4,
    color: COLORS.ParagraphGray,
  },
  barLinearGradientStyle: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'stretch',
    padding: 10,
  },
});

export default React.memo(ApprovedOrdersBar);
