"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dh = require("./dh");

var _dh2 = _interopRequireDefault(_dh);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericDatasource = exports.GenericDatasource = function () {
  /**
   * Creates an instance of GenericDatasource.
   * @param {Object} instanceSettings 
   * @param {any} $q 
   * @memberof GenericDatasource
   */
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    this.type = instanceSettings.type;
    this.url = instanceSettings.url;
    this.name = instanceSettings.name;
    this.jsonData = instanceSettings.jsonData;
    this.dhClientPromise = null;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;

    this.q = $q;
    if (instanceSettings.jsonData) {
      if (instanceSettings.jsonData.authType === "Login/Password" || instanceSettings.jsonData.authType === "Token") {
        this.authenticate(this.jsonData.authType, this.jsonData.auth, this.jsonData.serverURL);
      }
    }
  }

  /**
   * Authenticates user
   * 
   * @param {String} type 
   * @param {Object} auth 
   * @param {String} url 
   * @returns 
   * @memberof GenericDatasource
   */


  _createClass(GenericDatasource, [{
    key: "authenticate",
    value: function authenticate(type, auth, url) {
      var _this = this;

      if (type === "Login/Password") {
        return this.dhClientPromise = new _dh2.default({
          login: auth.login,
          password: auth.password,
          serverURL: url
        }).then(function (dhClient) {
          _this.dhClient = dhClient;
          return dhClient;
        });
      } else if (type === "Token") {
        return this.dhClientPromise = new _dh2.default({
          token: auth.token,
          serverURL: url
        }).then(function (dhClient) {
          _this.dhClient = dhClient;
          return dhClient;
        });
      }
    }

    /**
     * Function used by Grafana to query data
     * 
     * @param {Object} options 
     * @returns 
     * @memberof GenericDatasource
     */

  }, {
    key: "query",
    value: function query(options) {
      var _this2 = this;

      var newTargets = [];
      options.targets.forEach(function (target) {
        var execResults = _this2.templateSrv._regex.exec(target.dataPath);
        newTargets.push({
          dataPath: target.dataPath.slice().replace(new RegExp("\\" + ("" + execResults[0])), _this2.templateSrv._index[execResults[1]].current.value),
          scale: target.scale,
          refId: target.refId,
          type: target.type
        });
      });
      if (this.dhClient) {
        return this.dhClient.queryData(newTargets, this.jsonData.deviceId, { from: options.range.from._d, to: options.range.to._d }).then(function (result) {
          return result;
        });
      } else {
        return this.authenticate(this.jsonData.authType, this.jsonData.auth, this.jsonData.serverURL).then(function (dhClient) {
          return dhClient.testDatasource();
        }).then(function () {
          return _this2.dhClient.queryData(newTargets, _this2.jsonData.deviceId, { from: options.range.from._d, to: options.range.to._d });
        }).then(function (result) {
          return result;
        });
      }
    }

    /**
     * Function used by Grafana to test datasource
     * 
     * @returns 
     * @memberof GenericDatasource
     */

  }, {
    key: "testDatasource",
    value: function testDatasource() {
      return this.dhClientPromise.then(function (dhClient) {
        return dhClient.testDatasource();
      }).then(function () {
        return Promise.resolve({ status: "success", message: "Data source is working", title: "Success" });
      }).catch(function (message) {
        return Promise.resolve({ status: "error", message: message.error, title: "Error" });
      });
    }
  }]);

  return GenericDatasource;
}();
//# sourceMappingURL=datasource.js.map
