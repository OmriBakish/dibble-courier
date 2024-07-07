import {StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../src/constants/theme';

export const ProductCardStyle = StyleSheet.create({
  productCardContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    minWidth: '100%',
    minHeight: 80,
    height: 'auto',
    paddingVertical: SIZES.space12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productCardQuantityTextStyle: {
    ...FONTS.body3,
    verticalAlign: 'bottom',
    color: COLORS.ParagraphGray,
  },
  quantityItemsText: {
    ...FONTS.body3,
  },
  productImageStyle: {
    width: 60,
    height: 60,
    marginHorizontal: SIZES.space4,
  },
  productCardQuantityTextContainerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  productCardNameAndOptionContainer: {
    justifyContent: 'center',
    paddingHorizontal: SIZES.space8,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.space8,
  },
  productCardProductNameTextStyle: {
    ...FONTS.body2,
    ...FONTS.fontBold,
  },
  productCardProductOptionTextStyle: {
    ...FONTS.body3,
    color: COLORS.ParagraphGray,
  },
  vr: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.UnclickableGray30Percent,
    borderRadius: SIZES.radius,
  },
  isIllustrated: {
    width: 10,
    height: 10,
    borderRadius: 400,
    backgroundColor: COLORS.errorRed,
  },
});
