import React, {useRef} from 'react';
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import pure from 'recompose/pure';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {globalStyles} from '../../resource/style/global';
import {sendInvoice} from '../../components/HistoryServices/HistoryServices';
import Heshbo from '../ScreenOrderHistory/exportHesbo';
import moment from 'moment';
import {thousandsFilter} from '../../resource/SupportFunction';

import {status, order_type} from '../../resource/BaseValue';
let langObj = getLanguage();
const perfectSize = getPerfectSize();
const marginEndInner = perfectSize(400);
import Down from './Down';

const col_1_width = 440;
const col_2_width = 490;

function CollapsibleOrderCard(props) {
  console.log('collaps props', props);
  const start_date = moment(
    '01.' + String(props.inv.month) + '.' + String(props.inv.year),
    'DD.MM.YYYY',
  );
  const end_date = moment(
    '01.' + String(props.inv.month) + '.' + String(props.inv.year),
    'DD.MM.YYYY',
  ).endOf('month');

  let total_orders = props.inv.weeks.reduce(
    (s, b) => s + parseFloat(b.order_cnt),
    0,
  );
  let total_month = props.inv.weeks.reduce(
    (s, b) => s + parseFloat(b.order_sum),
    0,
  );
  const [loading, setLoading] = React.useState(false);
  const [cHeight, setHeight] = React.useState(0);
  const [isCollapsed, setCollapsed] = React.useState(true);
  const flipAnim = useRef(new Animated.Value(3.14)).current;
  const flip = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(flipAnim, {
      toValue: isCollapsed ? 0 : 3.14,
      duration: 500,
    }).start();
  };

  // alert(JSON.stringify(props.info.VAT))
  //console.count('collapsible order card')
  return (
    <View style={{marginTop: perfectSize(29)}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            flip();
            setCollapsed(c => !c);
          }}>
          <View
            style={{
              zIndex: 1,
              alignSelf: 'flex-start',
              borderRadius: perfectSize(20),
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: '#f1f1f3',
            }}>
            <View
              style={{
                width: perfectSize(1618),
                height: perfectSize(100),
                borderRadius: perfectSize(20),
                backgroundColor: '#ffca1a',
                borderStyle: 'solid',
                borderWidth: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingStart: perfectSize(52),
                alignItems: 'center',
                borderColor: '#f1f1f3',
              }}>
              <Text style={[globalStyles.textOscarFmRegular_50]}>
                {props.dateString}
              </Text>
              <Text
                style={[
                  globalStyles.textOscarFmRegular_50,
                  {marginEnd: perfectSize(20), marginStart: 'auto'},
                ]}>
                {thousandsFilter(total_month)} {langObj.priceUnit}
              </Text>
              <Animated.View
                style={
                  {
                    // transform: [{rotate: flipAnim}],
                  }
                }>
                <Down></Down>
              </Animated.View>
            </View>
            {/* ORDER CONTENT */}
            <View
              style={{
                flexDirection: 'column',
                width: perfectSize(1618),
                backgroundColor: '#ffffff',
                borderStyle: 'solid',
                borderWidth: 1,
                padding: isCollapsed ? 0 : perfectSize(75),
                paddingTop: 0,
                borderColor: '#f1f1f3',
                overflow: 'hidden',
                height: isCollapsed ? 0 : 'auto',
              }}>
              <View
                style={[
                  {
                    marginTop: 0,
                    marginEnd: perfectSize(400),
                    marginBottom: perfectSize(58.5),
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                  }}>
                  <View style={{width: perfectSize(col_1_width)}}>
                    {props.inv.weeks.map((week, index) => (
                      <View
                        style={{
                          height: perfectSize(70),
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_BOLD_42,
                            {color: '#46474b', opacity: 0.7},
                          ]}>
                          שבוע {index + 1} |{' '}
                          {moment(week.week_start).format('DD')}-
                          {moment(week.week_end).format('DD.MM.YYYY')}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={{width: perfectSize(col_2_width)}}>
                    {props.inv.weeks.map((week, index) => (
                      <View
                        style={{
                          height: perfectSize(70),
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_42,
                            {color: '#46474b', opacity: 1},
                          ]}>
                          {week.order_cnt} {langObj.packages}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View>
                    {props.inv.weeks.map((week, index) => (
                      <View
                        style={{
                          height: perfectSize(70),
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          style={[
                            globalStyles.textAlmoniDLAAA_42,
                            {opacity: 0.22, paddingTop: perfectSize(28)},
                          ]}>
                          {thousandsFilter(week.order_sum)} {langObj.nis}{' '}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: perfectSize(2),
                  marginBottom: perfectSize(34),
                  backgroundColor: '#707070',
                }}></View>

              <View style={{}}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_40,
                      {
                        opacity: 0.7,
                        width: perfectSize(col_1_width),
                        opacity: 0.7,
                      },
                    ]}>
                    {langObj.total}
                  </Text>

                  <Text
                    style={[
                      globalStyles.textAlmoniDLAAA_42,
                      {
                        width: perfectSize(col_2_width),
                        color: '#46474b',
                        opacity: 1,
                      },
                    ]}>
                    {total_orders} {langObj.packages}
                  </Text>

                  <Text style={[globalStyles.textAlmoniDLAAA_60, {}]}>
                    {thousandsFilter(total_month)} {langObj.nis}
                  </Text>
                </View>
              </View>

              {loading ? (
                <ActivityIndicator
                  style={{
                    alignSelf: 'flex-end',
                    bottom: 0,
                    right: perfectSize(70),
                    position: 'absolute',
                  }}
                  size="large"></ActivityIndicator>
              ) : (
                <View
                  style={{
                    alignSelf: 'flex-end',
                    bottom: 0,
                    position: 'absolute',
                  }}>
                  <TouchableOpacity
                    style={{
                      padding: perfectSize(20),
                      marginTop: perfectSize(30),
                      alignSelf: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setLoading(true);
                      sendInvoice(
                        start_date.format(),
                        end_date.format(),
                        success => {
                          setLoading(false);
                          if (success) {
                            props.setAnimationType(1);
                            props.setPlayAnimation(true);
                          } else {
                            props.setAnimationType(0);
                            props.setPlayAnimation(true);
                          }
                        },
                      );
                    }}>
                    <Text
                      style={{
                        fontFamily: 'AlmoniDLAAA',
                        fontSize: perfectSize(36),

                        textDecorationLine: 'underline',
                        letterSpacing: perfectSize(-1.5),
                        color: 'black',
                      }}>
                      {langObj.export_hesbo}
                    </Text>
                    <Heshbo></Heshbo>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default pure(CollapsibleOrderCard);
