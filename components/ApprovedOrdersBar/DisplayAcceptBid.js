import React, {useState, useMemo} from 'react';
import {
  FlatList,
  Image,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import Product_Item from '../ProductCard/ProductCard';
import {globalStyles} from '../../resource/style/global';
import {
  getItemLogoSource,
  getTotalItems,
  getTotalPrice,
} from '../../resource/SupportFunction';
import {c_orange, bg_incomingOrder} from '../../resource/BaseValue';
import getLanguage from '../../resource/LanguageSupport';
import {COLORS, FONTS, SHADOWS, SIZES} from '../../src/constants/theme';
import CustomButton from '../CustomButton/CustomButton';

let langObj = getLanguage();

const DisplayAcceptBid = React.memo(
  ({item, index, setBidOrderReady, showModalBox}) => {
    const [clicked, setClicked] = useState(false);
    const [showWarning, setShowWarning] = useState(item.forceShowWarning);

    const handlePrepareOrder = () => setShowWarning(false);
    const handleReadyForShipment = () => {
      setClicked(true);
      setBidOrderReady(item.bid_id, setClicked);
    };
    const handleWatchList = () => showModalBox(item, 3);
    const hasIllustratedProduct = item?.products?.some(
      product => product.is_illustrated,
    );

    if (showWarning) {
      return (
        <View style={styles.orderCardContainer}>
          <Text style={globalStyles.textOscarFmRegular_50}>
            {langObj.timeLeftToCollect_1}
          </Text>
          <Text style={[globalStyles.textOscarFmRegular_50, styles.orangeText]}>
            {moment.utc(item.ready_time).local().format('DD.MM.YY, HH:mm')}
          </Text>
          <Text
            style={[globalStyles.textOscarFmRegular_50, styles.marginTop10]}>
            {langObj.timeLeftToCollect_2}
          </Text>
          <TouchableOpacity
            onPress={handlePrepareOrder}
            style={styles.padding10}>
            <Text style={globalStyles.textAlmoniDLAAA_30}>
              {langObj.startPreparingOrder}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.orderCardContainerOption2}>
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

            <View style={styles.columnAlignCenter}>
              <Image
                source={getItemLogoSource(item)}
                resizeMode="contain"
                style={styles.orderCardLogoImageStyle}
              />
              <Text style={styles.orderCardOrderTypeTextStyle}>
                {langObj.order_type[item.order_type]}
              </Text>
            </View>
          </View>
          {item.products && (
            <View>
              <FlatList
                data={item.products}
                renderItem={({item: product, index: productIndex}) => {
                  const isLastItem = productIndex === item.products.length - 1;
                  return (
                    <>
                      <Product_Item item={product} />
                      {!isLastItem && <View style={styles.hr} />}
                    </>
                  );
                }}
                keyExtractor={product => product.product_id + item.order_id}
                style={styles.orderProductListStyle}
                showsVerticalScrollIndicator={false}
              />
              {hasIllustratedProduct ? (
                <View style={styles.isIllustratedContainer}>
                  <View style={styles.isIllustrated}></View>
                  <Text style={{...FONTS.body2}}>{langObj.onlyIllustrate}</Text>
                </View>
              ) : null}
            </View>
          )}
          {item.notes && (
            <View style={styles.orderNotesContainer}>
              <Text style={styles.orderNotesTitle}>{langObj.orderComment}</Text>
              <ScrollView style={styles.notesContainer}>
                <Text style={styles.userNotes}>{item.notes}</Text>
              </ScrollView>
            </View>
          )}
          {clicked ? (
            <ActivityIndicator size="large" color={COLORS.dibbleYellow} />
          ) : (
            <CustomButton
              text={langObj.readyForShipment}
              onPress={handleReadyForShipment}
            />
          )}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleWatchList}>
            <Text style={styles.secondaryBtnText}>{langObj.watchList}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  },
);

const styles = StyleSheet.create({
  orderCardContainer: {
    flexDirection: 'column',
    height: 600,
    borderWidth: 1,
    borderColor: c_orange,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: bg_incomingOrder,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.0,
    elevation: 5,
  },
  orangeText: {
    color: c_orange,
    marginTop: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  padding10: {
    padding: 10,
  },
  orderCardContainerOption2: {
    backgroundColor: COLORS.white,
    padding: SIZES.space8,
    borderRadius: SIZES.radius,
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
  columnAlignCenter: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderCardLogoImageStyle: {
    width: 35,
    height: 35,
  },
  orderCardOrderTypeTextStyle: {
    ...FONTS.body3,
  },
  orderProductListStyle: {
    marginVertical: SIZES.space12,
    backgroundColor: COLORS.white,
    ...SHADOWS.cardsAndButtons,
  },
  orderNotesContainer: {
    paddingBottom: SIZES.space4,
    rowGap: SIZES.space4,
    marginBottom: SIZES.space12,
  },
  orderNotesTitle: {
    ...FONTS.body2,
    ...FONTS.fontBold,
  },
  notesContainer: {
    backgroundColor: COLORS.UnclickableGray30Percent,
    borderRadius: SIZES.radius,
    maxHeight: 100,
  },
  userNotes: {
    ...FONTS.body2,
    padding: SIZES.space8,
    color: COLORS.errorRed,
  },
  secondaryBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.space16,
  },
  secondaryBtnText: {
    ...FONTS.body2,
    ...FONTS.fontBold,
    textDecorationLine: 'underline',
  },
  hr: {
    height: 1,
    backgroundColor: COLORS.UnclickableGray30Percent,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.space12,
  },
  isIllustratedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SIZES.space4,
    paddingBottom: SIZES.space12,
  },
  isIllustrated: {
    width: 10,
    height: 10,
    borderRadius: 400,
    backgroundColor: COLORS.errorRed,
  },
});

export default DisplayAcceptBid;
