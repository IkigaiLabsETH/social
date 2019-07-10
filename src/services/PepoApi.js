import AssignIn from 'lodash/assignIn';
import DeepGet from 'lodash/get';
import qs from 'qs';
import NetInfo from '@react-native-community/netinfo';
import Package from '../../package';
import { Platform } from 'react-native';
import { Toast } from 'native-base';

import Store from '../store';
import {
  hideModal,
  upsertUserEntities,
  upsertTransactionEntities,
  upsertGiffyEntities,
  upsertFeedEntities,
  upsertTagEntities,
  upsertUserProfileEntities,
  upsertUserStatEntities,
  upsertLinkEntities,
  upsertVideoEntities,
  upsertVideoStatEntities,
  upsertImageEntities,
  upsertHomeFeedEntities
} from '../actions';
import { API_ROOT } from '../constants/index';
import CurrentUser from '../models/CurrentUser';

import { ostErrors, UIWhitelistedErrorCode } from './OstErrors';

export default class PepoApi {
  constructor(url, params = {}) {
    this.url = url;
    this.params = params;
    this.defaultParams = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this._getUserAgent()
      }
    };
    this._cleanUrl();
    this._parseParams();
  }

  get(q = '') {
    let query = typeof q !== 'string' ? qs.stringify(q) : q;
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'GET'
    });
    this.cleanedUrl += query.length > 0 ? (this.cleanedUrl.indexOf('?') > -1 ? `&${query}` : `?${query}`) : '';

    return this._perform();
  }

  post(body = '') {
    body = typeof body !== 'string' ? JSON.stringify(body) : body;
    this.parsedParams = AssignIn(this.parsedParams, {
      method: 'POST',
      body
    });
    return this._perform();
  }

  _cleanUrl() {
    this.cleanedUrl = this.url.startsWith('http') ? this.url : `${API_ROOT}${this.url}`;
  }

  _parseParams() {
    this.parsedParams = AssignIn(this.defaultParams, this.params);
  }

  _getUserAgent() {
    let name = Package.name,
      appVersion = Package.version,
      rnVersion = Package.dependencies['react-native'],
      os = Platform.OS,
      osVersion = Platform.Version,
      envDev = __DEV__ === true;
    return `${os} ${osVersion}; RN ${rnVersion}; ${name} ${appVersion}; envDev ${envDev}`;
  }

  _dispatchData(responseJSON) {
    const resultType = DeepGet(responseJSON, 'data.result_type');

    if (!resultType) {
      return;
    }
    const data = DeepGet(responseJSON, 'data'),
      resultData = DeepGet(responseJSON, `data.${resultType}`);
    switch (resultType) {
      case 'users':
        Store.dispatch(upsertUserEntities(this._getEntities(resultData)));
        break;
      case 'public_feed':
      case 'user_feed':
        Store.dispatch(upsertUserEntities(this._getEntitiesFromObj(data['users'])));
        Store.dispatch(upsertTransactionEntities(this._getEntitiesFromObj(data['ost_transaction'])));
        Store.dispatch(upsertGiffyEntities(this._getEntitiesFromObj(data['gifs'])));
        Store.dispatch(upsertFeedEntities(this._getEntities(resultData)));
        break;
      case 'feeds': 
        Store.dispatch(upsertUserEntities(this._getEntitiesFromObj(data['users'])));
        Store.dispatch(upsertTagEntities(this._getEntitiesFromObj(data['tags'])));
        Store.dispatch(upsertUserProfileEntities(this._getEntitiesFromObj(data['user_profiles'])));
        Store.dispatch(upsertUserStatEntities(this._getEntitiesFromObj(data['user_stats'])));
        Store.dispatch(upsertLinkEntities(this._getEntitiesFromObj(data['links'])));
        Store.dispatch(upsertVideoEntities(this._getEntitiesFromObj(data['videos'])));
        Store.dispatch(upsertVideoStatEntities(this._getEntitiesFromObj(data['video_details'])));
        Store.dispatch(upsertImageEntities(this._getEntitiesFromObj(data['images'])));
        Store.dispatch(upsertHomeFeedEntities(this._getEntities(resultData)));
        //TODO add 2 new entities 
        break;
    }
  }

  _getIDList(resultData, key = 'id') {
    return resultData.map((item) => item[key]);
  }

  _getIDListFromObj(resultObj) {
    return Object.keys(resultObj);
  }

  _getEntities(resultData, key = 'id') {
    const entities = {};
    resultData.forEach((item) => {
      entities[`${key}_${item[key]}`] = item;
    });
    return entities;
  }

  _getEntitiesFromObj(resultObj, key = 'id') {
    const entities = {};
    for (let identifier in resultObj) {
      entities[`${key}_${identifier}`] = resultObj[identifier];
    }
    return entities;
  }

  _perform() {
    return new Promise(async (resolve, reject) => {
      try {
        let netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          console.log(`Error requesting ${this.cleanedUrl}. ${ostErrors.getUIErrorMessage('no_internet')}`);
          Toast.show({
            text: ostErrors.getUIErrorMessage('no_internet'),
            buttonText: 'Okay'
          });
          throw UIWhitelistedErrorCode['no_internet'];
        }

        let t1 = Date.now();
        console.log(`Requesting ${this.cleanedUrl} with options:`, this.parsedParams);

        let response = await fetch(this.cleanedUrl, this.parsedParams),
          responseStatus = parseInt(response.status),
          responseJSON = await response.json();

        let t2 = Date.now();
        console.log(
          `Response for ${this.cleanedUrl} resolved in ${t2 - t1} ms, Status: ${responseStatus}, JSON payload:`,
          responseJSON
        );

        this._dispatchData(responseJSON);

        switch (responseStatus) {
          case 401:
            CurrentUser.logout(responseJSON);
            Store.dispatch(hideModal());
            break;
          case 404:
            Store.dispatch(hideModal());
            break;
          case 500:
            Store.dispatch(hideModal());
            Toast.show({
              text: ostErrors.getUIErrorMessage('general_error'),
              buttonText: 'Okay'
            });
            break;
        }

        return resolve(responseJSON);
      } catch (err) {
        console.log('Fetch exception', err);
        return reject(err);
      }
    });
  }
}
