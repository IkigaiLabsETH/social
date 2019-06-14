import React, { Component } from 'react';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import { View, Text, Switch } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import Giphy from '../Giphy';
import Theme from '../../theme/styles';
import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
import PriceOracle from '../../services/PriceOracle';
import currentUserModal from '../../models/CurrentUser';
import errorMessage from '../../constants/ErrorMessages';
import utilities from '../../services/Utilities';
import Store from '../../store';
import { showModal, hideModal } from '../../actions';
import appConfig from '../../constants/AppConfig';
import { TOKEN_ID } from '../../constants';
import LoadingModal from '../../components/LoadingModal';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      clearErrors: false,
      server_errors: null,
      isPrivate: false,
      general_error: '',
      btAmount: 1,
      btUSDAmount: null
    };
    this.baseState = this.state;
  }

  defaultVals() {
    //TODO lets see how to optimise this
    this.meta = null;
    this.gify = null;
    this.priceOracle = null;
    this.btSmallestUnit = null;
    this.workflow = null;
  }

  componentWillMount() {
    this.defaultVals();
    this.initPricePoint();
  }

  componentWillUnmount() {
    this.defaultVals();
    this.setState(this.baseState);
  }

  initPricePoint() {
    this.updatePricePoint();
  }

  updatePricePoint(successCallback, errorCallback) {
    const ostUserId = currentUserModal.getOstUserId();
    OstWalletSdk.getToken(TOKEN_ID, (token) => {
      OstJsonApi.getBalanceWithPricePointForUserId(
        ostUserId,
        (res) => {
          this.onGetPricePointSuccess(token, res);
          successCallback && successCallback(res);
        },
        (ostError) => {
          errorCallback && errorCallback(ostError);
        }
      );
    });
  }

  onGetPricePointSuccess(token, res) {
    res = res || {};
    let btUSDAmount = null;
    this.priceOracle = new PriceOracle(token, res.price_point);
    this.btSmallestUnit = this.priceOracle.toDecimal(this.state.btAmount);
    btUSDAmount = this.priceOracle.getBtToFiat(this.btSmallestUnit);
    this.setState({ btUSDAmount: btUSDAmount });
  }

  onGetPricePointError(ostError) {
    this.onError(ostError);
  }

  excequteTransaction() {
    if (!this.isValids()) {
      Alert.alert('', errorMessage.general_error_ex);
      return;
    }
    Store.dispatch(showModal('Executing...'));
    this.sendTransactionToSdk();
  }

  isValids() {
    return !!this.priceOracle;
  }

  sendTransactionToSdk() {
    const user = currentUserModal.getUser();
    const option = { wait_for_finalization: false };
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [user.ost_token_holder_address],
      [this.btSmallestUnit],
      appConfig.ruleTypeMap.directTransfer,
      appConfig.metaProperties,
      this.workflow,
      option
    );
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    this.sendTransactionToPlatfrom(ostWorkflowEntity);
  }

  onFlowInterrupt(ostWorkflowContext, ostError) {
    this.onError(ostError);
  }

  sendTransactionToPlatfrom(ostWorkflowEntity) {
    const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
    new PepoApi('/ost-transactions')
      .post(params)
      .then((res) => {
        if (res && res.success) {
          this.onTransactionSuccess(res);
        } else {
          this.onError(res);
        }
      })
      .catch((error) => {
        this.onError(error);
      });
  }

  onTransactionSuccess(res) {
    Store.dispatch(hideModal());
    utilities.showAlert('', 'TODO confrim what to do on transaction success');
  }

  getSendTransactionPlatformData(ostWorkflowEntity) {
    return {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id'),
      privacy_type: this.getPrivacyType(),
      meta: {
        text: this.state.message,
        giphy: this.gify
      }
    };
  }

  getPrivacyType() {
    return this.state.isPrivate
      ? appConfig.executeTransactionPrivacyType.private
      : appConfig.executeTransactionPrivacyType.public;
  }

  onError(ostError) {
    const errorMsg = utilities.getErrorMessage(ostError);
    this.setState({ general_error: errorMsg });

    Store.dispatch(hideModal());
    utilities.showAlert('', errorMsg);
  }

  clearErrors() {
    this.setState({ clearErrors: false, server_errors: null });
  }

  onGifySelect(gify) {
    this.gify = gify;
    console.log('gify', gify);
  }

  onBtChange(bt) {
    console.log('onBtChange', bt);
  }

  onUSDChange(usd) {
    console.log('onUSDChange', usd);
  }

  render() {
    return (
      <View style={styles.container}>
        <Giphy
          onGifySelect={(gify) => {
            this.onGifySelect(gify);
          }}
        />

        <Text>+ Add Message</Text>

        <FormInput
          editable={true}
          onChangeText={(message) => this.setState({ message: message })}
          placeholder="Message"
          fieldName="message"
          style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
          value={this.state.message}
          returnKeyType="done"
          returnKeyLabel="done"
          serverErrors={this.state.server_errors}
          clearErrors={this.state.clearErrors}
          placeholderTextColor="#ababab"
        />

        <Switch value={this.state.isPrivate} onValueChange={(isPrivate) => this.setState({ isPrivate })}></Switch>

        <FormInput
          editable={true}
          onKeyPress={(val) => this.onBtChange(val)}
          placeholder="BT"
          fieldName="bt_amount"
          style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
          value={`${this.state.btAmount}`}
          returnKeyType="next"
          returnKeyLabel="next"
          serverErrors={this.state.server_errors}
          clearErrors={this.state.clearErrors}
          placeholderTextColor="#ababab"
          keyboardType="numeric"
        />

        <FormInput
          editable={true}
          onKeyPress={(val) => this.onUSDChange(val)}
          placeholder="USD"
          fieldName="usd_amount"
          style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
          value={`${this.state.btUSDAmount}`}
          returnKeyType="done"
          returnKeyLabel="done"
          serverErrors={this.state.server_errors}
          clearErrors={this.state.clearErrors}
          placeholderTextColor="#ababab"
          keyboardType="numeric"
        />

        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', marginBottom: 30 }}>
          <TouchableButton
            TouchableStyles={[Theme.Button.btnPrimary, { flex: 10, marginRight: 10 }]}
            TextStyles={[Theme.Button.btnPrimaryText]}
            text="Send P1"
            onPress={() => this.excequteTransaction()}
          />
        </View>
        <LoadingModal />
      </View>
    );
  }
}

export default TransactionScreen;
