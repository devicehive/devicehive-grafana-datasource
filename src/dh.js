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
            if (messageData.status === `success`){
              switch (messageData.action) {
              case `token` : 
                return this.__tokenMessage(messageData)
                .then((accessToken) => this.__authenticate(accessToken));
              case `authenticate`:
                return console.log(`authenticated`);
              }
            } else {
              console.log(messageData);
              throw new Error(`Websocket error`);
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

  queryData(type, deviceId, dateRange, dataPath){
    return new Promise((resolve) => {
      this.__socket.send(JSON.stringify({
        action : `${type}/list`,
        deviceId : deviceId,
        start : moment(dateRange.from).format(`YYYY-MM-DD[T]HH:mm:ss.SSS`),
        end : moment(dateRange.to).format(`YYYY-MM-DD[T]HH:mm:ss.SSS`)
      }));

      const commandNotificationHandler = (event) => {
        const messageData = JSON.parse(event.data);
        if (messageData.action === `${type}/list`) {
          console.log(messageData);
          this.__socket.removeEventListener(`message`, commandNotificationHandler);
          const types = messageData[`${type}s`];
          const points = types.map(item => [this.__extractValue(item, dataPath), Date.parse(item.timestamp)])
          resolve({ 
            data : [
              {
                target : type,
                datapoints : points
              }
            ]
          });
        }
      }

      this.__socket.addEventListener(`message`, commandNotificationHandler)
    });
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
    const fields = path.split(`.`);
    fields.forEach(field => {
      if (current[field] !== undefined){
        current = current[field];
      }
    })
    return current;
  }
}