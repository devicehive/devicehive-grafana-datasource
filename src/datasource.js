import _ from "lodash";
import DeviceHiveClient from './dh';

export class GenericDatasource {

  constructor(instanceSettings, $q) {
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.jsonData = instanceSettings.jsonData;
    this.dhClientPromise = null;
    
    this.q = $q;
    if (instanceSettings.jsonData){
      if (instanceSettings.jsonData.authType === `Login/Password`){
        this.dhClientPromise = new DeviceHiveClient({
          login : instanceSettings.jsonData.auth.login,
          password : instanceSettings.jsonData.auth.password,
          serverURL : instanceSettings.jsonData.serverURL
        })
        .then(dhClient => {
          this.dhClient = dhClient;
        });
      } else if (instanceSettings.jsonData.authType === `Token`){
        this.dhClientPromise = new DeviceHiveClient({
          token : instanceSettings.jsonData.auth.token,
          serverURL : instanceSettings.jsonData.serverURL
        })
        .then(dhClient => {
          this.dhClient = dhClient;
        });
      }
    }
  }

  query(options) {
    return this.dhClient
      .queryData(options.targets, this.jsonData.deviceId, { from : options.range.from._d, to : options.range.to._d })
      .then(result => {
        return result;
      });
  }

  testDatasource() {
    return Promise.resolve({ status : `success`, message : `Data source is working`, title : `Success` });
  }
}
