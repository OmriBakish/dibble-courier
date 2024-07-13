import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import getLanguage from '../../resource/LanguageSupport';
import moment from 'moment';
import {FONTS} from '../../src/constants/theme';

const langObj = getLanguage();

const ClockAndDate = () => {
  const [hourString, setHourString] = useState('');
  const [dateString, setDateString] = useState('');
  const [dayString, setDayString] = useState('');
  const days = [
    'dayOne',
    'dayTwo',
    'dayThree',
    'dayFour',
    'dayFive',
    'daySix',
    'daySeven',
  ];

  useEffect(() => {
    const updateTime = () => {
      setHourString(getTime());
    };

    const updateDate = () => {
      const currentDate = new Date();
      setDateString(moment(currentDate).format('DD.MM.YYYY'));
      setDayString(langObj[days[currentDate.getDay()]]);
    };

    const timerInterval = setInterval(updateTime, 1000);
    const dateUpdateInterval = setInterval(updateDate, 600000);

    updateDate();
    updateTime();

    return () => {
      clearInterval(timerInterval);
      clearInterval(dateUpdateInterval);
    };
  }, []);

  const getTime = () => {
    const currentDate = new Date();
    return currentDate.toLocaleTimeString('en-GB');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{dayString + ', ' + dateString}</Text>
      <Text style={styles.text}>{hourString}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  text: {
    ...FONTS.body1,
  },
});

export default ClockAndDate;
