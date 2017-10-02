import moment from 'moment';

export default class DeviceHiveClient {
  /**
   * Creates an instance of DeviceHiveClient.
   * @param {Object} { login, password, serverURL, token } 
   * @memberof DeviceHiveClient
   */
  constructor({ login, password, serverURL, token }){
    if (serverURL && ((login && password) || token )) {
      this.__socket = new WebSocket(serverURL);
      this.authInfo = {
        login,
        password,
        token
      };
      return new Promise((resolve) => {
        this.__socket.addEventListener(`open`, (event) => {
          resolve(this);
        })
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
  createTokenPair(login, password){
    this.__socket.send(JSON.stringify({
      action : `token`,
      login,
      password
    }));
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
      const commandNotificationHandler = (event) => {
        const messageData = JSON.parse(event.data);
        const actions = messageData.action.split(`/`);
        if (types.includes(actions[0]) && actions[1] === `list`){
          request--;
          const datas = messageData[`${actions[0]}s`];
          extractedTargets[actions[0]].forEach(({ path, scale, refId }) => {
            if (!path.includes(`Orient`)){
              const points = [];
              datas.forEach(data => {
                if (typeof this.__extractValue(data, path) !== `object`){
                  points.push([this.__extractValue(data, path) * scale, +moment.utc(data.timestamp).format(`x`)]);
                }
              });
              points.sort((a, b) => a[1] - b[1]);
              results.push({
                target : `${actions[0]}${refId}`,
                datapoints : points
              })
            } else {
              const pointsX = [];
              const pointsY = [];
              const pointsZ = [];
              datas.forEach(data => {
                if (typeof this.__extractValue(data, path) !== `object`){
                  const [azimuth, roll, pitch] = this.__extractValue(data, path).split(`,`).map(value => +value);
                  pointsX.push([azimuth, +moment.utc(data.timestamp).format(`x`)]);
                  pointsY.push([pitch, +moment.utc(data.timestamp).format(`x`)]);
                  pointsZ.push([roll, +moment.utc(data.timestamp).format(`x`)]);
                }
              });
              pointsX.sort((a, b) => a[1] - b[1]);
              pointsY.sort((a, b) => a[1] - b[1]);
              pointsZ.sort((a, b) => a[1] - b[1]);

              results.push({
                target : `X`,
                datapoints : [[pointsX[0][0]], [0]]
              });
              results.push({
                target : `Y`,
                datapoints : [[pointsY[0][0]], [0]]
              });
              results.push({
                target : `Z`,
                datapoints : [[pointsZ[0][0]], [0]]
              });
            }
          })
          if (!request){
            this.__socket.removeEventListener(`message`, commandNotificationHandler);
            resolve({
              data : results
            })
          }
        }
      }
      this.__socket.addEventListener(`message`, commandNotificationHandler);
      types.forEach(type => 
        this.__socket.send(JSON.stringify({
          action : `${type}/list`,
          deviceId : deviceId
        }))
      );
    })
  }

  /**
   * Function used to test datasource connection and auth
   * 
   * @returns 
   * @memberof DeviceHiveClient
   */
  testDatasource(){
    return new Promise((resolve, reject) => {
      if (!this.authInfo.token){
        this.createTokenPair(this.authInfo.login, this.authInfo.password);
      } else {
        this.__authenticate(this.authInfo.token);
      }
      const authHandler = (event) => {
        const messageData = JSON.parse(event.data);
        if ((messageData.action === `token` || messageData.action === `authenticate`) && messageData.status === `success`){
          switch (messageData.action) {
          case `token` : 
            return this.__tokenMessage(messageData)
              .then((accessToken) => this.__authenticate(accessToken));
          case `authenticate`:
            this.__socket.removeEventListener(`message`, authHandler);
            return resolve();
          }
        } else {
          if (messageData.status === `error`){
            console.log(messageData);
            this.__socket.removeEventListener(`message`, authHandler);
            reject(messageData);
          }
        }
      }
      this.__socket.addEventListener(`message`, authHandler);
    })
  }

  /**
   * Internal handler on `token` type message
   * 
   * @param {Object} messageData 
   * @returns 
   * @memberof DeviceHiveClient
   */
  __tokenMessage(messageData){
    this.tokens = {
      accessToken : messageData.accessToken,
      refreshToken : messageData.refreshToken
    }
    return Promise.resolve(this.tokens.accessToken);
  }
  
  /**
   * Internal `authenticate` message sender
   * 
   * @param {String} accessToken 
   * @memberof DeviceHiveClient
   */
  __authenticate(accessToken){
    this.__socket.send(JSON.stringify({
      action : `authenticate`,
      token : accessToken
    }));
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
      } else {
        current = null;
      }
    })
    return (typeof current === `string` && !path.includes(`Orient`)) ? +current : current;
  }
}
