import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {
  greyHasOpacity,
  key_user_info,
  rq_get_revenue,
  sub_key_business_name,
  sub_key_token,
} from '../../resource/BaseValue';
import getLanguage from '../../resource/LanguageSupport';

import bg from '../../image/d_coin_bg.png';

import CloseBtn from '../../src/assets/icons/closeIcon.svg';
import PersonIcon from '../../src/assets/icons/person.svg';

import {
  getDataWithSubKey,
  makeAPostRequest,
} from '../../resource/SupportFunction';
import moment from 'moment/moment';
import {COLORS, FONTS, SHADOWS, SIZES} from '../../src/constants/theme';
import CustomButton from '../CustomButton/CustomButton';

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
          <CloseBtn width={20} height={20} />
        </TouchableOpacity>
        <View style={styles.content}>
          <PersonIcon width={100} height={120} />
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
          <CustomButton
            text={
              selectedIndex === null ? langObj.chooseOption : langObj.continue
            }
            inputValidation={selectedIndex === null ? false : true}
            onPress={() => handleSendForm()}
            style={{marginTop: SIZES.space24}}
          />
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
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.cardsAndButtons,
  },
  content: {
    padding: SIZES.space24,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h1,
    color: COLORS.ParagraphGray,
    marginBottom: SIZES.space4,
    backgroundColor: COLORS.white,
  },
  subTitle: {
    ...FONTS.body1,
    marginBottom: SIZES.space4,
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: SIZES.space16,
  },
  toggle: {
    display: 'flex',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 60,
    borderWidth: 3,
    ...SHADOWS.button,
  },
  ToggleTitle: {
    ...FONTS.body1,
    ...FONTS.fontBold,
  },
  TogglePercentage: {
    ...FONTS.body1,
  },
  orderReadyButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 300,
    borderRadius: SIZES.radius,
    color: COLORS.white,
  },
});

export default GetPaidModal;
