import React from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import getLanguage from '../../resource/LanguageSupport';
import {perfectSize} from '../DibbleHeader/style';
 import {globalStyles} from '../../resource/style/global';
 
import {
  modal_select_product,
  greyHasOpacity,
  c_loading_icon,
} from '../../resource/BaseValue';
import {SubmitBidHeader} from '../../screens/submitBidHeader';
import {renderProduct} from '../../screens/ScreenPickup';
import {
  get_order_products_diff,
  merge_amount_update,
  merge_amount_update_with_bid,
  callPlaceBid,
} from '../../resource/SupportFunction';
let langObj = getLanguage();

export default function screenOrderChange({orderObject, ...props}) {
  let [indicatorSizeW, setIndicatorSizeW] = React.useState(0);
  let [indicatorDisplay, setIndicatorDisplay] = React.useState(false);
  let [indicatorSizeH, setIndicatorSizeH] = React.useState(0);
  let [endReachedAdded, setEndReachedAdded] = React.useState(false);
  let [endReachedRemoved, setEndReachedRemoved] = React.useState(false);

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);

  const closeModalBox = () => {
    setIndicatorSizeH(0);
    setIndicatorSizeW(0);
    setIndicatorDisplay(false);
  };
  const showModalBox = () => {
    setIndicatorSizeH(screenHeight);
    setIndicatorSizeW(screenWidth);
    setIndicatorDisplay(true);
  };

  let [frame, setFrame] = React.useState(0);
  let backButtonFunctionality = () => setFrame(frame - 1);
  let [added_products, amount_change_products, removed_products] =
    get_order_products_diff(orderObject);
  let number_of_changes =
    added_products.length +
    amount_change_products.length +
    removed_products.length;
  console.log('added', added_products);

  React.useEffect(() => {
    if (removed_products.length == 0) {
      setEndReachedRemoved(true);
    }
    if (added_products.length + amount_change_products.length == 0) {
      setEndReachedAdded(true);
    }
  }, []);
  return (
    <View
      style={[
        mStyle.mainContainer,
        frame == 1 && {height: perfectSize(1179.8), width: perfectSize(1713)},
      ]}>
      {frame == 0 ? (
        <View style={mStyle.generalContainer}>
          <Image
            source={require('../../image/megaphone/group1918.png')}
            style={mStyle.megaPhone}
          />

          <Text style={mStyle.changeTitle}>
            {langObj.changesInOrder + ' ' + props.order_id}
          </Text>
          <View style={mStyle.yellowBar}></View>
          <TouchableOpacity onPress={() => setFrame(1)} style={mStyle.btnView}>
            <Text style={mStyle.btnFont}>{langObj.watchChanges}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1, width: '100%'}}>
          <SubmitBidHeader
            orderItem={orderObject}
            number_of_changes={number_of_changes}
            show_total={false}
            displayClose={false}
            displayBack={false}
            backButtonFunctionality={backButtonFunctionality}
            orderItem={{order_id: props.order_id, products: []}}
            callCloseSelf={() => {}}
          />

          {/* Content */}
          <View
            style={{
              width: perfectSize(1400),
              alignItems: 'center',
              justifyContent: 'center',
              marginStart: 'auto',
              marginEnd: 'auto',
            }}>
            <View style={{flexDirection: 'row'}}>
              {amount_change_products.length + added_products.length ? (
                <View style={{height: perfectSize(600, true)}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../image/cart/group1895.png')}
                      style={mStyle.cart_icon}
                    />
                    <Text style={mStyle.addedLabel}>
                      {langObj.added_products}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                    <FlatList
                      onEndReached={() => setEndReachedAdded(true)}
                      onEndReachedThreshold={0.2}
                      onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                        }
                      }}
                      data={[...added_products, ...amount_change_products]}
                      renderItem={renderProduct(
                        removed_products.length ? perfectSize(800) : 0,
                        true,
                      )}
                       keyExtractor={(item) => item.product_id + item.option}
 
                    />
                    {!endReachedAdded ? (
                      <Text
                        style={{
                          color: 'red',
                          fontFamily: 'AlmoniDLAAA',
                          fontSize: perfectSize(35),
                        }}>
                        {langObj.scrollToEnd}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}

              {removed_products.length ? (
                <View style={{height: perfectSize(600)}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../image/uncart/group1943.png')}
                      style={mStyle.cart_icon}
                    />
                    <Text style={mStyle.addedLabel}>
                      {langObj.removed_products}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                    <FlatList
                      onEndReached={() => setEndReachedRemoved(true)}
                      onEndReachedThreshold={0.2}
                      data={removed_products.map((p) => {
                        return {...p, removed: true};
                      })}
                      renderItem={renderProduct(
                        amount_change_products.length + added_products.length
                          ? perfectSize(800)
                          : 0,
                        true,
                      )}
                       keyExtractor={(item) => item.product_id + item.option}
 
                    />
                    {!endReachedRemoved ? (
                      <Text
                        style={{
                          color: 'red',
                          fontFamily: 'AlmoniDLAAA',
                          fontSize: perfectSize(35),
                        }}>
                        {langObj.scrollToEnd}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
 
            <TouchableOpacity
              disabled={!(endReachedAdded && endReachedRemoved)}
              onPress={() => {
                if (orderObject.bidded_products.length > 0) {
                  callPlaceBid(
                    merge_amount_update_with_bid(
                      orderObject.products,
                      [...amount_change_products].map((p) => {
                        return {...p, isSelected: true};
                      }),
                      orderObject.bidded_products,
                      added_products,
                    ),
                    orderObject,
                    props.closeModal,
                    showModalBox,
                    closeModalBox,
                  );
                } else {
                  callPlaceBid(
                    orderObject.products,
                    orderObject,
                    props.closeModal,
                    showModalBox,
                    closeModalBox,
                  );
                }
              }}
              style={[
                mStyle.approve_change,
                {opacity: !(endReachedAdded && endReachedRemoved) ? 0.4 : 1},
              ]}>
              <Text style={mStyle.btnFont}>{langObj.approveChange}</Text>
            </TouchableOpacity>

            {amount_change_products.length + added_products.length ? (
              <TouchableOpacity
                disabled={!(endReachedAdded && endReachedRemoved)}
                onPress={() =>
                  props.showModalBox(
                    {
                      ...orderObject,
                      new_order_products: orderObject.products,
                      products: [...added_products, ...amount_change_products],
                      new_bid: true,
                      added_products: added_products,
                      removed_products: removed_products,
                    },
                    modal_select_product,
                  )
                }
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: perfectSize(27),
                  opacity: !(endReachedAdded && endReachedRemoved) ? 0.4 : 1,
                }}>
                <Text style={globalStyles.lackOfProductBtn}>
                  {langObj.lackOfProduct}
                </Text>
              </TouchableOpacity>
            ) : null}
            {/* { (amount_change_products.length+added_products.length)?
     <TouchableOpacity
     disabled={!(endReachedAdded&&endReachedRemoved)}
     onPress={()=>{
       
       if(orderObject.bidded_products.length>0){
                                         callPlaceBid(merge_amount_update_with_bid(orderObject.products,[...amount_change_products].map(p=>{return {...p,isSelected:false}}),orderObject.bidded_products,[added_products]),orderObject,props.closeModal,showModalBox,closeModalBox)}
                                       else{
                                         callPlaceBid(orderObject.products,orderObject,props.closeModal,showModalBox,closeModalBox)}}
 
 }     style={{alignItems:'center',justifyContent:'center',marginTop:perfectSize(27),opacity:!(endReachedAdded&&endReachedRemoved)?0.4:1}}
      >
  <Text style={mStyle.lackOfProductBtn}>
{langObj.lackOfAll}

 

            <TouchableOpacity
              disabled={!(endReachedAdded && endReachedRemoved)}
              onPress={() => {
                if (orderObject.bidded_products.length > 0) {
                  callPlaceBid(
                    merge_amount_update_with_bid(
                      orderObject.products,
                      [...amount_change_products].map((p) => {
                        return {...p, isSelected: true};
                      }),
                      orderObject.bidded_products,
                      added_products,
                    ),
                    orderObject,
                    props.closeModal,
                    showModalBox,
                    closeModalBox,
                  );
                } else {
                  callPlaceBid(
                    orderObject.products,
                    orderObject,
                    props.closeModal,
                    showModalBox,
                    closeModalBox,
                  );
                }
              }}
              style={[
                mStyle.approve_change,
                {opacity: !(endReachedAdded && endReachedRemoved) ? 0.4 : 1},
              ]}>
              <Text style={mStyle.btnFont}>{langObj.approveChange}</Text>
            </TouchableOpacity>

     </TouchableOpacity>:null} */}
         
          </View>
        </View>
      )}

      <View
        style={{
          width: indicatorSizeW,
          height: indicatorSizeH,
          backgroundColor: greyHasOpacity,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
        }}>
        <ActivityIndicator
          animating={indicatorDisplay}
          size="large"
          color={c_loading_icon}
        />
      </View>
    </View>
  );
}

const mStyle = StyleSheet.create({
  approve_change: {
    marginTop: perfectSize(64),
    alignItems: 'center',
    justifyContent: 'center',
    width: perfectSize(1050),
    height: perfectSize(110),
    borderRadius: perfectSize(14),
    backgroundColor: '#000000',
  },
  megaPhone: {
    width: perfectSize(110.5),
    height: perfectSize(105.5),
  },
  btnView: {
    width: perfectSize(710),
    height: perfectSize(110),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: perfectSize(35),
    borderRadius: perfectSize(14),
    backgroundColor: '#000000',
  },
  btnFont: {
    fontFamily: 'OscarFM-Regular',
    fontSize: perfectSize(63),
    letterSpacing: perfectSize(-1.26),
    textAlign: 'center',
    color: '#ffffff',
  },
  yellowBar: {
    width: perfectSize(694),
    height: perfectSize(10),
    marginTop: perfectSize(10.8),
    backgroundColor: '#ffca1a',
  },
  changeTitle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(71),
    fontWeight: 'normal',
    marginTop: perfectSize(21),
    fontStyle: 'normal',
    letterSpacing: perfectSize(-2.13),
    color: '#46474b',
  },
  generalContainer: {alignItems: 'center', justifyContent: 'center'},
  mainContainer: {
    width: perfectSize(1375.5),
    height: perfectSize(820),
    backgroundColor: '#fcfcfc',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderRadius: perfectSize(30),
    shadowRadius: perfectSize(20),
    shadowOpacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedLabel: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(50),
    fontWeight: 'normal',
    fontStyle: 'normal',
    lineHeight: 42,
    letterSpacing: -1.05,
    textAlign: 'right',
    color: '#000000',
  },
  cart_icon: {
    width: perfectSize(50.6),
    height: perfectSize(38.6),
  },
 
  lackOfProductBtn: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: perfectSize(60),

    letterSpacing: -3,
    textAlign: 'center',
    color: '#ff0000',
  },
 });
