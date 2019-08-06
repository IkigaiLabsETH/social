import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';

import styles from './styles';
import WalletIcon from '../../assets/profile-wallet-icon.png';
import flyerHOC from '../CommonComponents/FlyerHOC';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Colors from '../../theme/styles/Colors';

class WalletSetupFlyer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.handlePress}>
        <View style={styles.container}>
          <View
            style={{
              width: 46,
              height: 46,
              backgroundColor: Colors.white,
              opacity: 0.9,
              borderRadius: 23,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ProgressCircle size={53} color={Colors.primary} duration={3000} direction="clockwise"></ProgressCircle>
          </View>
          <Image source={WalletIcon} style={{ width: 20, height: 20, position: 'absolute' }} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default flyerHOC(WalletSetupFlyer);
