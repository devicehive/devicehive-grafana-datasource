import moment from 'moment';
import sendRequest from './utils';

export default class DeviceHiveClient {
  /**
   * Creates an instance of DeviceHiveClient.
   * @param {Object} { login, password, serverURL, token } 
   * @memberof DeviceHiveClient
   */
  constructor({ login, password, serverURL, token, refresh }){
    if (serverURL && ((login && password) || (token && refresh ))) {
      return new Promise((resolve) => {
        this.serverURL = serverURL;
        if (token && refresh){
          this.access = token;
          this.refresh = refresh;
          resolve(this);
        } else {
          this.__createTokenPair(login, password)
          .then(({ accessToken, refreshToken }) => {
            this.access = accessToken;
            this.refresh = refreshToken;
            resolve(this);
          })
        }
      })
    } else {
      throw new Error(`You need to specify URL, login and password or token`);
    }
  }

  /**
   * Create token pair based on login\password auth
   * 
   * @param {String} login 
   * @param {String} password 
   * @memberof DeviceHiveClient
   */
  __createTokenPair(login, password){
    return sendRequest({
      apiURL : this.serverURL,
      endpoint : `/token`,
      method : `POST`,
      body : {
        login,
        password
      },
      authorize : false
    });
  }

  /**
   * Gets commands or notifications by device
   * 
   * @param {String} deviceId 
   * @param {String} type 
   * @returns 
   * @memberof DeviceHiveClient
   */
  __getCommandsNotifications(deviceId, type){
    return sendRequest({
      apiURL : this.serverURL,
      endpoint : `/device/${deviceId}/${type}`,
      access : this.access
    })
  }

  /**
   * Function to check authorization.
   * 
   * @param {Function} func 
   * @param {Array} args 
   * @returns 
   */
  __callAuthorized(func, ...args){
    return func(...args)
      .catch(error => {
        return this.__refreshToken()
          .then(() => func(...args));
      })
  }

  /**
   * Refresh access token
   * 
   * @returns 
   * @memberof DeviceHiveClient
   */
  __refreshToken(){
    return sendRequest({
      apiURL : this.serverURL,
      endpoint : `/token/refresh`,
      method : `POST`,
      body : {
        refreshToken : this.refresh
      },
      authorize : false
    })
    .then(({ accessToken }) => {
      this.access = accessToken;
      return { accessToken };
    })
  }

  /**
   * Query data by passed params
   * 
   * @param {Array[Object]} targets 
   * @param {String} deviceId 
   * @param {Object} dateRange 
   * @returns 
   * @memberof DeviceHiveClient
   */
  queryData(targets, deviceId, dateRange){
    return new Promise((resolve) => {
      const extractedTargets = targets
        .slice(0)
        .reduce((obj, item) => {
          if (!obj[item.type]){
            obj[item.type] = [{ path : item.dataPath, scale : item.scale === `` ? 1 : item.scale, refId : item.refId }];
          } else {
            obj[item.type] = [
              ...obj[item.type],
              {
                path : item.dataPath,
                scale : item.scale === `` ? 1 : item.scale,
                refId : item.refId
              }
            ];
          }
          return obj;
        }, {});
      const types = Object.keys(extractedTargets);
      const results = [];
      let request = types.length;
      types.forEach(type => {
        this.__callAuthorized(this.__getCommandsNotifications.bind(this), deviceId, type)
        .then(resp => {
          request--;
          extractedTargets[type].forEach(({ path, scale, refId }) => {
            const points = resp.map(data => [this.__extractValue(data, path) * scale, +moment.utc(data.timestamp).format(`x`)]).sort((a, b) => a[1] - b[1]);
            results.push({
              target : `${type}${refId}`,
              datapoints : points
            })
          })
          if (!request){
            resolve({
              data : results
            })
          }
        })
      })
    })
  }

  /**
   * Function used to test datasource connection and auth
   * 
   * @returns 
   * @memberof DeviceHiveClient
   */
  testDatasource(){
    return sendRequest({
      apiURL : this.serverURL,
      endpoint : `/info`,
      authorize : false
    })
  }

  /**
   * Internal function to extract value from object based on path
   * 
   * @param {Object} object 
   * @param {String} path 
   * @returns 
   * @memberof DeviceHiveClient
   */
  __extractValue(object, path){
    let current = object;
    const fields = path.split(/[\.\[\]]/).filter(elem => elem !== ``);
    fields.forEach(field => {
      if (current[field] !== undefined){
        current = current[field];
      }
    })
    return current;
  }
}
