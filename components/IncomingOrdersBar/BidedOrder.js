import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import getLanguage from '../../resource/LanguageSupport';
import {
  getHourFormat,
  getItemLogoSource,
  getTotalItems,
  getTotalPrice,
} from '../../resource/SupportFunction';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {COLORS, FONTS, SHADOWS, SIZES} from '../../src/constants/theme';
import {order_type} from '../../resource/BaseValue';

const langObj = getLanguage();

const BidedOrders = ({item, scheduledOrder, showModalBox}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        showModalBox(item, 3);
      }}
      style={styles.container}>
      <View style={styles.orderCardHeaderContainer}>
        <View style={styles.orderCardTitleContainer}>
          <View style={styles.rowAlignCenter}>
            <Text style={styles.orderIdTitle}>{langObj.orderID}</Text>
            <Text style={styles.orderIdItems}>{item.order_id}</Text>
          </View>

          <Text style={styles.orderTotalItems}>
            {langObj.totalItems}: {getTotalItems(item)}
          </Text>

          <Text style={styles.orderTotalItems}>
            {langObj.totalCost}: {getTotalPrice(item)}
            <Text style={{...FONTS.body4}}> {langObj.nis}</Text>{' '}
          </Text>
        </View>
      </View>

      {scheduledOrder ? (
        <View style={styles.imageContent}>
          <Image
            source={getItemLogoSource(item)}
            resizeMode="contain"
            style={{
              width: 50,
              height: 50,
            }}
          />
          <Text style={styles.dateText}>{order_type[item.order_type]}</Text>
          <Text style={styles.dateText}>{getHourFormat(item)}</Text>
        </View>
      ) : (
        <View>
          {item.time_left === undefined ? (
            <ActivityIndicator
              animating={true}
              size="large"
              color={COLORS.dibbleYellow}
            />
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {/* Circular indicator */}
              <View style={styles.circleTextWrapper}>
                <Text>{Math.ceil(item.time_left_floats)}</Text>
                <Text style={styles.circleInsideText}>{langObj.minutes}</Text>
              </View>
              <View>
                <AnimatedCircularProgress
                  size={60}
                  width={5}
                  fill={(item.time_left_floats / item.total_auction_time) * 100}
                  rotation={360}
                  backgroundWidth={10}
                  tintColor={COLORS.dibbleYellow}
                  backgroundColor={COLORS.UnclickableGray30Percent}
                />
              </View>
            </View>
          )}

          <Text style={styles.circleText}>{langObj.waitForSupplier}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BidedOrders;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.space8,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.space8,
    ...SHADOWS.cardsAndButtons,
  },
  orderCardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderCardTitleContainer: {
    flexDirection: 'column',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    columnGap: SIZES.space4,
    alignItems: 'baseline',
  },
  orderIdTitle: {
    ...FONTS.body2,
  },
  orderIdItems: {
    ...FONTS.body2,
  },
  orderTotalItems: {
    ...FONTS.body3,
    color: COLORS.ParagraphGray,
  },
  circleTextWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  circleText: {
    color: COLORS.ParagraphGray,
    ...FONTS.body3,
  },
  circleInsideText: {
    color: COLORS.ParagraphGray,
    ...FONTS.body4,
  },
  imageContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateText: {
    ...FONTS.body3,
  },
});
