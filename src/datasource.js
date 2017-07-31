import _ from "lodash";
import DeviceHiveClient from './dh';

export class GenericDatasource {

  constructor(instanceSettings, $q) {
    console.log(instanceSettings);
    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.jsonData = instanceSettings.jsonData;
    
    this.q = $q;
    if (instanceSettings.jsonData){
      this.dhClientPromise = new DeviceHiveClient({
        login : instanceSettings.jsonData.auth.login,
        password : instanceSettings.jsonData.auth.password,
        serverURL : instanceSettings.jsonData.serverURL
      })
      .then(dhClient => {
        this.dhClient = dhClient;
      });
    }
  }

  query(options) {
    console.log(options);
    console.log(this.jsonData.deviceId);
    console.log(options.range.from._d);
    console.log(options.range.to._d);
    console.log(options.targets[0].type);
    return this.dhClient
      .queryData(options.targets[0].type, this.jsonData.deviceId, { from : options.range.from._d, to : options.range.to._d }, options.targets[0].dataPath)
      .then(result => {
        console.log(result);
        return result;
      });
  }

  testDatasource() {
    console.log(this);
    // return this.dhClientPromise
    //   .then(dhClient => {
    //     this.dhClient = dhClient;
        return Promise.resolve({ status : `success`, message : `Data source is working`, title : `Success` });
      // });
    // console.log(`aaa`);
    // return Promise.resolve({ status : `success`, message : `Data source is working`, title : `Success` });
  }

  // annotationQuery(options) {
  //   var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
  //   var annotationQuery = {
  //     range: options.range,
  //     annotation: {
  //       name: options.annotation.name,
  //       datasource: options.annotation.datasource,
  //       enable: options.annotation.enable,
  //       iconColor: options.annotation.iconColor,
  //       query: query
  //     },
  //     rangeRaw: options.rangeRaw
  //   };

  //   return this.backendSrv.datasourceRequest({
  //     url: this.url + '/annotations',
  //     method: 'POST',
  //     headers: this.headers,
  //     data: annotationQuery
  //   }).then(result => {
  //     return result.data;
  //   });
  // }

  // metricFindQuery(options) {
  //   var target = typeof (options) === "string" ? options : options.target;
  //   var interpolated = {
  //       target: this.templateSrv.replace(target, null, 'regex')
  //   };

  //   return this.backendSrv.datasourceRequest({
  //     url: this.url + '/search',
  //     data: interpolated,
  //     method: 'POST',
  //     headers: this.headers
  //   }).then(this.mapToTextValue);
  // }

  // mapToTextValue(result) {
  //   return _.map(result.data, (d, i) => {
  //     if (d && d.text && d.value) {
  //       return { text: d.text, value: d.value };
  //     } else if (_.isObject(d)) {
  //       return { text: d, value: i};
  //     }
  //     return { text: d, value: d };
  //   });
  // }

  // buildQueryParameters(options) {
  //   console.log(options);
  //   //remove placeholder targets
  //   options.targets = _.filter(options.targets, target => {
  //     return target.target !== 'select metric';
  //   });

  //   var targets = _.map(options.targets, target => {
  //     return {
  //       target: this.templateSrv.replace(target.target),
  //       refId: target.refId,
  //       hide: target.hide,
  //       type: target.type || 'timeserie'
  //     };
  //   });

  //   options.targets = targets;

  //   return options;
  // }
}
