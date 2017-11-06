'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _DeviceHive = require('./DeviceHive');

var _DeviceHive2 = _interopRequireDefault(_DeviceHive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */
var GenericDatasource = function () {

    /**
     * Creates an instance of GenericDatasource.
     * @param {Object} instanceSettings
     * @param {any} $q
     * @param backendSrv
     * @param templateSrv
     * @memberof GenericDatasource
     */
    function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
        _classCallCheck(this, GenericDatasource);

        var me = this;

        me.q = $q;
        me.type = instanceSettings.type;
        me.url = instanceSettings.url;
        me.name = instanceSettings.name;
        me.jsonData = instanceSettings.jsonData;
        me.templateSrv = templateSrv;
        me.deviceHive = new _DeviceHive2.default({
            serverUrl: me.jsonData.serverURL,
            login: me.jsonData.auth.login,
            password: me.jsonData.auth.password,
            token: me.jsonData.auth.token
        });
    }

    /**
     * Function used by Grafana to query data
     *
     * @param {Object} options
     * @returns
     * @memberof GenericDatasource
     */


    _createClass(GenericDatasource, [{
        key: 'query',
        value: function query(options) {
            var me = this;

            return me.deviceHive.authenticate().then(function () {
                return Promise.all(options.targets.filter(function (target) {
                    return target.hide !== true;
                }).map(function (target) {
                    return me.deviceHive.send(me._generateRequestObject(target, options));
                }));
            }).then(function (results) {
                return {
                    data: results.map(function (result, index) {
                        var type = options.targets[index].type;
                        var scale = me._processVariables(options.targets[index].scale);
                        var dataPath = me._processVariables(options.targets[index].dataPath);
                        var refId = options.targets[index].refId;

                        return {
                            target: '' + type + refId,
                            datapoints: result[type + 's'].map(function (target) {
                                return [me._extractValueByPath(target, dataPath) * (scale === '' ? 1 : scale), +_moment2.default.utc(target.timestamp).format('x')];
                            })
                        };
                    })
                };
            });
        }

        /**
         *
         * @param options
         * @returns {Promise.<TResult>}
         */

    }, {
        key: 'annotationQuery',
        value: function annotationQuery(options) {
            var me = this;
            console.log(options.annotation);
            return me.deviceHive.authenticate().then(function () {
                return me.deviceHive.send(me._generateRequestObject(options.annotation, options));
            }).then(function (result) {
                var type = options.annotation.type;
                var dataPath = me._processVariables(options.annotation.dataPath);

                return {
                    data: result[type + 's'].map(function (result, index) {
                        return me._extractValueByPath(result, dataPath);
                    })
                };
            });
        }

        /**
         * Function used by Grafana to test datasource
         *
         * @returns
         * @memberof GenericDatasource
         */

    }, {
        key: 'testDatasource',
        value: function testDatasource() {
            var me = this;

            return me.deviceHive.authenticate().then(function () {
                return Promise.resolve({ status: 'success', message: 'Data source is working', title: 'Success' });
            }).catch(function (error) {
                return Promise.resolve({ status: 'error', message: error, title: 'Error' });
            });
        }

        /**
         *
         * @param stringWithVariables
         * @return {*}
         * @private
         */

    }, {
        key: '_processVariables',
        value: function _processVariables(stringWithVariables) {
            var me = this;

            return me.templateSrv.replace('' + stringWithVariables);
        }

        /**
         * Internal function to extract value from object based on path
         *
         * @param {Object} object
         * @param {String} path
         * @returns
         * @memberof DeviceHive
         */

    }, {
        key: '_extractValueByPath',
        value: function _extractValueByPath(object, path) {
            var fields = path.split(/[\.\[\]]/).filter(function (elem) {
                return elem !== '';
            });
            var current = object;

            fields.forEach(function (field) {
                return current = current && current[field] ? current[field] : null;
            });

            return current;
        }

        /**
         *
         * @param target
         * @param allOptions
         * @returns {{action: string, deviceId: *, start: number, end: number, sortField: string, sortOrder: string, skip: number}}
         * @private
         */

    }, {
        key: '_generateRequestObject',
        value: function _generateRequestObject(target, allOptions) {
            var me = this;
            var resultObj = {
                action: target.type + '/list',
                deviceId: me.jsonData.deviceId,
                start: allOptions.range.from.toDate().getTime(),
                end: allOptions.range.to.toDate().getTime(),
                sortField: 'timestamp',
                sortOrder: 'ASC',
                skip: 0
            };

            resultObj[target.type] = me._processVariables(target.name);

            return resultObj;
        }
    }]);

    return GenericDatasource;
}();

exports.default = GenericDatasource;
//# sourceMappingURL=GenericDatasource.js.map
