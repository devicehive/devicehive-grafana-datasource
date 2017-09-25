'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeviceHiveClient = function () {
  /**
   * Creates an instance of DeviceHiveClient.
   * @param {Object} { login, password, serverURL, token } 
   * @memberof DeviceHiveClient
   */
  function DeviceHiveClient(_ref) {
    var _this = this;

    var login = _ref.login,
        password = _ref.password,
        serverURL = _ref.serverURL,
        token = _ref.token;

    _classCallCheck(this, DeviceHiveClient);

    if (serverURL && (login && password || token)) {
      this.__socket = new WebSocket(serverURL);
      this.authInfo = {
        login: login,
        password: password,
        token: token
      };
      return new Promise(function (resolve) {
        _this.__socket.addEventListener('open', function (event) {
          resolve(_this);
        });
      });
    } else {
      throw new Error('You need to specify URL, login and password or token');
    }
  }

  /**
   * Create token pair based on login\password auth
   * 
   * @param {String} login 
   * @param {String} password 
   * @memberof DeviceHiveClient
   */


  _createClass(DeviceHiveClient, [{
    key: 'createTokenPair',
    value: function createTokenPair(login, password) {
      this.__socket.send(JSON.stringify({
        action: 'token',
        login: login,
        password: password
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

  }, {
    key: 'queryData',
    value: function queryData(targets, deviceId, dateRange) {
      var _this2 = this;

      return new Promise(function (resolve) {
        var extractedTargets = targets.slice(0).reduce(function (obj, item) {
          if (!obj[item.type]) {
            obj[item.type] = [{ path: item.dataPath, scale: item.scale === '' ? 1 : item.scale, refId: item.refId }];
          } else {
            obj[item.type] = [].concat(_toConsumableArray(obj[item.type]), [{
              path: item.dataPath,
              scale: item.scale === '' ? 1 : item.scale,
              refId: item.refId
            }]);
          }
          return obj;
        }, {});
        var types = Object.keys(extractedTargets);
        var results = [];
        var request = types.length;
        var commandNotificationHandler = function commandNotificationHandler(event) {
          var messageData = JSON.parse(event.data);
          var actions = messageData.action.split('/');
          if (types.includes(actions[0]) && actions[1] === 'list') {
            request--;
            var datas = messageData[actions[0] + 's'];
            extractedTargets[actions[0]].forEach(function (_ref2) {
              var path = _ref2.path,
                  scale = _ref2.scale,
                  refId = _ref2.refId;

              if (!path.includes('Orient')) {
                var points = [];
                datas.forEach(function (data) {
                  if (typeof _this2.__extractValue(data, path) !== 'object') {
                    points.push([_this2.__extractValue(data, path) * scale, +_moment2.default.utc(data.timestamp).format('x')]);
                  }
                });
                points.sort(function (a, b) {
                  return a[1] - b[1];
                });
                results.push({
                  target: '' + actions[0] + refId,
                  datapoints: points
                });
              } else {
                var pointsX = [];
                var pointsY = [];
                var pointsZ = [];
                datas.forEach(function (data) {
                  if (typeof _this2.__extractValue(data, path) !== 'object') {
                    var _extractValue$split$ = _this2.__extractValue(data, path).split(',').map(function (value) {
                      return +value;
                    }),
                        _extractValue$split$2 = _slicedToArray(_extractValue$split$, 3),
                        azimuth = _extractValue$split$2[0],
                        roll = _extractValue$split$2[1],
                        pitch = _extractValue$split$2[2];

                    pointsX.push([-Math.cos(azimuth) * Math.sin(pitch) * Math.sin(roll) - Math.sin(azimuth) * Math.cos(roll), +_moment2.default.utc(data.timestamp).format('x')]);
                    pointsY.push([-Math.sin(azimuth) * Math.sin(pitch) * Math.sin(roll) + Math.cos(azimuth) * Math.cos(roll), +_moment2.default.utc(data.timestamp).format('x')]);
                    pointsZ.push([Math.cos(pitch) * Math.sin(roll), +_moment2.default.utc(data.timestamp).format('x')]);
                  }
                });
                pointsX.sort(function (a, b) {
                  return a[1] - b[1];
                });
                pointsY.sort(function (a, b) {
                  return a[1] - b[1];
                });
                pointsZ.sort(function (a, b) {
                  return a[1] - b[1];
                });

                results.push({
                  target: 'X',
                  datapoints: [[pointsX[0][0]], [0]]
                });
                results.push({
                  target: 'Y',
                  datapoints: [[pointsY[0][0]], [0]]
                });
                results.push({
                  target: 'Z',
                  datapoints: [[pointsZ[0][0]], [0]]
                });
              }
            });
            if (!request) {
              _this2.__socket.removeEventListener('message', commandNotificationHandler);
              resolve({
                data: results
              });
            }
          }
        };
        _this2.__socket.addEventListener('message', commandNotificationHandler);
        types.forEach(function (type) {
          return _this2.__socket.send(JSON.stringify({
            action: type + '/list',
            deviceId: deviceId
          }));
        });
      });
    }

    /**
     * Function used to test datasource connection and auth
     * 
     * @returns 
     * @memberof DeviceHiveClient
     */

  }, {
    key: 'testDatasource',
    value: function testDatasource() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!_this3.authInfo.token) {
          _this3.createTokenPair(_this3.authInfo.login, _this3.authInfo.password);
        } else {
          _this3.__authenticate(_this3.authInfo.token);
        }
        var authHandler = function authHandler(event) {
          var messageData = JSON.parse(event.data);
          if ((messageData.action === 'token' || messageData.action === 'authenticate') && messageData.status === 'success') {
            switch (messageData.action) {
              case 'token':
                return _this3.__tokenMessage(messageData).then(function (accessToken) {
                  return _this3.__authenticate(accessToken);
                });
              case 'authenticate':
                _this3.__socket.removeEventListener('message', authHandler);
                return resolve();
            }
          } else {
            if (messageData.status === 'error') {
              console.log(messageData);
              _this3.__socket.removeEventListener('message', authHandler);
              reject(messageData);
            }
          }
        };
        _this3.__socket.addEventListener('message', authHandler);
      });
    }

    /**
     * Internal handler on `token` type message
     * 
     * @param {Object} messageData 
     * @returns 
     * @memberof DeviceHiveClient
     */

  }, {
    key: '__tokenMessage',
    value: function __tokenMessage(messageData) {
      this.tokens = {
        accessToken: messageData.accessToken,
        refreshToken: messageData.refreshToken
      };
      return Promise.resolve(this.tokens.accessToken);
    }

    /**
     * Internal `authenticate` message sender
     * 
     * @param {String} accessToken 
     * @memberof DeviceHiveClient
     */

  }, {
    key: '__authenticate',
    value: function __authenticate(accessToken) {
      this.__socket.send(JSON.stringify({
        action: 'authenticate',
        token: accessToken
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

  }, {
    key: '__extractValue',
    value: function __extractValue(object, path) {
      var current = object;
      var fields = path.split(/[\.\[\]]/).filter(function (elem) {
        return elem !== '';
      });
      fields.forEach(function (field) {
        if (current[field] !== undefined) {
          current = current[field];
        } else {
          current = null;
        }
      });
      return typeof current === 'string' && !path.includes('Orient') ? +current : current;
    }
  }]);

  return DeviceHiveClient;
}();

exports.default = DeviceHiveClient;
//# sourceMappingURL=dh.js.map
