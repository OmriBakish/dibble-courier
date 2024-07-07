import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {getPerfectSize} from '../../resource/LanguageSupport';
import {
  bg_white,
  c_orange,
  c_text_white,
  greyHasOpacity,
  key_user_info,
  rq_get_revenue,
  sub_key_business_name,
  sub_key_token,
} from '../../resource/BaseValue';
import {globalStyles} from '../../resource/style/global';
import getLanguage from '../../resource/LanguageSupport';

import profile from '../../image/Person.png';
import bg from '../../image/d_coin_bg.png';
import close_btn from '../../src/assets/icons/close_btn.png';
import {
  getDataWithSubKey,
  makeAPostRequest,
} from '../../resource/SupportFunction';
import moment from 'moment/moment';

let langObj = getLanguage();
let today = moment().clone().format('YYYY-MM-DD');
let month_start = moment().clone().startOf('month').format('YYYY-MM-DD');

const GetPaidModal = ({handleShowGetPaidModal, play_success_animation}) => {
  const options = [
    {
      title: 'תוך יום עסקים',
      percentage: '5%',
    },
    {
      title: 'עד חמישה ימי עסקים',
      percentage: '3%',
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceToReceive, setBalanceToReceive] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    getSupplierRevenue();
    getSupplierName();
  }, []);

  const formatNumber = number => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleSelectedToggle = percentage => {
    let totalBalance = 0;
    if (percentage === '5%') {
      totalBalance = balance * 0.95;
    } else if (percentage === '3%') {
      totalBalance = balance * 0.97;
    }
    setBalanceToReceive(totalBalance);
  };

  const handleSendForm = () => {
    const selectedOption = options[selectedIndex];
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const message = `
<br>
ספק: ${name}
<br>
מועד הבקשה: ${timestamp}
<br>
סכום נוכחי: ${formatNumber(balance)}
<br>
עמלה: ${selectedOption.percentage}
<br>
מועד ההעברה: ${selectedOption.title}
<br>
סכום סופי להעברה: ${formatNumber(balanceToReceive)}`;

    let dataObj = {
      request: 'send_mail',
      to_email: 'SuppliersBilling@dibble.co.il',
      from_email: 'office@dibble.co.il',
      from_name: 'בקשה להקדמת תשלום',
      subject: `בקשה להקדמת תשלום - ${name}`,
      message: message,
    };
    makeAPostRequest(
      dataObj,
      () => {
        handleShowGetPaidModal(false);
        play_success_animation();
      },
      () => {
        // this._closeLoadingBox();
      },
      (isSuccess, responseJson) => {
        if (isSuccess) {
          console.log('Success');
        } else {
          console.log('Failed');
        }
      },
    );
  };

  const getSupplierRevenue = () => {
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      let dataObj = {
        request: rq_get_revenue,
        token: token,
        filter_from_date: month_start,
        filter_to_date: today,
      };
      makeAPostRequest(
        dataObj,
        () => {},
        () => {},
        (isSuccess, responseJson) => {
          if (isSuccess) {
            setBalance(responseJson.total_revenue);
          }
        },
      );
    });
  };

  const getSupplierName = () => {
    getDataWithSubKey(key_user_info, sub_key_business_name, name => {
      setName(name);
    });
  };

  return (
    <View style={styles.modal}>
      <ImageBackground
        style={styles.background}
        source={bg}
        imageStyle={{
          resizeMode: 'contain',
          position: 'absolute',
          top: 0,
          bottom: '45%',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99,
          }}
          onPress={() => handleShowGetPaidModal(false)}>
          <Image source={close_btn} style={{width: 20}} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.content}>
          <Image source={profile} style={styles.profile} resizeMode="contain" />
          <Text style={styles.title}>בקשה להקדמת תשלום</Text>
          <Text style={styles.subTitle}>
            יתרה זמינה למשיכה: {formatNumber(balance)}{' '}
          </Text>
          <View style={styles.toggleContainer}>
            {options.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.toggle,
                    {
                      marginStart: 10,
                      borderColor:
                        selectedIndex === index ? '#FFCA1A' : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedIndex(index);
                    handleSelectedToggle(item.percentage);
                  }}>
                  <Text style={styles.ToggleTitle}>{item.title}</Text>
                  <Text style={styles.TogglePercentage}>{item.percentage}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.subTitle}>
            סה״כ לקבלה: {formatNumber(balanceToReceive)}{' '}
          </Text>
          <TouchableOpacity
            style={[
              styles.orderReadyButtonContainer,
              {
                backgroundColor: selectedIndex === null ? '#BDBCBC' : '#FFCA1A',
              },
            ]}
            disabled={selectedIndex === null}
            onPress={() => handleSendForm()}>
            <Text style={[globalStyles.textGeneral, {color: c_text_white}]}>
              {selectedIndex === null ? langObj.chooseOption : langObj.continue}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: greyHasOpacity,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 200,
  },
  background: {
    width: '100%',
    backgroundColor: bg_white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  profile: {
    width: 100,
    height: 120,
    marginVertical: 15,
  },
  title: {
    fontFamily: 'OscarFM-Regular',
    fontSize: 30,
    letterSpacing: -1,
    color: '#707070',
    marginBottom: 5,
    backgroundColor: c_text_white,
  },
  subTitle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 25,
    letterSpacing: -0.6,
    color: '#000',
    marginBottom: 5,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 15,
  },
  toggle: {
    display: 'flex',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 60,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ToggleTitle: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 20,
    letterSpacing: -1,
    color: '#000',
    fontWeight: '600',
  },
  TogglePercentage: {
    fontFamily: 'AlmoniDLAAA',
    fontSize: 35,
    letterSpacing: -1,
    color: '#000',
  },
  orderReadyButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 300,
    borderRadius: 4,
    color: '#ffffff',
    // backgroundColor: '#FFCA1A',
  },
});

export default GetPaidModal;
