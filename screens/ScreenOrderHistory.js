import React, {useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import LottieView from 'lottie-react-native';

import Heshbo from './exportHesbo';
import DibbleHeader from '../../components/DibbleHeader/DibbleHeader';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import CollapsibleSelection from '../../components/HistoryServices/CollapsibleSelection';
import CollapsibleDate from '../../components/HistoryServices/CollapsibleDate';
import {sendInvoice} from '../../components/HistoryServices/HistoryServices';
import CollapsibleOrderCard from '../../components/HistoryServices/CollapsibleOrderCard';
import {
  greyHasOpacity,
  c_loading_icon,
  rq_get_basic_info,
} from '../../resource/BaseValue';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {useFetchHistory} from '../../components/HistoryServices/UseFetchUserHistory';
import {makeAPostRequest} from '../../resource/SupportFunction';
import {useDebounce} from 'use-debounce';
import {globalStyles} from '../../resource/style/global';

let langObj = getLanguage();
let perfectSize = getPerfectSize();

let GetHeader = React.memo(({flipAnim, label, is_status}) => {
  //console.count('header ' + label)
  return (
    <View
      style={{
        minWidth: perfectSize(492),
        height: perfectSize(100),
        borderRadius: perfectSize(20),
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowRadius: perfectSize(15),
        shadowOpacity: 1,
        borderStyle: 'solid',
        padding: 10,
        flexDirection: 'row',
        borderWidth: perfectSize(1),
        borderColor: '#f1f1f3',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={
          is_status
            ? require('../../image/status_logo.png')
            : require('../../image/date_logo.png')
        }
        style={{width: perfectSize(40.9), height: perfectSize(40.9)}}></Image>
      <Text
        style={{
          fontFamily: 'AlmoniDLAAA',
          fontWeight: 'normal',
          fontSize: perfectSize(60),
          marginStart: perfectSize(31),
          letterSpacing: perfectSize(-3),
        }}>
        {label}
      </Text>

      <Animated.View
        style={{
          marginLeft: 'auto',
          // transform: [{rotate: flipAnim}],
        }}>
        <Image
          source={require('../../image/downArrow.png')}
          style={{
            height: perfectSize(30.3),
            width: perfectSize(46.7),
          }}></Image>
      </Animated.View>
    </View>
  );
});

let OrdersList = React.memo(
  ({foundOrders, fetchMore, renderFooter, statuses, info}) => {
    return (
      <FlatList
        listKey={moment().valueOf().toString()}
        style={{marginBottom: 'auto', marginTop: perfectSize(40)}}
        data={foundOrders}
        renderItem={({item}) => {
          return (
            <CollapsibleOrderCard info={info} statuses={statuses} item={item} />
          );
        }}
        keyExtractor={item => item.order_id}
        onEndReachedThreshold={0.9}
        onEndReached={fetchMore}
        ListFooterComponent={renderFooter}
      />
    );
  },
);
export default function ScreenOrderHistory(props) {
  const flipDateAnim = useRef(new Animated.Value(3.14)).current;
  const flipStatusAnim = useRef(new Animated.Value(3.14)).current;

  const flipDate = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(flipDateAnim, {
      toValue: isDateOpened ? 0 : 3.14,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const flipStatus = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(flipStatusAnim, {
      toValue: isSelectionOpened ? 0 : 3.14,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const LottieRef = useRef(null);

  const [debounced, setDebounced] = React.useState(false);
  const [statuses, setStatuses] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [info, setInfo] = React.useState({});
  const [input, onChangeText] = React.useState('');
  const [value] = useDebounce(input, 1000);
  const [indicatorSizeW, setIndicatorSizeW] = React.useState(0);
  const [indicatorSizeH, setindicatorSizeH] = React.useState(0);
  const [animationSuccessPlay, setAnimationSuccessPlay] = React.useState(false);
  const successAnimation = useRef(new Animated.Value(0)).current;
  const [isDateOpened, setIsDateOpened] = React.useState(false);
  const [isSelectionOpened, setIsSelectionOpened] = React.useState(false);
  const [filter_from_date, setFilterFromDate] = React.useState('');
  const [filter_to_date, setFilterToDate] = React.useState('');
  const [indicatorDisplay, setIndicatorDisplay] = React.useState(false);
  const [status, onChangeStatus] = React.useState(langObj.status);
  const [startDate, setStartDate] = React.useState({});
  const [endDate, setEndDate] = React.useState({});
  const [date_string, setDateString] = React.useState(langObj.dates);
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const [send_invoice_success, set_send_invoice_success] =
    React.useState(false);

  const [foundOrders, fetchMore, resetFetch] = useFetchHistory(
    status,
    value,
    date_string,
    filter_from_date,
    filter_to_date,
    setLoading,
    statuses,
    setStatuses,
  );
  const toggleSuccessAnimation = () => {
    successAnimation.setValue(0);
    setAnimationSuccessPlay(true);
    Animated.timing(successAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start(() => {
      setAnimationSuccessPlay(false);
    });
  };
  // Similar to componentDidMount and componentDidUpdate:
  const isFocused = useIsFocused();
  React.useEffect(() => {
    makeAPostRequest(
      {request: rq_get_basic_info},
      () => {},
      () => {},
      (isSuccess, response) => {
        if (isSuccess) {
          setInfo(response);
        } else {
          alert(JSON.stringify(response));
        }
      },
    );
  }, []);
  React.useEffect(() => {
    if (isFocused) {
      onChangeStatus('סטטוס');
      setDateString(langObj.dates);
      onChangeText('');
      setIsSelectionOpened(false);
      setIsDateOpened(false);
      resetFetch();
    } //Update the state you want to be updated
  }, [isFocused]);

  React.useEffect(() => {
    setDebounced(false);
    resetFetch();
  }, [value]);

  //    React.useEffect(() => {
  //      getDataWithSubKey(key_user_info, sub_key_token, (token) => {
  //        let dataObj = {
  //         request: req_supplier_get_orders,
  //         token: token,
  //        };
  //        makeAPostRequest(
  //         dataObj,
  //         _showLoadingBox,
  //         _closeLoadingBox,
  //         (isSuccess, responseJson) => {
  //           setFoundOrders(responseJson.orders)
  //           //alert("found")
  //   });
  // })} ,[])

  React.useEffect(() => {
    if (isDateOpened || isSelectionOpened) {
      setindicatorSizeH(screenHeight);
      setIndicatorSizeW(screenWidth);
    } else {
      setindicatorSizeH(0);
      setIndicatorSizeW(0);
    }
  }, [isDateOpened, isSelectionOpened]);

  let confirm_date = (dateFrom, dateTo) => {
    // alert(dateFrom)
    // alert(dateTo)

    if (dateFrom == null && dateTo == null) {
      resetFetch();
      setFilterFromDate('');
      setFilterToDate('');
      setDateString(langObj.dates);
    } else {
      resetFetch();
      setFilterFromDate(moment(dateFrom).format());
      setFilterToDate(moment(dateTo).format());
      setDateString(
        moment(dateFrom).format('DD.MM.YY') +
          '-' +
          moment(dateTo).format('DD.MM.YY'),
      );
    }

    //alert(dateFrom +"\n"+dateTo)
  };

  let renderFooter = () => {
    return loading ? (
      <View
        style={{
          marginTop: perfectSize(30),
          marginBottom: perfectSize(50),
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator
          animating={loading}
          size="large"
          color={c_loading_icon}
        />
      </View>
    ) : foundOrders.length ? (
      <View />
    ) : (
      <Text
        style={{
          alignSelf: 'center',
          marginTop: perfectSize(134),
          fontFamily: 'OscarFM-Regular',
          fontSize: perfectSize(75),

          letterSpacing: perfectSize(-1.5),
          color: '#d1d2d4',
        }}>
        {langObj.noResults}
      </Text>
    );
  };
  //console.count('order history rendered')
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: perfectSize(500),
          left: 0,
          top: 0,
          marginTop: screenHeight / 2 - perfectSize(700) / 2,
          marginLeft: screenWidth / 2 - perfectSize(500) / 2,
          zIndex: 2000,
          height: perfectSize(700),
        }}>
        <LottieView
          style={{
            display: animationSuccessPlay ? 'flex' : 'none',
          }}
          resizeMode="cover"
          ref={LottieRef}
          progress={successAnimation}
          source={
            send_invoice_success
              ? require('../../resource/animations/success.json')
              : require('../../resource/animations/failed.json')
          }
        />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'column',
          height: perfectSize(330),
          alignItems: 'center',
        }}>
        <View
          style={{alignSelf: 'flex-start', backgroundColor: 'white'}}></View>
        <Text
          style={{
            fontSize: perfectSize(60),
            position: 'absolute',
            top: perfectSize(42),
            fontWeight: 'normal',
            flexWrap: 'wrap',
            letterSpacing: perfectSize(-1),
            fontFamily: 'OscarFM-Regular',
          }}>
          {langObj.OrderHistory}
        </Text>
        <DibbleHeader {...props}></DibbleHeader>
      </View>
      {/* {1 ? ( */}

      {date_string !== langObj.dates ? (
        <View
          style={{
            display: 'flex',
            marginTop: perfectSize(37),
            marginBottom: perfectSize(10),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={[
              globalStyles.textAlmoniDLAAA_50,
              {
                letterSpacing: perfectSize(-1.5),

                marginStart: perfectSize(211),
              },
            ]}>
            {langObj.presentResultsFor + ' ' + date_string}
          </Text>
          <View>
            <Heshbo></Heshbo>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              setLoading(true);

              sendInvoice(
                moment(filter_from_date),
                moment(filter_to_date),
                success => {
                  set_send_invoice_success(success);
                  setLoading(false);

                  toggleSuccessAnimation(success);
                },
              );
            }}>
            <Text
              style={{
                fontFamily: 'AlmoniDLAAA',
                fontSize: perfectSize(36),

                textDecorationLine: 'underline',
                letterSpacing: perfectSize(-1.5),
                color: '#ffca1a',
              }}>
              {langObj.export_hesbo}
            </Text>

            {foundOrders.length && loading ? (
              <ActivityIndicator
                style={{marginStart: perfectSize(50)}}
                animating={loading}
                size="large"
                color={c_loading_icon}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* <View style={{
        maxHeight: date_string !== langObj.dates ? perfectSize(1100) : perfectSize(1300), padding: perfectSize(20)
      }}> */}

      <OrdersList
        foundOrders={foundOrders}
        info={info}
        fetchMore={fetchMore}
        renderFooter={renderFooter}
        statuses={statuses}
      />
      {/* </View> */}

      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: indicatorSizeW,
          height: indicatorSizeH * 0.8,
          backgroundColor: greyHasOpacity,
          alignItems: 'center',
          left: 0,
          top: perfectSize(330),
          // backgroundColor: 'red',
          justifyContent: 'center',
          position: 'absolute',
        }}></TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          setIsSelectionOpened(false);
          setIsDateOpened(false);
        }}
        style={{
          position: 'absolute',
          top: perfectSize(200),
          height: isDateOpened || isSelectionOpened ? '100%' : 'auto',
          justifyContent: 'space-evenly',
          width: '100%',
          flexDirection: 'row',
        }}>
        <View style={{}}>
          <CollapsibleSelection
            statuses={statuses}
            is_opened={isSelectionOpened}
            set_is_opened={setIsSelectionOpened}
            toggleAnimation={flipStatus}
            contentHeight={perfectSize(700)}
            Header={
              <GetHeader
                flipAnim={flipStatusAnim}
                flip
                label={status}
                is_status={1}
              />
            }
            onChangeStatus={status => {
              resetFetch();
              onChangeStatus(status);
            }}
            status={status}></CollapsibleSelection>
        </View>
        <View style={{}}>
          <CollapsibleDate
            contentHeight={perfectSize(1200)}
            confirmDate={confirm_date}
            toggleAnimation={flipDate}
            set_is_opened={setIsDateOpened}
            is_opened={isDateOpened}
            Header={
              <GetHeader flipAnim={flipDateAnim} label={date_string} />
            }></CollapsibleDate>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: perfectSize(658),
              height: perfectSize(99),
              borderRadius: perfectSize(20),
              backgroundColor: '#ffffff',
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowRadius: perfectSize(15),
              shadowOpacity: 1,
              borderStyle: 'solid',
              borderWidth: perfectSize(1),
              flexDirection: 'row',
              fontSize: perfectSize(60),
              letterSpacing: perfectSize(-3),
              paddingStart: perfectSize(63),
              paddingEnd: perfectSize(60),
              paddingBottom: perfectSize(21),
              paddingTop: perfectSize(20),
              color: '#d1d2d4',
              borderColor: '#f1f1f3',
            }}>
            <TextInput
              style={{
                textAlign: 'right',
                fontFamily: 'AlmoniDLAAA',
                fontSize: perfectSize(60),

                width: perfectSize(500),
                letterSpacing: perfectSize(-3),
                color: 'black',
                borderColor: '#f1f1f3',
              }}
              placeholder={langObj.search}
              placeholderTextColor={'#d1d2d4'}
              onChangeText={text => {
                setDebounced(true);
                onChangeText(text);
              }}
              value={input}
            />
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginEnd: perfectSize(50),
              }}
              //onPress={()=>fetchOrdersWithFilter(status,input,date_string,filter_from_date,filter_to_date)}
            >
              <Image
                source={require('../../image/icon_search_static.png')}
                style={{
                  height: perfectSize(60),
                  alignSelf: 'flex-end',
                  width: perfectSize(60),
                }}></Image>
              <ActivityIndicator
                style={{position: 'absolute'}}
                animating={debounced}></ActivityIndicator>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
