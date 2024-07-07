import React from 'react';
import {View, Image, Text, ScrollView, TouchableOpacity} from 'react-native';
// import globalSass from '../../resource/style/globalSass.scss';
import pure from 'recompose/pure';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {globalStyles} from '../../resource/style/global';
import moment from 'moment';
import {status, order_type} from '../../resource/BaseValue';
import {thousandsFilter, getProductName} from '../../resource/SupportFunction';
import {getOptionsArray} from '../../resource/dibbleCommon';
let langObj = getLanguage();
const perfectSize = getPerfectSize();
function CollapsibleOrderCard(props) {
  let total_price_with_vat =
    (props.info.VAT / 100) *
    (props.item.total_price + props.item.total_price).toFixed(2);
  let total_price = props.item.total_price.toFixed(2);
  const [cHeight, setHeight] = React.useState(0);
  const [isCollapsed, setCollapsed] = React.useState(true);
  const maxImageWidth = perfectSize(60);
  // alert(JSON.stringify(props.info.VAT))
  //console.count('collapsible order card')
  return (
    <View style={{marginStart: perfectSize(211), margin: perfectSize(29)}}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCollapsed(c => !c)}>
          <View
            style={{
              zIndex: 0,
              paddingStart: perfectSize(71),
              paddingTop: perfectSize(56),
              paddingEnd: perfectSize(71),
              alignSelf: 'flex-start',
              width: perfectSize(1206),
              height: 'auto',
              borderRadius: perfectSize(20),
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#f1f1f3',
              paddingBottom: perfectSize(55),
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_71,
                      {letterSpacing: perfectSize(-3.5)},
                    ]}>
                    {langObj.order_id}{' '}
                  </Text>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_Bold_71,
                      {letterSpacing: perfectSize(-3.5)},
                    ]}>
                    {props.item.order_id}{' '}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(42),
                    lineHeight: perfectSize(70),
                    letterSpacing: perfectSize(-1.68),
                    color: '#46474b',
                    textAlign: 'left',
                    // }}>{JSON.stringify(props.item)} </Text>
                  }}>
                  {langObj.total_products}
                  {props.item.products.length}
                </Text>
                {/* <Text style={{  
   fontFamily: "AlmoniDLAAA",
  fontSize: perfectSize(42),
    lineHeight:perfectSize(70),
  letterSpacing: perfectSize(-1.68),
   color: "#46474b",
   textAlign:'left'
 }}>{JSON.stringify(props.item)} </Text>
  */}
              </View>

              <View
                style={{
                  marginStart: perfectSize(34),
                  padding: perfectSize(10),
                  height: perfectSize(70),
                  backgroundColor: 'rgba(0,184,217,0.07)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(40),
                    color: 'rgba(0,184,217,1)',
                    opacity: 1,
                    letterSpacing: perfectSize(-1.4),
                  }}>
                  {props.item.order_type == 3 && props.item.status == 3
                    ? langObj.scheduled
                    : props.statuses[props.item.status]}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  marginStart: 'auto',
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontFamily: 'AlmoniDLAAA',
                    fontWeight: 'normal',
                    fontSize: perfectSize(42),
                    fontStyle: 'normal',
                    lineHeight: perfectSize(70),
                    letterSpacing: perfectSize(-1.68),
                    textAlign: 'left',
                    color: '#46474b',
                  }}>
                  {moment
                    .utc(props.item.placed_on)
                    .local()
                    .format('DD.MM.YY, HH:mm')}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginStart: 'auto',
                    alignItems: 'center',
                    marginTop: perfectSize(21),
                  }}>
                  <Text
                    style={{
                      fontFamily: 'AlmoniDLAAA',
                      fontWeight: 'normal',
                      fontSize: perfectSize(42),
                      fontStyle: 'normal',
                      lineHeight: perfectSize(70),
                      letterSpacing: perfectSize(-1.68),
                      textAlign: 'left',
                      color: '#46474b',
                    }}>
                    {langObj.details}
                  </Text>
                  <Image
                    source={
                      isCollapsed
                        ? require('../../image/downArrow.png')
                        : require('../../image/up_arrow.png')
                    }
                    style={{
                      width: perfectSize(32.6),
                      height: perfectSize(21.2),
                      marginStart: perfectSize(12.1),
                    }}></Image>
                </View>
              </View>
            </View>

            {/* ORDER CONTENT */}
            <View
              style={{
                flexDirection: 'column',
                height: isCollapsed ? 0 : 'auto',
                minHeight: isCollapsed ? 0 : perfectSize(450),
              }}>
              <Text
                style={{
                  textAlign: 'left',
                  marginTop: perfectSize(22),
                  fontFamily: 'AlmoniDLAAA',
                  fontSize: perfectSize(42),
                  fontWeight: 'bold',
                  letterSpacing: -1.68,
                  color: '#46474b',
                }}>
                {langObj.orderElab}
              </Text>
              <View style={{marginTop: perfectSize(17), flexDirection: 'row'}}>
                <View
                  style={{flexDirection: 'column', marginTop: perfectSize(23)}}>
                  {props.item.products.map((product, index) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        width: '100%',
                      }}>
                      <Text
                        style={[
                          globalStyles.textAlmoniDLAAA_40,
                          {
                            lineHeight: perfectSize(60),
                            width: perfectSize(60),
                            letterSpacing: perfectSize(-1.68),
                            color: '#46474b',
                          },
                        ]}>
                        {index + 1}.
                      </Text>

                      <View>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_50,
                            {
                              lineHeight: perfectSize(60),
                              paddingEnd: perfectSize(10),
                              width: perfectSize(700),
                              letterSpacing: perfectSize(-1.68),
                              color: '#46474b',
                            },
                          ]}>
                          {getProductName(product)}
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          {getOptionsArray(product).map((option, index) => (
                            <Text
                              style={[
                                // globalSass.AlmoniDLAAA_20,
                                // globalSass.animatedBg,
                                {marginStart: index > 0 ? perfectSize(20) : 0},
                              ]}>
                              <Text
                              // style={globalSass['AlmoniDLAAA-Bold_20']}
                              >
                                {' '}
                                {option.name}
                              </Text>
                              : {option.value}
                            </Text>
                          ))}
                        </View>
                      </View>
                      <Text
                        style={[
                          globalStyles.textAlmoniDLAAA_40,
                          {
                            lineHeight: perfectSize(60),
                            marginEnd: 'auto',
                            letterSpacing: perfectSize(-2.4),
                            color: '#d1d2d4',
                          },
                        ]}>
                        {product.amount}x
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'flex-end',
                          marginStart: 'auto',
                        }}>
                        <Text
                          style={[
                            globalStyles.textOscarFmRegular_40,
                            {
                              lineHeight: perfectSize(60),
                              marginStart: perfectSize(34),
                              fontSize: perfectSize(37),
                              color: '#8c8d8f',
                            },
                          ]}>
                          ₪{thousandsFilter(product.price)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={{marginTop: perfectSize(38), flexDirection: 'column'}}>
                {/*    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={{paddingEnd:40}}>
                            <Text style={[globalStyles.textOscarFmRegular_40,{fontSize:perfectSize(34)}]}>{langObj.orderSum}</Text>
                        </View>
                        <View style={{flex:1}}/>
                        <Text style={[globalStyles.textOscarFmRegular_40,{fontSize:perfectSize(34)}]}>{total_price} {langObj.priceUnit}</Text>
                    </View>
                    
                    {/* <View style={{flexDirection:'row', alignItems:'center',marginTop:perfectSize(9) }}>
                        <Text style={[globalStyles.textOscarFmRegular_40,{fontSize:perfectSize(34),color:"#8c8d8f"}]}>{langObj.Maam}</Text>
                        <View style={{flex:1}}/>
                        <Text style={[globalStyles.textOscarFmRegular_40,{fontSize:perfectSize(34),color:"#8c8d8f"}]}>{ (props.info.VAT/100*props.item.total_price).toFixed(2) } {langObj.priceUnit}</Text>
                    </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: perfectSize(56),
                  }}>
                  <Text
                    style={[
                      globalStyles.textOscarFmRegular_40,
                      {fontSize: perfectSize(52)},
                    ]}>
                    {langObj.total}
                  </Text>
                  <View
                    style={{flex: 1, marginStart: 'auto', marginEnd: 'auto'}}
                  />
                  <Text
                    style={[
                      globalStyles.textOscarFmRegular_50,
                      {fontSize: perfectSize(52)},
                    ]}>
                    {thousandsFilter(total_price)} {langObj.priceUnit}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              marginStart: perfectSize(24),
              width: perfectSize(444),
              height: perfectSize(275),
              borderRadius: perfectSize(20),
              backgroundColor: '#ffffff',
              borderStyle: 'solid',
              borderWidth: perfectSize(1),
              borderColor: '#f1f1f3',
              paddingStart: perfectSize(41),
              paddingTop: perfectSize(56),
              flexDirection: 'column',
            }}>
            <Text
              style={[
                globalStyles.textAlmoniDLAAA_40,
                {letterSpacing: perfectSize(-1.68)},
              ]}>
              {langObj.dealTotal}
            </Text>
            <Text
              style={[
                globalStyles.textOscarFmRegular_70,
                {letterSpacing: perfectSize(-1.5), marginTop: perfectSize(17)},
              ]}>
              {thousandsFilter(total_price)} {langObj.priceUnit}
            </Text>
          </View>

          <View
            style={{
              marginStart: perfectSize(24),
              width: perfectSize(444),
              height: perfectSize(440),
              display: isCollapsed ? 'none' : 'flex',
              borderRadius: perfectSize(20),
              backgroundColor: '#ffffff',
              marginTop: 'auto',
              borderStyle: 'solid',
              borderWidth: perfectSize(1),
              borderColor: '#f1f1f3',
              paddingStart: perfectSize(41),
              paddingTop: perfectSize(56),
              flexDirection: 'column',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: maxImageWidth}}>
                <Image
                  source={require('../../image/delivery_time.png')}
                  style={{width: perfectSize(42.6), height: perfectSize(50.2)}}
                />
              </View>

              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginStart: perfectSize(28.3),
                }}>
                <Text
                  style={{
                    opacity: 1,
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(30),
                    fontWeight: 'bold',
                    letterSpacing: perfectSize(-1.5),
                    color: '#858586',
                  }}>
                  מועד הזמנה
                </Text>
                <Text
                  style={{
                    opacity: 1,
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(30),
                    fontStyle: 'normal',
                    letterSpacing: perfectSize(-1.5),
                    color: '#858586',
                  }}>
                  {moment
                    .utc(props.item.placed_on)
                    .local()
                    .format('DD.MM.YY, HH:mm')}{' '}
                </Text>
              </View>
            </View>

            <View style={{marginTop: perfectSize(26.1), flexDirection: 'row'}}>
              <View style={{width: maxImageWidth}}>
                <Image
                  source={require('../../image/delivery_type.png')}
                  style={{width: perfectSize(60.6), height: perfectSize(42.2)}}
                />
              </View>

              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  marginStart: perfectSize(28.3),
                }}>
                <Text
                  style={{
                    opacity: 1,
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(30),
                    fontWeight: 'bold',
                    letterSpacing: perfectSize(-1.5),
                    color: '#858586',
                  }}>
                  סוג המשלוח
                </Text>
                <Text
                  style={{
                    opacity: 1,
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(30),
                    fontStyle: 'normal',
                    letterSpacing: perfectSize(-1.5),
                    color: '#858586',
                  }}>
                  {order_type[props.item.order_type]}{' '}
                </Text>
              </View>
            </View>

            <View style={{marginTop: perfectSize(26.1), flexDirection: 'row'}}>
              <View style={{width: maxImageWidth}}>
                <Image
                  source={require('../../image/order_comments.png')}
                  style={{width: perfectSize(42.6), height: perfectSize(42.2)}}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',

                  marginStart: perfectSize(28.3),
                }}>
                <Text
                  style={{
                    opacity: 1,
                    fontFamily: 'AlmoniDLAAA',
                    fontSize: perfectSize(30),
                    fontWeight: 'bold',
                    letterSpacing: perfectSize(-1.5),
                    color: '#858586',
                  }}>
                  {langObj.orderCommentLabel}
                </Text>
                <ScrollView style={{maxHeight: perfectSize(150)}}>
                  <View style={{flexDirection: 'row', width: perfectSize(300)}}>
                    <Text
                      style={{
                        opacity: 1,
                        flexWrap: 'wrap',
                        flex: 1,
                        padding: perfectSize(2),
                        fontFamily: 'AlmoniDLAAA',
                        fontSize: perfectSize(30),
                        textAlign: 'left',
                        letterSpacing: perfectSize(-1.5),
                        color: '#858586',
                      }}>
                      {props.item.notes
                        ? props.item.notes.replaceAll('\n', '')
                        : 'אין הערות'}{' '}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* 
<View style={{marginTop:perfectSize(26.1),flexDirection:'row' }}>
<Image
source={require('../../image/export_hesbo/group1923.png')}
style={{width:perfectSize(42.6),height:perfectSize(42.2)}}
/>

<Text style={{marginStart:perfectSize(18),  fontFamily: "AlmoniDLAAA-Bold",
  fontSize: perfectSize(30),borderBottomColor:"black",borderBottomWidth:1,textDecorationLine: 'underline',
 
  letterSpacing: perfectSize(-0.9),
  
  color: "#ffca1a"}}>
  {langObj.export_hesbo}
</Text>

</View> */}
          </View>
        </View>
      </View>
    </View>
  );
}
export default pure(CollapsibleOrderCard);
