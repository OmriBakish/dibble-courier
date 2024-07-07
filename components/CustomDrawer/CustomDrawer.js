import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import DeviceInfo from 'react-native-device-info';
import {UserContext} from '../../resource/auth/UserContext';
import {
  getDataWithSubKey,
  openIntercomChat,
  thousandsFilter,
  makeAPostRequest,
} from '../../resource/SupportFunction';
import {
  key_user_info,
  rq_get_revenue,
  sub_key_token,
  sub_key_business_name,
  sub_key_logo,
} from '../../resource/BaseValue';

import CloseBtn from '../../src/assets/icons/closeIcon.svg';

const BalanceRow = ({label, value}) => (
  <View style={styles.balanceWrapper}>
    <Text style={styles.balanceText}>{label}</Text>
    <Text style={styles.balanceText}>{value}</Text>
  </View>
);

const logout = (props, setLoggedIn) => {
  getDataWithSubKey(key_user_info, sub_key_token, token => {
    const dataObj = {
      request: 'logout',
      token,
    };
    makeAPostRequest(dataObj, isSuccess => {
      if (isSuccess) {
        AsyncStorage.removeItem(key_user_info);
        setLoggedIn(false);
        props.navigation.navigate('Login');
      }
    });
  });
};

const CustomDrawerContent = props => {
  const {state, descriptors, ...rest} = props;
  const {loggedIn, setLoggedIn, updateRevenu, setUpdateRevenu, setModalOpen} =
    useContext(UserContext);
  const [logo, setLogo] = useState('');
  const [name, setName] = useState('');
  const [revenue, setRevenu] = useState('');
  const [totalSales, setTotalSales] = useState('');
  const [numOfOrders, setNumOfOrders] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().setDate(1))
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    if (loggedIn) {
      updateData();
    } else {
      resetData();
    }
  }, [loggedIn, updateRevenu]);

  const updateData = async () => {
    getDataWithSubKey(key_user_info, sub_key_logo, setLogo);
    getDataWithSubKey(key_user_info, sub_key_business_name, setName);
    getDataWithSubKey(key_user_info, sub_key_token, token => {
      const dataObj = {
        request: rq_get_revenue,
        token: token,
        filter_from_date: monthStart,
        filter_to_date: today,
      };

      makeAPostRequest(
        dataObj,
        () => {},
        () => {},
        (isSuccess, responseJson) => {
          if (isSuccess) {
            console.log('responseJson', responseJson);
            setRevenu(responseJson.total_revenue);
            setTotalSales(responseJson.total_sales);
            setNumOfOrders(responseJson.num_of_orders);
            setTotalPayment(responseJson.total_payments);
          } else {
            console.log('Failed to fetch get_revenue', responseJson);
          }
        },
      );
    });
  };

  const resetData = () => {
    setLogo('');
    setName('');
    setRevenu('');
    setTotalSales('');
    setNumOfOrders('');
    setTotalPayment('');
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{flex: 1}}>
      <View style={styles.mainViewDrawer}>
        <TouchableOpacity
          style={styles.drawerXStyle}
          onPress={() => props.navigation.closeDrawer()}>
          <CloseBtn width={20} height={20} />
        </TouchableOpacity>
        <View style={styles.logoAndNameContainer}>
          <View style={styles.logoImageWrapper}>
            {logo ? (
              <Image
                source={{uri: logo}}
                style={styles.logoImageStyle}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.logoPlaceholder} />
            )}
          </View>
          <Text numberOfLines={1} style={styles.companyName}>
            {name}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.balanceContainer}>
          <BalanceRow label="סה״כ הזמנות:" value={numOfOrders} />
          <BalanceRow
            label="סה״כ יתרות:"
            value={totalSales ? thousandsFilter(totalSales) : 0}
          />
          <BalanceRow
            label="סה״כ משיכות:"
            value={totalPayment ? thousandsFilter(totalPayment) : 0}
          />
          <BalanceRow
            label="יתרה זמינה למשיכה:"
            value={revenue ? thousandsFilter(revenue) : 0}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
          <DrawerItem label="תנאי השימוש" onPress={() => setModalOpen(true)} />
          <DrawerItem label="Support" onPress={openIntercomChat} />
          <DrawerItem
            label="Logout"
            onPress={() => logout(props, setLoggedIn)}
          />
          <Text style={styles.versionText}>
            מספר גירסה: {DeviceInfo.getVersion()}.{DeviceInfo.getBuildNumber()}
          </Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  mainViewDrawer: {flex: 1},
  drawerXStyle: {
    alignSelf: 'flex-end',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAndNameContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImageStyle: {height: 120, width: 350},
  logoPlaceholder: {height: 120, width: 350, backgroundColor: '#f0f0f0'},
  companyName: {
    color: '#46474b',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#46474b',
    marginHorizontal: 12,
    justifyContent: 'center',
    opacity: 0.2,
  },
  balanceContainer: {paddingVertical: 4},
  balanceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 14,
  },
});

export default CustomDrawerContent;
