import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView, Modal, I18nManager, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

import SplashScreen from './screens/ScreenSpash';
import LoginScreen from './screens/ScreenLogin';
import DashBoardScreen from './screens/ScreenDashBoard/ScreenDashBoard';
import ScreenOrderHistory from './screens/ScreenOrderHistory/ScreenOrderHistory';
import ScreenInvoice from './screens/ScreenInvoice/ScreenInvoice';
import ScreenTermsOfService from './screens/ScreenTermsOfService';

import {isForceRTL, key_restart_for_rtl} from './resource/BaseValue';
import {
  LoginScreenName,
  OrdersHistoryName,
  SplashScreenName,
  DashboardScreenName,
  CheckInfoScreenName,
} from './src/constants/Routes';

import {UserProvider, UserContext} from './resource/auth/UserContext';
import {FONTS} from './src/constants/theme';
import CustomDrawerContent from './components/CustomDrawer/CustomDrawer';

const Drawer = createDrawerNavigator();

const MainApp = React.memo(({setModalVisible}) => {
  useEffect(() => {
    const restartRTL = async () => {
      if (I18nManager.isRTL || isForceRTL) {
        I18nManager.forceRTL(true);
        const isRestarted = await AsyncStorage.getItem(key_restart_for_rtl);
        if (isRestarted == null) {
          await AsyncStorage.setItem(key_restart_for_rtl, '1');
          RNRestart.Restart();
        }
      } else {
        I18nManager.forceRTL(false);
      }
    };
    restartRTL();
  }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={SplashScreenName}
        drawerContent={props => (
          <CustomDrawerContent {...props} setModalVisible={setModalVisible} />
        )}
        screenOptions={{
          drawerActiveTintColor: '#ffe8bc',
          drawerActiveBackgroundColor: '#ffe8bc',
          drawerLabelStyle: {
            color: '#46474b',
            ...FONTS.body1,
          },
        }}>
        <Drawer.Screen
          name={DashboardScreenName}
          component={DashBoardScreen}
          options={{
            headerShown: false,
            drawerHideStatusBarOnOpen: true,
            drawerStatusBarAnimation: 'fade',
          }}
        />
        <Drawer.Screen
          name={OrdersHistoryName}
          component={ScreenOrderHistory}
          options={{
            headerShown: false,
            drawerHideStatusBarOnOpen: true,
          }}
          initialParams={{refresh: true}}
        />
        <Drawer.Screen
          name={CheckInfoScreenName}
          component={ScreenInvoice}
          options={{
            headerShown: false,
            drawerHideStatusBarOnOpen: true,
          }}
          initialParams={{refresh: true}}
        />
        <Drawer.Screen
          name={LoginScreenName}
          component={LoginScreen}
          options={{
            headerShown: false,
            drawerHideStatusBarOnOpen: true,
          }}
        />
        <Drawer.Screen
          name={SplashScreenName}
          component={SplashScreen}
          options={{
            headerShown: false,
            drawerHideStatusBarOnOpen: true,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
});

const RootApp = ({environment = 'Development'}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  global.environment = environment;

  return (
    <SafeAreaView style={styles.container}>
      <UserProvider>
        <MainApp setModalVisible={setModalVisible} />
        <MainModal
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      </UserProvider>
    </SafeAreaView>
  );
};

const MainModal = ({isModalVisible, setModalVisible}) => {
  const {setModalOpen} = useContext(UserContext);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isModalVisible}
      onRequestClose={() => {
        setModalOpen(false);
        setModalVisible(false);
      }}>
      <ScreenTermsOfService setModalVisible={setModalVisible} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RootApp;
