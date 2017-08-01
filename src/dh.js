import moment from 'moment';

export default class DeviceHiveClient {
  constructor({ login, password, serverURL }){
    if (serverURL && login && password) {
      this.__socket = new WebSocket(serverURL);
      return new Promise((resolve) => {
        this.__socket.addEventListener(`open`, (event) => {
          resolve(this);
          this.createTokenPair(login, password);
          this.__socket.addEventListener(`message`, (event) => {
            const messageData = JSON.parse(event.data);
            if ((messageData.action === `token` || messageData.action === `authenticate`) && messageData.status === `success`){
              switch (messageData.action) {
              case `token` : 
                return this.__tokenMessage(messageData)
                .then((accessToken) => this.__authenticate(accessToken));
              case `authenticate`:
                return console.log(`authenticated`);
              }
            } else {
              if (messageData.status === `error`){
                console.log(messageData);
                throw new Error(`Websocket error`);
              }
            }
          })
        })
      })
    } else {
      throw new Error(`You need to specify URL, login and password`);
    }
  }

  createTokenPair(login, password){
    this.__socket.send(JSON.stringify({
      action : `token`,
      login,
      password
    }));
  }

  queryData(targets, deviceId, dateRange){
    return new Promise((resolve) => {
      const extractedTargets = targets
        .slice(0)
        .reduce((obj, item) => {
          if (!obj[item.type]){
            obj[item.type] = [item.dataPath];
          } else {
            obj[item.type] = [
              ...obj[item.type],
              item.dataPath
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
          extractedTargets[actions[0]].forEach((extractedTarget) => {
            const points = datas.map(data => [this.__extractValue(data, extractedTarget), +moment.utc(data.timestamp).format(`x`)]).sort((a, b) => a[1] - b[1]);
            results.push({
              target : actions[0],
              datapoints : points
            })
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

  __tokenMessage(messageData){
    this.tokens = {
      accessToken : messageData.accessToken,
      refreshToken : messageData.refreshToken
    }
    return Promise.resolve(this.tokens.accessToken);
  }

  __authenticate(accessToken){
    this.__socket.send(JSON.stringify({
      action : `authenticate`,
      token : accessToken
    }));
  }

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