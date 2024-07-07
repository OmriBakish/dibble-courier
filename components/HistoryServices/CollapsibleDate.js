import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Easing,
  Text,
  View,
  Animated,
  FlatList,
} from 'react-native';
 
import getLanguage, {getPerfectSize} from '../../resource/LanguageSupport';
import {globalStyles} from '../../resource/style/global';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
 
import pure from 'recompose/pure';
let perfectSize = getPerfectSize();
let langObj = getLanguage();
export const LocaleConfig = {
  monthNames: [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ],
  monthNamesShort: [
    'ינו.',
    'פבר.',
    'מרץ',
    'אפר',
    'מאי',
    'יונ',
    'יטל.',
    'אוג',
    'ספט.',
    'אוקט.',
    'נוב.',
    'דצמ.',
  ],
  dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  dayNamesShort: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
  today: 'היום',
};
const propTypes = {
  children: PropTypes.node,
  contentHeight: PropTypes.number,
  defaultCollapsed: PropTypes.bool,
  style: PropTypes.any,
  title: PropTypes.string,
  useBezier: PropTypes.bool,
};

const defaultProps = {
  contentHeight: 400,
  useBezier: true,
};

function CollapsibleDate({
  children,
  Header,
  contentHeight,
  defaultCollapsed,
  style,
  title,
  useBezier,
  toggleAnimation,
  ...props
}) {
   const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [todayClicked, setTodayClicked] = React.useState(false);

  const cHeight = React.useRef(new Animated.Value(0)).current;
  const cWidth = React.useRef(new Animated.Value(0)).current;

  const [isCollapsed, setCollapsed] = useState(
    defaultCollapsed ? defaultCollapsed : true,
  );
  const onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      setDateTo(date);
    } else {
      setDateFrom(date);
      setDateTo(null);
    }
  };

  React.useEffect(() => {
    Animated.timing(cHeight, {
      toValue: props.is_opened ? contentHeight : 0,
      easing: Easing.bezier(0, 0, 1, 1),
      duration: 300,
      useNativeDriver: false, // <-- Add this
    }).start();

    Animated.timing(cWidth, {
      toValue: props.is_opened ? perfectSize(1000) : 0,
      easing: Easing.bezier(0, 1, 1, 1),
      duration: 400,
      useNativeDriver: false, // <-- Add this
    }).start();
    toggleAnimation();
  }, [props.is_opened]);

  return (
    <TouchableOpacity {...props} style={[styles.card, style]}>
 
      {/* Card Top */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => props.set_is_opened((c) => !c)}
        style={styles.cardTop}>
        {Header}
      </TouchableOpacity>
      {/* Card Contexrnt */}
      <Animated.View
        style={{
          height: cHeight,
           width: cWidth,
 
          borderRadius: perfectSize(20),
          backgroundColor: '#ffffff',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowOffset: {
            width: 0,
            height: 0,
          },
           overflow: 'hidden',

          shadowRadius: perfectSize(15),
          shadowOpacity: 1,
          borderStyle: 'solid',
          alignSelf: 'center',
          borderWidth: props.is_opened ? perfectSize(1) : 0,
          borderColor: '#f1f1f3',
        }}>
        <View style={{flex: 1, padding: perfectSize(50)}}>
          <CalendarPicker
            todayClicked={todayClicked}
            setTodayClicked={setTodayClicked}
            selectedStartDate={dateFrom}
            selectedEndDate={dateTo}
            weekdays={LocaleConfig.dayNames}
            months={LocaleConfig.monthNames}
            startFromMonday={false}
            selectMonthTitle={langObj.chooseMonth}
            selectYearTitle={langObj.chooseYear}
            allowRangeSelection={true}
            todayBackgroundColor="#f2e6ff"
            nextTitle={langObj.next}
            previousTitle={langObj.prev}
            disabledDatesTextStyle={globalStyles.textAlmoniDLAAA_60}
            minDate={new Date('2021-01-01').toDateString()}
            maxDate={new Date().toDateString()}
            allowBackwardRangeSelect={true}
            textStyle={globalStyles.textAlmoniDLAAA_60}
            nextTitleStyle={{
              fontSize: perfectSize(50),
              marginRight: perfectSize(600),
              borderWidth: perfectSize(2),
              padding: perfectSize(10),
            }}
            previousTitleStyle={{
              fontSize: perfectSize(50),
              marginLeft: perfectSize(600),
              borderWidth: perfectSize(2),
              padding: perfectSize(10),
            }}
            selectedDayColor="#ffba02"
            scaleFactor={600}
            selectedDayTextColor="#FFFFFF"
            startFromMonday={false}
            onDateChange={onDateChange}
          />
          {/* <DatePicker
       minimumDate={new Date(2021, 0, 1,1,1)}
        maximumDate={new Date()}
      date={dateFrom}
      mode={'date'}
      locale={'he'}
       onDateChange={setDateFrom}
    />
<Text style={[globalStyles.textAlmoniDLAAA_60]}>עד תאריך</Text>
<View>
<DatePicker 
       minimumDate={new Date(2021, 0, 1,1,1)}
      maximumDate={new Date()}
date={dateTo} mode={'date'} locale={'he'} onDateChange={setDateTo}/>
</View> */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 'auto',
              marginBottom: perfectSize(20),
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                borderRadius: perfectSize(20),
                padding: perfectSize(10),
                marginTop: 10,
              }}
              onPress={() => {
                if (dateTo) {
                  props.set_is_opened((c) => !c);
                  props.confirmDate(dateFrom, dateTo);
                }
 
              }}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_60,
                  {alignSelf: 'center'},
                ]}>
                {langObj.approve}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={{
                marginTop: 10,
                borderRadius: perfectSize(20),
                padding: perfectSize(10),
                marginStart: 10,
              }}
              onPress={() => {
                setDateTo('');
                setDateFrom('');
 
                setCollapsed((c) => !c);
                props.set_is_opened((c) => !c);
                props.confirmDate(null, null);
              }}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_60,
                  {alignSelf: 'center', color: 'red'},
                ]}>
                {langObj.reset}
              </Text>
            </TouchableOpacity>
             <TouchableOpacity
              style={{
                marginTop: 10,
                borderRadius: perfectSize(20),
                padding: perfectSize(10),
                marginStart: 10,
              }}
              onPress={() => {
                setDateTo(moment(new Date()));
                setDateFrom(moment(new Date()));
                setTodayClicked(true);
              }}>
              <Text
                style={[
                  globalStyles.textAlmoniDLAAA_60,
                  {alignSelf: 'center', color: 'green'},
                ]}>
                {langObj.today}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
 
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
 
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

CollapsibleDate.propTypes = propTypes;
CollapsibleDate.defaultProps = defaultProps;

export default CollapsibleDate;
