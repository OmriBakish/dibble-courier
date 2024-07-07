import {View, Text} from 'react-native';
import {globalStyles} from '../../resource/style/global';
import React, {Component} from 'react';
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {c_text_grey} from '../../resource/BaseValue';
import moment from 'moment';
let langObj = getLanguage();
let perfectSize = getPerfectSize();
export default class clockAndDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour_string: '',
      date_string: '',
      day_string: '',
      days: [
        'dayOne',
        'dayTwo',
        'dayThree',
        'dayFour',
        'dayFive',
        'daySix',
        'daySeven',
      ],
    };
  }
  componentDidMount() {
    var timer_interval = setInterval(this.updateTime, 1000);
    var date_update_interval = setInterval(() => {
      this.updateDate();
    }, 600000);
    this.updateDate();
    this.updateTime();
  }

  updateTime = () => {
    this.setState({hour_string: this.getTime()});
  };
  updateDate = () => {
    this.setState({
      date_string: moment(Date()).format('DD.MM.YYYY'),
      day_string: langObj[this.state.days[this.getDay()]],
    });
  };
  getTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleTimeString('en-GB');
  };
  getDay = () => {
    const currentDate = new Date();
    return currentDate.getDay();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'space-between',
          width: perfectSize(650),
        }}>
        <Text
          style={[
            globalStyles.textAlmoniDLAAA_65,
            {letterSpacing: -3, paddingLeft: 1, color: c_text_grey},
          ]}>
          {this.state.date_string + ', ' + this.state.day_string}
        </Text>
        <View style={{marginStart: perfectSize(90)}} />
        <Text style={[globalStyles.textAlmoniDLAAA_65, {color: c_text_grey}]}>
          {this.state.hour_string}
        </Text>
      </View>
    );
  }
}
