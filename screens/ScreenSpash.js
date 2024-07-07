import * as React from 'react';
import {View, Image, Dimensions, ActivityIndicator, Alert} from 'react-native';
import * as RNLocalize from 'react-native-localize';
import {
  c_loading_icon,
  bg_dark,
  greyHasOpacity,
  key_user_info,
  rq_get_active_order_requests,
} from '../resource/BaseValue';
import {DashboardScreenName, LoginScreenName} from '../src/constants/Routes';
import {UserContext} from '../resource/auth/UserContext';
import {getPerfectSize} from '../resource/LanguageSupport';
import {getData, makeAPostRequest, saveData} from '../resource/SupportFunction';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indicatorSizeW: 0,
      indicatorSizeH: 0,
      indicatorDisplay: false,
    };
  }
  static contextType = UserContext;

  componentDidMount() {
    // const {loggedIn, setLoggedIn} = this.context;
    // RNLocalize.addEventListener('change', () => {
    //   // do localization related stuff…
    // });

    setTimeout(() => {
      getData(key_user_info, value => {
        if (value != '') {
          let jsonInfo = JSON.parse(value);
          if (jsonInfo.token != '') {
            let dataObj = {
              request: rq_get_active_order_requests,
              token: jsonInfo.token,
            };
            makeAPostRequest(
              dataObj,
              () => this._showLoadingBox(),
              () => this._closeLoadingBox(),
              (isSuccess, responseJson) => {
                if (isSuccess) {
                  // setLoggedIn(true);
                  this.props.navigation.navigate(DashboardScreenName);
                } else {
                  this.props.navigation.navigate(LoginScreenName);
                }
              },
            );
          } else {
            this.props.navigation.navigate(LoginScreenName);
          }
        } else {
          this.props.navigation.navigate(LoginScreenName);
        }
      });
    }, 2000);
  }

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

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg_dark,
        }}>
        <Image
          source={require('../image/splash_logo.png')}
          resizeMode="contain"
          style={{
            alignSelf: 'center',
            width: getPerfectSize()(502),
            height: getPerfectSize()(134.7),
            marginBottom: 30,
          }}
        />
        <View
          style={{
            width: this.state.indicatorSizeW,
            height: this.state.indicatorSizeH,
            backgroundColor: greyHasOpacity,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}>
          <ActivityIndicator
            animating={this.state.indicatorDisplay}
            size="large"
            color={c_loading_icon}
          />
        </View>
      </View>
    );
  }
}

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
