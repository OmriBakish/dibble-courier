import ProgressImage from 'react-native-image-progress';
import {ProgressBar} from 'react-native-progress/Bar';
import {Text, View} from 'react-native';
import {ProductCardStyle} from './style';
import {getOptionsArray} from '../../resource/dibbleCommon';
import {COLORS} from '../../src/constants/theme';

function ProductCard({item}) {
  return (
    <View style={[ProductCardStyle.productCardContainer]}>
      <View style={[ProductCardStyle.itemContainer]}>
        <View style={[ProductCardStyle.titleContainer]}>
          {item?.is_illustrated ? (
            <View style={ProductCardStyle.isIllustrated}></View>
          ) : null}
          <ProgressImage
            source={{uri: item.product_image}}
            resizeMode="cover"
            indicator={ProgressBar}
            indicatorProps={{
              color: COLORS.dibbleYellow,
            }}
            style={ProductCardStyle.productImageStyle}
          />
        </View>
        <View style={ProductCardStyle.vr} />
      </View>

      <View style={[ProductCardStyle.productCardNameAndOptionContainer]}>
        <Text
          style={[ProductCardStyle.productCardProductNameTextStyle]}
          numberOfLines={2}>
          {item.product_name}
        </Text>

        {getOptionsArray(item).map(option => (
          <Text style={[ProductCardStyle.productCardProductOptionTextStyle]}>
            {option.name}: {option.value}
          </Text>
        ))}
        <Text style={[ProductCardStyle.productCardQuantityTextStyle]}>
          כמות:
          <Text style={[ProductCardStyle.quantityItemsText]}>
            {item.max_amount ? item.max_amount : item.amount}
          </Text>
        </Text>
      </View>
    </View>
  );
}
export default ProductCard;
