import IncomingOrdersBar from '../../components/IncomingOrdersBar/IncomingOrdersBar';
import {mStyle} from './styles';
import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  Animated,
  Easing,
  View,
  Alert,
  AppState,
} from 'react-native';
import pure from 'recompose/pure';
import LottieView from 'lottie-react-native';
import ScreenOrderChange from '../../components//ModalOrderChange/screenOrderChange';
import ScreenRejectOrder from '../../components/ModalRejectOrder/ScreenRejectOrder';
import {
  c_loading_icon,
  displayTimeFormat,
  key_Accepted_Timed_orders,
  key_user_info,
  modal_ready_for_shipment,
  modal_select_delivery_method,
  modal_select_product,
  modal_submit_bid,
  order_type_pickup,
  rq_get_active_order_requests,
  rq_get_granted_order_requests,
  rq_get_ready_order_requests,
  rq_get_shipped_order_requests,
  rq_set_bid_order_ready,
  rq_update_device_info,
  sub_key_token,
  rq_get_updated_bidded_orders,
  rq_supplier_get_order_details,
} from '../../resource/BaseValue';
import ScreenFillBid from '../ScreenFillBid';
import DibbleHeader from '../../components/DibbleHeader/DibbleHeader';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {
  getDataWithSubKey,
  makeAPostRequest,
} from '../../resource/SupportFunction';
import moment from 'moment';
import SubmitBidScreen from '../ScreenSubmitBid';
import SelectDeliveryScreen from '../ScreenSelectDelivery';
import KeepAwake from 'react-native-keep-awake';
import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import ScreenPickup from '../ScreenPickup';
import ApprovedOrdersBar from '../../components/ApprovedOrdersBar/ApprovedOrdersBar';
import ReadyOrdersBar from '../../components/ReadyOrdersBar/ReadyOrdersBar';
import {UserContext} from '../../resource/auth/UserContext';
import GetPaidModal from '../../components/GetPaidModal/GetPaidModal';

const RELOAD_INTERVAL_VALUE = 200000; //200000/1000/60=3.3 minutes
let langObj = getLanguage();
let isListenningFcm = false;
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

let perfectSize = getPerfectSize();

class DashBoardScreen extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      modalMarginTop: new Animated.Value(1150),
      modalOpacity: new Animated.Value(0),

      indicatorDisplay: false,
      userName: '',
      password: '',
      showPassword: false,
      orders: [],
      isShowSelectProduct: false,
      isShowSubmitBid: false,
      modalType: -1,
      hour_string: '',
      date_string: '',
      failedAnimationProgress: new Animated.Value(0),
      successAnimationProgress: new Animated.Value(0),
      day_string: '',
      day_no: '',
      selectedOrder: {},
      isShowModal: false,
      acceptBid: [],
      updatedBiddedOrders: [],
      biddedOrders: [],
      new_flow_enabled: true,
      approvedTimedOrders: [],
      readyOrder: [],
      shippedOrder: [],
      isOrderLoading: false,
      refreshList: false,
      internetState: true,
      showGetPaidModal: false,
    };
  }
  modalUp = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(this.state.modalMarginTop, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.modalOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  modalDown = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(this.state.modalMarginTop, {
      toValue: 1150,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.modalOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  check_updated_bidded_orders = () => {
    // alert('here')
    // console.log('in check_updated_bidded_orders')
    if (this.state.updatedBiddedOrders.length) {
      // console.log('inside check_updated_bidded_orders')

      let bidded = this.state.updatedBiddedOrders[0];
      if (!this.state.isShowModal) {
        this.loadBiddedDetails(bidded);
      }
    }
  };

  load_and_update_scheduled_order_list = () => {
    let now = moment.utc(moment());
    for (let i = 0; i < this.state.acceptBid.length; ++i) {
      if (this.state.acceptBid[i]['order_type'] == 3) {
        //alert(this.state.acceptBid[i]['order_type'])
        let ready_time = moment.utc(this.state.acceptBid[i]['ready_time']);
        let order_id = this.state.acceptBid[i]['order_id'];
        var year_diff = ready_time.year() - now.year();
        var month_diff = ready_time.month() - now.month();
        var days_diff = ready_time.date() - now.date();
        let time_predicate =
          year_diff <= 0 && month_diff <= 0 && days_diff <= 0;
        // let result =
        //   diffInMinutes - this.state.acceptBid[i]['reminder_minutes_before'];
        // console.log(diffInMinutes, 'diffInMinutes');
        // console.log(result, 'total_diff');
        // console.log(ready_time, 'ready_time');
        // console.log(now, 'now_time');

        // alert('now ' + now.format())
        // alert('ready time ' + ready_time.format())

        // alert(diffInMinutes)

        if (time_predicate) {
          this.alert_scheduled_order(this.state.acceptBid[i]['order_id']);
        } else {
          //result is negative i.e now is smaller than the delivery date
          if (
            this.state.approvedTimedOrders.find(
              approved_id => approved_id == order_id,
            ) == undefined
          ) {
            this.updateApprovedTimedOrders(this.state.acceptBid[i]);
          }
        }
      }
    }
  };
  updateApprovedTimedOrders = item => {
    if (
      this.state.approvedTimedOrders.find(id => {
        return id == item.order_id;
      }) == undefined
    ) {
      let allState = this.state;
      let TimedDeliveriesList = allState.approvedTimedOrders;
      TimedDeliveriesList.push(item.order_id);
      allState.approvedTimedOrders = TimedDeliveriesList;
      this.setState(allState);
      AsyncStorage.setItem(
        key_Accepted_Timed_orders,
        JSON.stringify(TimedDeliveriesList),
      );
    }
  };
  loadApprovedTimesOrders = async () => {
    let TimedDeliveries = await AsyncStorage.getItem(key_Accepted_Timed_orders);
    if (TimedDeliveries !== null) {
      console.log('not null' + TimedDeliveries);
      this.setState({approvedTimedOrders: JSON.parse(TimedDeliveries)});
    }
  };

  // REMOVE FROM LIST FUNCTIONS
  remove_order_from_ready = order_id => {
    let ready_orders = this.state.readyOrder;
    ready_orders = ready_orders.filter(order => order.order_id != order_id);
    this.setState({readyOrder: ready_orders});
  };
  remove_order_from_active = order_id => {
    let active_orders = this.state.orders;
    active_orders = active_orders.filter(order => order.order_id != order_id);
    this.setState({orders: active_orders});
  };
  remove_order_from_granted = order_id => {
    let granted = this.state.acceptBid;
    granted = granted.filter(order => order.order_id != order_id);
    this.setState({acceptBid: granted});
  };
  remove_order_from_shipped = order_id => {
    let shipped = this.state.shippedOrder;
    shipped = shipped.filter(order => order.order_id != order_id);
    this.setState({shippedOrder: shipped});
  };
  remove_order_from_approved_timed_orders = order_id => {
    let approved = this.state.approvedTimedOrders;
    approved = approved.filter(order => order.order_id != order_id);
    this.setState({approvedTimedOrders: approved});
  };

  afterFinishBid = order_id => {
    // alert(order_id)
    let biddedOrders = this.state.biddedOrders;
    biddedOrders.push(order_id);
    this.setState({biddedOrders: biddedOrders});
    this.closeModalBox();
    this.check_updated_bidded_orders();
    this.loadActiveOrderRequest();
  };
  play_new_order_sound = () => {
    this.state.bell.play(success => {
      if (success) {
        //alert('successfully finished playing');
      } else {
        //alert('playback failed due to audio decoding errors');
      }
    });
  };
  play_active_to_granted_sound = () => {
    this.state.active_to_granted.play(success => {
      if (success) {
        //alert('successfully finished playing');
      } else {
        //alert('playback failed due to audio decoding errors');
      }
    });
  };
  play_edit_order_sound = () => {
    this.state.update_sound.play(success => {
      if (success) {
        //alert('successfully finished playing');
      } else {
        //alert('playback failed due to audio decoding errors');
      }
    });
  };

  componentDidUpdate() {
    setTimeout(() => {
      if (
        this.props.route != null &&
        this.props.route.params != null &&
        this.props.route.params.refreshScreen != null
      ) {
        this.loadActiveOrderRequest();
      }
    }, 500);
  }

  alert_scheduled_order(order_id) {
    if (
      this.state.approvedTimedOrders.find(order => order == order_id) !=
      undefined
    ) {
      this.play_active_to_granted_sound();
      let allState = this.state;
      if (allState.approvedTimedOrders.length) {
        this.setState(
          {
            approvedTimedOrders: this.state.approvedTimedOrders.filter(
              order => order != order_id,
            ),
          },
          () => {
            AsyncStorage.setItem(
              key_Accepted_Timed_orders,
              JSON.stringify(this.state.approvedTimedOrders),
            );
          },
        );
      }
    }
  }
  _handleAppStateChange(state) {
    if (state == 'active') {
      this.loadUpdatedBiddedOrders();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  componentDidMount() {
    const {loggedIn, modalOpen} = this.context;
    console.log('Context values on componentDidMount:', {
      loggedIn,
      modalOpen,
    });

    this.LoadSoundObject();
    //this.updateDate();
    //this.loadApprovedTimesOrders();
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));

    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (!state.isConnected && this.state.internetState) {
        this._closeLoadingBox();
        //alert(langObj.noNetwork);
        this.setState({
          internetState: state.isConnected,
        });
      } else if (state.isConnected && !this.state.internetState) {
        this.setState(
          {
            internetState: state.isConnected,
          },
          () => {
            setTimeout(() => {
              this.loadActiveOrderRequest();
            }, 1000);
          },
        );
      }
      // this.setTimeAndDataIntervals();
    });

    KeepAwake.activate();
    this.listenFCMToken();
    this.loadActiveOrderRequest();
    this.loadUpdatedBiddedOrders();
  }

  LoadSoundObject() {
    var Sound = require('react-native-sound');
    Sound.setCategory('Playback');
    var bell = new Sound(require('../../resource/sounds/bell.mp3'), error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
    });
    var update_sound = new Sound(
      require('../../resource/sounds/update.wav'),
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      },
    );
    var active_to_granted = new Sound(
      require('../../resource/sounds/little_robot_sound_factory_Jingle_Win_Synth_06.mp3'),
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
      },
    );

    this.setState({
      active_to_granted: active_to_granted,
      bell: bell,
      update_sound: update_sound,
    });
  }

  // setTimeAndDataIntervals() {
  //   // var timer_interval = setInterval(() => {
  //   //   this.setState({hour_string: this.getTime()});
  //   // }, 1000);

  //   // var date_update_interval=setInterval(()=>{
  //   //   this.updateDate();
  //   // },600000)

  //   // alert("set interval")
  //   clearInterval(this.state.refresh_interval);
  //   clearInterval(this.state.schedule_orders_collector);
  //   clearInterval(this.state.load_update_interval);

  //   var schedule_orders_collector = setInterval(
  //     this.load_and_update_scheduled_order_list,
  //     120000,
  //   );

  //   var load_update_interval = setInterval(() => {
  //     this.loadUpdatedBiddedOrders();
  //   }, 200000);
  //   var refresh_interval = setInterval(() => {
  //     this.loadActiveOrderRequest();
  //   }, RELOAD_INTERVAL_VALUE);
  //   this.setState({
  //     load_update_interval: load_update_interval,
  //     refresh_interval: refresh_interval,
  //     schedule_orders_collector: schedule_orders_collector,
  //   });
  // }

  componentWillUnmount() {
    KeepAwake.deactivate();

    isListenningFcm = false;
  }
  handleRemoteMessage(remoteMessage) {
    //alert(remoteMessage);
    //alert(  JSON.stringify(remoteMessage)                    )
    console.log(
      'Background FCM message arrived!' + JSON.stringify(remoteMessage),
    );
    if (remoteMessage.data.action === 'new_order') {
      this.play_new_order_sound();
      this.loadActiveOrderRequestOnly();
    } else if (remoteMessage.data.action === 'bid_reminder') {
      this.alert_scheduled_order(remoteMessage.data.order_id);
    } else if (remoteMessage.data.action === 'bid_ready') {
      this.loadActiveOrderRequestOnly();
      this.loadApprovedTimesOrders();
    } else if (remoteMessage.data.action === 'order_delivered') {
      this.remove_order_from_shipped(remoteMessage.data.order_id);
      this.loadShippedOrderRequest();
    } else if (remoteMessage.data.action === 'bid_granted') {
      let order = this.state.orders.find(
        order => order.order_id == remoteMessage.data.order_id,
      );
      if (order) {
        if (order.order_type != 3) {
          this.play_active_to_granted_sound();
        }
      }

      this.remove_order_from_active(remoteMessage.data.order_id);
      this.loadGrantedBid();
    } else if (remoteMessage.data.action === 'updateOrderStatus') {
      this.remove_order_from_ready(remoteMessage.data.order_id);
      this.loadShippedOrderRequest();
    } else if (remoteMessage.data.action === 'bid_not_granted') {
      this.remove_order_from_active(remoteMessage.data.order_id);
    } else if (remoteMessage.data.action === 'cancelled_order') {
      this.remove_order_from_active(remoteMessage.data.order_id);
      this.remove_order_from_granted(remoteMessage.data.order_id);
      this.remove_order_from_ready(remoteMessage.data.order_id);
      this.remove_order_from_shipped(remoteMessage.data.order_id);
      this.remove_order_from_approved_timed_orders(remoteMessage.data.order_id);
    } else if (remoteMessage.data.action === 'updated_order') {
      let found = this.state.orders.find(
        o => o.order_id == remoteMessage.data.order_id,
      );
      if (found && !found.bid_was_placed) {
        this.updateOrderDetails(remoteMessage.data.order_id);
      } else {
        //not in incoming, or already bidded
        if (this.state.isShowModal) {
          //if modal is up, save the change to updatedBiddedOrders
          let updated_orders = this.state.updatedBiddedOrders;
          if (
            !updated_orders.find(o => o.order_id == remoteMessage.data.order_id)
          ) {
            updated_orders.push({order_id: remoteMessage.data.order_id});
          }
          this.setState({updatedBiddedOrders: updated_orders});
        } else {
          //if modal is down, conduct order change flow
          this.loadBiddedDetails({order_id: remoteMessage.data.order_id});
        }
      }
    }
  }
  listenFCMToken = async () => {
    if (!isListenningFcm) {
      isListenningFcm = true;
      if (Platform.OS == 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
      messaging()
        .getToken()
        .then(token => {
          console.log('token: ' + token);
          if (token != '') {
            this.updateFCMWithServer(token);
          }
        });

      messaging().onTokenRefresh(token => {
        console.log('token: ' + token);
        if (token != '') {
          this.updateFCMWithServer(token);
        }
      });
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        this.handleRemoteMessage(remoteMessage);
      });
      messaging().onMessage(async remoteMessage => {
        //alert(remoteMessage);
        //alert(  JSON.stringify(remoteMessage)                    )
        console.log(
          'onMessage FCM message arrived!' + JSON.stringify(remoteMessage),
        );
        if (remoteMessage.data.action === 'new_order') {
          this.play_new_order_sound();
          this.loadActiveOrderRequestOnly();
        } else if (remoteMessage.data.action === 'bid_reminder') {
          this.alert_scheduled_order(remoteMessage.data.order_id);
        } else if (remoteMessage.data.action === 'bid_ready') {
          this.loadActiveOrderRequestOnly();
          this.loadApprovedTimesOrders();
        } else if (remoteMessage.data.action === 'order_delivered') {
          this.remove_order_from_shipped(remoteMessage.data.order_id);
          this.loadShippedOrderRequest();
        } else if (remoteMessage.data.action === 'bid_granted') {
          let order = this.state.orders.find(
            order => order.order_id == remoteMessage.data.order_id,
          );
          if (order) {
            if (order.order_type != 3) {
              this.play_active_to_granted_sound();
            }
          }

          this.remove_order_from_active(remoteMessage.data.order_id);
          this.loadGrantedBid();
        } else if (remoteMessage.data.action === 'updateOrderStatus') {
          this.remove_order_from_ready(remoteMessage.data.order_id);
          this.loadShippedOrderRequest();
        } else if (remoteMessage.data.action === 'bid_not_granted') {
          this.remove_order_from_active(remoteMessage.data.order_id);
        } else if (remoteMessage.data.action === 'cancelled_order') {
          this.remove_order_from_active(remoteMessage.data.order_id);
          this.remove_order_from_granted(remoteMessage.data.order_id);
          this.remove_order_from_ready(remoteMessage.data.order_id);
          this.remove_order_from_shipped(remoteMessage.data.order_id);
          this.remove_order_from_approved_timed_orders(
            remoteMessage.data.order_id,
          );
        } else if (remoteMessage.data.action === 'updated_order') {
          let found = this.state.orders.find(
            o => o.order_id == remoteMessage.data.order_id,
          );
          if (found && !found.bid_was_placed) {
            console.log('conducting order change flow');

            this.updateOrderDetails(remoteMessage.data.order_id);
          } else {
            //not in incoming, or already bidded
            if (this.state.isShowModal) {
              //if modal is up, save the change to updatedBiddedOrders
              let updated_orders = this.state.updatedBiddedOrders;
              if (
                !updated_orders.find(
                  o => o.order_id == remoteMessage.data.order_id,
                )
              ) {
                updated_orders.push({order_id: remoteMessage.data.order_id});
              }
              this.setState({updatedBiddedOrders: updated_orders});
            } else {
              //if modal is down, conduct order change flow
              this.loadBiddedDetails({order_id: remoteMessage.data.order_id});
            }
          }
        }
      });
    }
  };
  updateFCMWithServer = async fcmToken => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let requestObj = {
        request: rq_update_device_info,
        device_id: fcmToken,
      };
      makeAPostRequest(
        requestObj,
        () => {
          // this.showLoading()
        },
        () => {
          // this.closeLoading()
        },
        (isSucceed, respondString) => {
          console.log('updateFCMWithServer: ' + respondString);
        },
      );
    });
  };
  closeModalBid = (updated_products, order_id) => {
    let biddedOrders = this.state.updatedBiddedOrders;
    biddedOrders = biddedOrders.filter(ord => ord.order_id != order_id);
    this.setState({updatedBiddedOrders: biddedOrders}, () => {
      if (updated_products) {
        let active_orders = this.state.orders.filter(
          order => order.order_id != order_id,
        );
        let accept_bid_orders = this.state.acceptBid.filter(
          order => order.order_id != order_id,
        );
        let active_result = this.state.orders.find(
          order => order.order_id == order_id,
        );
        if (active_result) {
          active_result.products = updated_products;
          if (active_result.bid_was_placed) {
            active_result.bidded_products = updated_products;
          }
          active_orders.push(active_result);
          active_orders = active_orders.sort(
            (o1, o2) => o2.order_id - o1.order_id,
          );
          this.setState({orders: active_orders});
        } else {
          updated_products = updated_products.map(p => {
            delete p.max_amount;
            return {...p};
          });
          let accept_bit_orders_result = this.state.acceptBid.find(
            order => order.order_id == order_id,
          );

          if (accept_bit_orders_result) {
            accept_bit_orders_result.products = updated_products;
            accept_bid_orders.push(accept_bit_orders_result);
            accept_bid_orders = accept_bid_orders.sort(
              (o1, o2) => o1.order_id - o2.order_id,
            );
            this.setState({acceptBid: accept_bid_orders});
          }
        }
      }
      this.closeModalBox();
    });
  };
  loadActiveOrderRequest = async () => {
    this.setState({isOrderLoading: true});
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_active_order_requests,
        token: token,
      };

      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          //this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox()
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            let allState = this.state;
            allState.orders = responseJson.orders;
            // allState.readyOrder = JSON.parse(JSON.stringify(responseJson.orders));
            for (let i = 0; i < allState.orders.length; i++) {
              // let timeStr = allState.orders[i]['ready_time'];
              // timeStr = moment.utc(timeStr).local().format('HH:mm');
              // //allState.orders[i]['ready_time'] = timeStr;
              for (let j = 0; j < allState.orders[i]['products'].length; j++) {
                allState.orders[i]['products'][j]['max_amount'] =
                  allState.orders[i]['products'][j]['amount'];
              }
              // let timeStrPlacedOn = allState.orders[i]['placed_on'];
              // let timeStrPlacedOnLocal = moment
              //     .utc(timeStrPlacedOn)
              //     .local()
              //     .format(displayTimeFormat);
              // allState.orders[i]['placed_on'] = timeStrPlacedOnLocal;

              //  console.log(timeStrPlacedOnLocal);
            }
            allState.isOrderLoading = false;
            this.setState(allState, () => {
              this.loadGrantedBid();
            });
          } else {
            this._closeLoadingBox();
            let allState = this.state;
            allState.isOrderLoading = false;
            allState.isShowErrorMessage = true;
            allState.orders = [];
            this.setState(allState);
          }
        },
      );
    });
  };
  updateDate = () => {
    this.setState({
      date_string: moment(Date()).format('DD.MM.YYYY'),
      day_string: langObj[this.state.days[this.getDay()]],
    });
  };
  getTime = () => {
    var currentDate = new Date();
    return currentDate.toLocaleTimeString('en-GB');
  };
  getDay = () => {
    var currentDate = new Date();
    return currentDate.getDay();
  };
  loadActiveOrderRequestOnly = async () => {
    this.setState({isOrderLoading: true});
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {};
      console.log(dataObj);
      makeAPostRequest(
        rq_get_active_order_requests,
        dataObj,
        () => {
          //this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            let allState = this.state;
            allState.orders = [];
            allState.orders = responseJson.orders;

            for (let i = 0; i < allState.orders.length; i++) {
              for (let j = 0; j < allState.orders[i]['products'].length; j++) {
                allState.orders[i]['products'][j]['max_amount'] =
                  allState.orders[i]['products'][j]['amount'];
              }
              let timeStr = allState.orders[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              // allState.orders[i]['ready_time'] = timeStr;
              let timeStrPlacedOn = allState.orders[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
            }

            allState.isOrderLoading = false;
            this.setState(allState);
          } else {
            let allState = this.state;
            allState.isOrderLoading = false;
            allState.isShowErrorMessage = true;
            this.setState(allState);
          }
        },
      );
    });
  };
  loadBiddedDetails = async order => {
    // alert('load_bidded')
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_supplier_get_order_details,
        token: token,
        order_id: order.order_id,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          //this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            if (!this.state.isShowModal) {
              setTimeout(
                () => this.show_update_order_modal(responseJson),
                3000,
              );
            } else {
              let updated_orders = this.state.updatedBiddedOrders;
              if (!updated_orders.find(o => o.order_id == order.order_id)) {
                updated_orders.push({order_id: order.order_id});
              }
              this.setState({updatedBiddedOrders: updated_orders});
            }
          }
        },
      );
    });
  };

  updateOrderDetails = async order_id => {
    let current_state_orders = this.state.orders.filter(
      order => order.order_id != order_id,
    );
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_supplier_get_order_details,
        token: token,
        order_id: order_id,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          this._showLoadingBox();
        },
        () => {
          this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            this._showLoadingBox();

            current_state_orders.push(responseJson);
            current_state_orders = current_state_orders.sort(
              (a, b) => b.order_id - a.order_id,
            );
            this.setState(
              {orders: current_state_orders},
              this._closeLoadingBox,
            );
          } else {
          }
        },
      );
    });
  };

  loadUpdatedBiddedOrders = async () => {
    // alert('load_bidded')
    this.setState({isOrderLoading: true});
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_updated_bidded_orders,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          //this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            // alert(JSON.stringify(responseJson))
            let allState = this.state;
            allState.updatedBiddedOrders = responseJson.orders;
            allState.isOrderLoading = false;
            this.setState(allState, this.check_updated_bidded_orders);
          } else {
            //   alert(responseJson)
          }
        },
      );
    });
  };

  loadGrantedBidOnly = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_granted_order_requests,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          // this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            let allState = this.state;
            allState.acceptBid = responseJson.orders;
            for (let i = 0; i < allState.acceptBid.length; i++) {
              let timeStr = allState.acceptBid[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              //allState.acceptBid[i]['ready_time'] = timeStr;
              let timeStrPlacedOn = allState.acceptBid[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
              // allState.acceptBid[i]['placed_on'] = timeStrPlacedOn;
              // allState.acceptBid[i]['forceShowWarning'] = false;
            }
            this.setState(allState);
          } else {
            this._closeLoadingBox();
            // alert(responseJson);
          }
        },
      );
    });
  };

  loadGrantedBid = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_granted_order_requests,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          // this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            let allState = this.state;
            allState.acceptBid = responseJson.orders;
            for (let i = 0; i < allState.acceptBid.length; i++) {
              let timeStr = allState.acceptBid[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              //allState.acceptBid[i]['ready_time'] = timeStr;
              let timeStrPlacedOn = allState.acceptBid[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
              // allState.acceptBid[i]['placed_on'] = timeStrPlacedOn;
              // allState.acceptBid[i]['forceShowWarning'] = false;
            }
            this.setState(allState, () => {
              this.load_and_update_scheduled_order_list();

              this.loadReadyOrderRequest();
            });
          } else {
            this._closeLoadingBox();
            // alert(responseJson);
          }
        },
      );
    });
  };
  loadReadyOrderRequest = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_ready_order_requests,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          // this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            console.log('ready list: ' + JSON.stringify(responseJson));
            let allState = this.state;
            allState.readyOrder = responseJson.orders;
            for (let i = 0; i < allState.readyOrder.length; i++) {
              let timeStr = allState.readyOrder[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              //allState.readyOrder[i]['ready_time'] = timeStr;

              let timeStrPlacedOn = allState.readyOrder[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
              // allState.readyOrder[i]['placed_on'] = timeStrPlacedOn;
              allState.readyOrder[i]['forceShowWarning'] = false;
            }
            this.setState(allState, () => {
              this.loadShippedOrderRequest();
            });
          } else {
            //alert(responseJson);
          }
        },
      );
    });
  };
  loadReadyOrderRequestOnly = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_ready_order_requests,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          // this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            console.log('ready list: ' + JSON.stringify(responseJson));
            let allState = this.state;
            allState.readyOrder = responseJson.orders;
            for (let i = 0; i < allState.readyOrder.length; i++) {
              let timeStr = allState.readyOrder[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              //allState.readyOrder[i]['ready_time'] = timeStr;

              let timeStrPlacedOn = allState.readyOrder[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
              // allState.readyOrder[i]['placed_on'] = timeStrPlacedOn;
              allState.readyOrder[i]['forceShowWarning'] = false;
            }
            this.setState(allState);
          } else {
            //alert(responseJson);
          }
        },
      );
    });
  };
  loadShippedOrderRequest = async () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_shipped_order_requests,
        token: token,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          //  this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          if (isSuccess) {
            console.log('ready list: ' + JSON.stringify(responseJson));
            let allState = this.state;
            allState.shippedOrder = responseJson.orders;
            for (let i = 0; i < allState.shippedOrder.length; i++) {
              let timeStr = allState.shippedOrder[i]['ready_time'];
              timeStr = moment.utc(timeStr).local().format('HH:mm');
              // allState.shippedOrder[i]['ready_time'] = timeStr;

              let timeStrPlacedOn = allState.shippedOrder[i]['placed_on'];
              timeStrPlacedOn = moment
                .utc(timeStrPlacedOn)
                .local()
                .format(displayTimeFormat);
              // allState.shippedOrder[i]['placed_on'] = timeStrPlacedOn;
              allState.shippedOrder[i]['forceShowWarning'] = false;
            }
            this.setState(allState);
          } else {
            //alert(responseJson);
          }
        },
      );
    });
  };
  setBidOrderReady = async (bidId, setClicked) => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_set_bid_order_ready,
        token: token,
        bid_id: bidId,
      };
      console.log(dataObj);
      makeAPostRequest(
        dataObj,
        () => {
          //this._showLoadingBox();
        },
        () => {
          //this._closeLoadingBox();
        },
        (isSuccess, responseJson) => {
          setTimeout(() => setClicked(false), 500);
          if (isSuccess) {
            this.loadGrantedBid();
          } else {
            this.context.setModalOpen(true);

            if (responseJson.rc == 529) {
              Alert.alert('', langObj.orderCanceled);
            } else {
              Alert.alert('', responseJson.message);
            }
          }
        },
      );
    });
  };

  rejectOrder = async orderId => {
    this.remove_order_from_active(orderId);
    this.showModalBox({order_id: orderId}, 8);

    // getDataWithSubKey(key_user_info, sub_key_token, (token) => {
    //     let dataObj = {
    //         request: rq_reject_order,
    //         token: token,
    //         order_id: orderId,
    //     };
    //     console.log(dataObj);
    //     makeAPostRequest(
    //         dataObj,
    //         () => {
    //             this._showLoadingBox();
    //         },
    //         () => {
    //             this._closeLoadingBox();
    //         },
    //         (isSuccess, responseJson) => {
    //             if (isSuccess) {
    //                 if (this.state.isOrderLoading == false) {
    //                     // this.loadActiveOrderRequestOnly();
    //                 }
    //                 this.showModalBox({order_id:orderId},8)

    //                 // let allState = this.state;
    //                 // let pos = -1;
    //                 // for (let i = 0; i < allState.orders.length && pos == -1; i++) {
    //                 //     if (allState.orders[i]['order_id'] == orderId) {
    //                 //         pos = i;
    //                 //     }
    //                 // }
    //                 // if (pos > -1) {
    //                 //     allState.orders.splice(pos,1);
    //                 //     allState.refreshList = !allState.refreshList;
    //                 //     this.setState (allState);
    //                 // }
    //             } else {
    //                 // alert(responseJson);
    //                 this._closeLoadingBox();
    //                 this.showModalBox(null,8)

    //             }
    //         },
    //     );
    // });
  };

  show_Enter_Price = () => {
    this.setState({entering_price: true});
  };
  hide_Enter_Price = () => {
    this.setState({entering_price: false});
  };
  loadModalBoxContent = () => {
    if (this.state.modalType == modal_select_product) {
      //1
      return (
        <ScreenFillBid
          new_flow={this.state.new_flow_enabled}
          show_Enter_Price={this.show_Enter_Price}
          hide_enter_price={this.hide_Enter_Price}
          orderSelected={this.state.selectedOrder}
          to_reset={!this.state.backToSelection}
          goToFrame={this.goToFrame}
          closeModal={this.closeModalBox}
          closeModalBid={this.closeModalBid}
          style={[mStyle.fillBidScreenStyle]}
        />
      );
    } else if (this.state.modalType == modal_submit_bid) {
      return (
        <SubmitBidScreen
          addTimedOrder={this.updateApprovedTimedOrders}
          orderSelected={this.state.selectedOrder}
          closeModal={this.closeModalBox}
          goToFrame={this.goToFrame}
          finishBid={this.afterFinishBid}
          updateBid={this.updateOrderDetails}
          removeFromActive={this.remove_order_from_active}
          style={{
            zIndex: 2,
            width: screenWidth,
            height: screenHeight,
            top: 0,
            flex: 1,
          }}
        />
      );
    } else if (this.state.modalType == modal_ready_for_shipment) {
      //3
      return (
        <ScreenPickup
          order={this.state.selectedOrder}
          closeDialog={() => {
            this.closeModalBox();
          }}></ScreenPickup>
        // <ReadyForShipmentScreen
        //   orderSelected={this.state.selectedOrder}
        //   closeDialog={this.closeModalBox}
        //   style={{
        //     zIndex: 2,
        //     width: screenWidth,
        //     height: screenHeight,
        //     top: 0,
        //     flex: 1,
        //   }}
        // />
      );
    } else if (this.state.modalType == modal_select_delivery_method) {
      //4
      return (
        <SelectDeliveryScreen
          orderSelected={this.state.selectedOrder}
          new_flow={this.state.new_flow_enabled}
          closeModal={this.closeModalBox}
          goToFrame={this.goToFrame}
          style={{
            zIndex: 2,
            width: screenWidth,
            height: screenHeight,
            top: 0,
            flex: 1,
          }}
        />
      );
    } else if (this.state.modalType == 8) {
      return (
        <ScreenRejectOrder
          play_success_animation={() => this.toggleSuccessAnimation()}
          play_failed_animation={() => this.toggleFailedAnimation()}
          remove_order_from_active={() =>
            this.remove_order_from_active(this.state.selectedOrder.order_id)
          }
          order_id={this.state.selectedOrder.order_id}
          closeModal={this.closeModalBox}></ScreenRejectOrder>
      );
    } else if (this.state.modalType == 9) {
      return (
        <ScreenOrderChange
          closeModal={this.closeModalBid}
          showModalBox={this.showModalBox}
          orderObject={this.state.selectedOrder}
          order_id={this.state.selectedOrder.order_id}
        />
      );
    } else {
      return;
    }
  };

  showModalBox = (data, type) => {
    let allState = this.state;
    allState.selectedOrder = data;
    allState.modalType = type;
    allState.indicatorSizeW = screenWidth;
    allState.indicatorSizeH = screenHeight;
    allState.isShowModal = true;
    this.context.setModalOpen(true);
    console.log(this.context.modalOpen);
    this.setState(allState, this.modalUp);
  };
  toggleFailedAnimation() {
    this.state.failedAnimationProgress.setValue(0);
    this.setState({animationFailedPlay: true});
    Animated.timing(this.state.failedAnimationProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.setState({animationFailedPlay: false});
    });
  }
  toggleSuccessAnimation() {
    this.state.successAnimationProgress.setValue(0);
    this.setState({animationSuccessPlay: true});
    Animated.timing(this.state.successAnimationProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.setState({animationSuccessPlay: false});
    });
  }
  closeModalBox = (callBack = this.loadUpdatedBiddedOrders) => {
    this.modalDown();
    var allState = this.state;
    if (
      this.state.modalType == modal_ready_for_shipment &&
      this.state.selectedOrder.order_type == order_type_pickup
    ) {
      this.loadReadyOrderRequest();
    }

    callBack
      ? this.setState(
          {
            indicatorSizeW: 0,
            indicatorSizeH: 0,
            isShowModal: false,
            backToSelection: false,
          },
          callBack,
        )
      : this.setState({
          indicatorSizeW: 0,
          indicatorSizeH: 0,
          isShowModal: false,
          backToSelection: false,
        });
    this.context.setModalOpen(false);

    return;
  };
  goToFrame = (data, frame) => {
    let allState = this.state;
    allState.selectedOrder = data;
    allState.modalType = frame;
    allState.backToSelection = true;
    this.setState(allState);
  };

  _showLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = screenWidth;
    allState.indicatorSizeH = screenHeight;
    allState.indicatorDisplay = true;
    this.setState(allState);
  }

  _closeLoadingBox() {
    var allState = this.state;
    allState.indicatorSizeW = 0;
    allState.indicatorSizeH = 0;
    allState.indicatorDisplay = false;
    this.setState(allState);
  }

  show_update_order_modal(order) {
    this.play_edit_order_sound();
    this.showModalBox(
      {
        ...order,
        products: order.products.map(p => {
          return {...p, max_amount: p.amount};
        }),
      },
      9,
    );
  }

  handleShowGetPaidModal = state => {
    var allState = this.state;
    allState.showGetPaidModal = state;
    this.setState(allState);
  };

  render() {
    //console.count('dashboard rendered')

    return (
      <View style={mStyle.mainDashBoardContainer}>
        <DibbleHeader
          {...this.props}
          handleGetPaidModal={() => this.handleShowGetPaidModal(true)}
          DashBoardScreen={true}
          title={langObj.activeOrder}
        />
        <Text
          style={[
            mStyle.noNetworkMessageTextStyle,
            {
              display: !this.state.internetState ? 'flex' : 'none',
            },
          ]}>
          {langObj.noNetwork}
        </Text>

        <View style={[mStyle.orderBarsContainerStyle]}>
          {/**** ORDERS SECTION  ******/}
          {/**** INCOMING ORDERS SECTION  ******/}
          <IncomingOrdersBar
            approvedTimedOrders={this.state.approvedTimedOrders}
            l={this.state.approvedTimedOrders.length}
            l2={this.state.orders.length}
            acceptBid={this.state.acceptBid}
            showModalBox={this.showModalBox}
            rejectOrder={this.rejectOrder}
            orders={this.state.orders}
            biddedOrders={this.state.biddedOrders}
          />
          {/**** APPROVED ORDERS SECTION  ******/}
          <ApprovedOrdersBar
            showModalBox={this.showModalBox}
            setBidOrderReady={this.setBidOrderReady}
            approvedTimedOrders={this.state.approvedTimedOrders}
            l={this.state.approvedTimedOrders.length}
            acceptBid={this.state.acceptBid}
          />
          {/**** PICKUP ORDERS SECTION  ******/}
          <ReadyOrdersBar
            readyOrder={this.state.readyOrder}
            shippedOrder={this.state.shippedOrder}
            showModalBox={this.showModalBox}
          />
        </View>

        {/*Modal Section*/}

        <View
          //onBackdropPress={this.closeModalBox}
          onRequestClose={this.closeModalBox}
          style={[
            mStyle.modalMainContainerStyle,
            {display: this.state.isShowModal ? 'flex' : 'none'},
          ]}>
          <Animated.View
            style={{
              marginTop: this.state.modalMarginTop,
              opacity: this.state.modalOpacity,
            }}>
            {this.state.isShowModal ? this.loadModalBoxContent() : null}
          </Animated.View>
        </View>

        {/*Activity Indicator Panel Section*/}

        <View
          style={[
            {
              display: this.state.indicatorDisplay ? 'flex' : 'none',
              width: this.state.indicatorSizeW,
              height: this.state.indicatorSizeH,
            },
            mStyle.activityIndicatorPanelStyle,
          ]}>
          <ActivityIndicator
            animating={this.state.indicatorDisplay}
            size="large"
            color={c_loading_icon}
          />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: perfectSize(500),
            top: screenHeight / 2 + perfectSize(500) / 2,
            right: screenWidth / 2 + perfectSize(500) / 2,
            height: perfectSize(500),
          }}></View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: perfectSize(500),
            top: '40%',
            right: '40%',
            height: perfectSize(500),
          }}>
          <LottieView
            ref={animation => {
              this.successAnimation = animation;
            }}
            style={{display: this.state.animationSuccessPlay ? 'flex' : 'none'}}
            resizeMode="cover"
            progress={this.state.successAnimationProgress}
            source={require('../../resource/animations/success.json')}
          />
        </View>
        {this.state.showGetPaidModal && (
          <GetPaidModal
            handleShowGetPaidModal={this.handleShowGetPaidModal}
            play_success_animation={() => this.toggleSuccessAnimation()}
          />
        )}
      </View>
    );
  }
}

export default pure(DashBoardScreen);
