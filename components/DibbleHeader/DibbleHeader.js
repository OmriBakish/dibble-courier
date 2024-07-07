import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import {DibbleHeaderStyle} from './style';
import pure from 'recompose/pure';
import {UserContext} from '../../resource/auth/UserContext';

function DibbleHeader(props) {
  let {loggedIn, setLoggedIn, updateRevenu, setUpdateRevenu} =
    React.useContext(UserContext);

  return (
    <View style={DibbleHeaderStyle.menuContainerStyle}>
      {/* HAMBURGER AND LOGO */}
      <TouchableOpacity
        style={DibbleHeaderStyle.touchableOpacityStyle}
        activeOpacity={1}
        onPress={() => {
          setUpdateRevenu(c => !c);
          props.navigation.toggleDrawer();
        }}>
        <Image
          source={require('../../image/logo_menu.png')}
          resizeMode="contain"
          style={DibbleHeaderStyle.dibbleImageStyle}
        />
        <Image
          source={require('../../image/icon_menu_black.png')}
          resizeMode="contain"
          style={DibbleHeaderStyle.menuHamburgerImageStyle}
        />
      </TouchableOpacity>
    </View>
  );
}
export default pure(DibbleHeader);
