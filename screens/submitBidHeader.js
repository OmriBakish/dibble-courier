import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {globalStyles} from '../resource/style/global';
import {c_text_grey, order_type} from '../resource/BaseValue';
import getLanguage, {getPerfectSize} from '../resource/LanguageSupport';
import pure from 'recompose/pure';
import {
  getItemLogoSource,
  getHourFormat,
  getTotalItems,
} from '../resource/SupportFunction';
let langObj = getLanguage();
let perfectSize = getPerfectSize();

function BackButton(backButtonFunctionality, displayBack) {
  return (
    <TouchableOpacity
      onPress={backButtonFunctionality}
      style={{
        display: displayBack ? 'flex' : 'none',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: perfectSize(10),
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: perfectSize(100),
          width: perfectSize(100),
        }}>
        <Image
          source={require('../image/icon_arrow_grey_right.png')}
          resizeMode="contain"
          style={{
            width: perfectSize(55),
            height: perfectSize(55),
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

export function SubmitBidHeader({
  callCloseSelf,
  show_total,
  show_close,
  backButtonFunctionality,
  orderItem,
  displayBack,
  price,
  calculate_total_items,
  number_of_changes,
   ...props
 
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 25,
        paddingBottom: 13,
      }}>
      {displayBack ? BackButton(backButtonFunctionality, displayBack) : null}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute',
          alignSelf: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_71,
              {
                color: c_text_grey,
                letterSpacing: -2.13 / 2,
                marginEnd: 5,
              },
            ]}>
            {langObj.orderID}
          </Text>
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_Bold_71,
              {
                color: c_text_grey,
                letterSpacing: -2.13 / 2,
                paddingBottom: 7,
              },
            ]}>
            {orderItem.order_id}{' '}
          </Text>
        </View>

        {show_total ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {
                  color: 'rgb(70,71,75)',
                  letterSpacing: -1.68 / 2,
                  marginEnd: 5,
                },
              ]}>
              {langObj.totalItems}:
            </Text>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {
                  color: 'rgb(70,71,75)',
                  letterSpacing: -1.68 / 2,
                  paddingBottom: 3,
                },
              ]}>
              {calculate_total_items
                ? calculate_total_items(orderItem)
                : getTotalItems(orderItem) + ' '}
            </Text>
          </View>
        ) : null}
        {number_of_changes ? (
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {
                  color: 'rgb(70,71,75)',
                  letterSpacing: -1.68 / 2,
                  paddingBottom: 3,
                },
              ]}>
              {langObj.total}
            </Text>

            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {color: 'red', marginStart: perfectSize(10)},
              ]}>
              {number_of_changes}
            </Text>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {marginStart: perfectSize(10)},
              ]}>
              {langObj.changes_in_order}
            </Text>
          </View>
        ) : null}
        {price ? (
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_40,
              {
                letterSpacing: perfectSize(-1.68),
                color: '#46474b',
                fontSize: perfectSize(42),
              },
            ]}>
            {langObj.totalCost}: {price} {langObj.nis}
          </Text>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginStart: perfectSize(1000),
        }}>
        <View
          style={{
            width: perfectSize(85),
            height: perfectSize(85),
            flexDirection: 'column',
          }}>
          <Image
            source={getItemLogoSource(orderItem)}
            resizeMode="contain"
            style={{
              width: perfectSize(85),
              height: perfectSize(85),
            }}
          />
        </View>

        <Text
          style={[
            globalStyles.textAlmoniDLAAA_30,
            {
              letterSpacing: -1.41 / 2,
            },
          ]}>
          {order_type[orderItem.order_type]}
        </Text>
        <Text
          style={[
            globalStyles.textAlmoniDLAAA_40,
            {
              letterSpacing: -1.41 / 2,
            },
          ]}>
          {getHourFormat(orderItem)}
          {/* {orderItem.order_type == 1
                       ? langObj.delivery
                       : langObj.pickup} */}
        </Text>
      </View>

      {show_close ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: perfectSize(10),
            flexDirection: 'column',
            alignItems: 'center',
            top: perfectSize(30),
          }}
          onPress={() => {
            callCloseSelf('');
          }}>
          <View
            style={{
              height: perfectSize(100),
              width: perfectSize(100),
            }}>
            <Image
              source={require('../image/quantity_icon.png')}
              resizeMode="contain"
              style={{
                width: perfectSize(40),
                height: perfectSize(40),
              }}
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
SubmitBidHeader.defaultProps = {
  displayBack: true,
};
export default pure(SubmitBidHeader);
