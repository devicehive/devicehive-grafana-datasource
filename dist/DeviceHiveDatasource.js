'use strict';

System.register(['moment', './DeviceHive', './ConverterManager.js'], function (_export, _context) {
    "use strict";

    var moment, DeviceHive, ConverterManager, _createClass, converterManager, DeviceHiveDatasource;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_moment) {
            moment = _moment.default;
        }, function (_DeviceHive) {
            DeviceHive = _DeviceHive.default;
        }, function (_ConverterManagerJs) {
            ConverterManager = _ConverterManagerJs.default;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            converterManager = new ConverterManager();

            DeviceHiveDatasource = function () {

                /**
                 * Creates an instance of DeviceHiveDatasource.
                 * @param {Object} instanceSettings
                 * @param {any} $q
                 * @param backendSrv
                 * @param templateSrv
                 * @memberof DeviceHiveDatasource
                 */
                function DeviceHiveDatasource(instanceSettings, $q, backendSrv, templateSrv) {
                    _classCallCheck(this, DeviceHiveDatasource);

                    var me = this;

                    me.q = $q;
                    me.type = instanceSettings.type;
                    me.url = instanceSettings.url;
                    me.name = instanceSettings.name;
                    me.jsonData = instanceSettings.jsonData;
                    me.templateSrv = templateSrv;
                    me.deviceHive = new DeviceHive({
                        serverUrl: me.jsonData.serverURL,
                        login: me.jsonData.auth.login,
                        password: me.jsonData.auth.password,
                        accessToken: me.jsonData.auth.accessToken,
                        refreshToken: me.jsonData.auth.refreshToken
                    });
                }

                /**
                 * Function used by Grafana to query data
                 * @param {Object} options
                 * @returns
                 * @memberof DeviceHiveDatasource
                 */


                _createClass(DeviceHiveDatasource, [{
                    key: 'query',
                    value: function query(options) {
                        var me = this;
                        var targetIndexes = [];

                        return Promise.all(options.targets.filter(function (target, index) {
                            var isVisible = target.hide !== true;

                            if (isVisible) {
                                targetIndexes.push(index);
                            }

                            return isVisible;
                        }).map(function (target) {
                            return me.deviceHive.send(me._generateRequestObject(target, options, options.maxDataPoints));
                        })).then(function (results) {
                            return {
                                data: results.map(function (result, index) {
                                    var type = options.targets[targetIndexes[index]].type;
                                    var label = options.targets[targetIndexes[index]].label;
                                    var dataPath = me._processVariables(options.targets[targetIndexes[index]].dataPath);
                                    var refId = options.targets[targetIndexes[index]].refId;

                                    return {
                                        target: label || '' + type + refId,
                                        datapoints: result[type + 's'].map(function (target) {
                                            return [me._convertValue(me._extractValueByPath(target, dataPath), options.targets[targetIndexes[index]].converters), +moment.utc(target.timestamp).format('x')];
                                        })
                                    };
                                })
                            };
                        }).catch(function (error) {
                            return me.q.reject({ status: 'error', message: error, title: 'Error' });
                        });
                    }
                }, {
                    key: 'annotationQuery',
                    value: function annotationQuery(options) {
                        var me = this;

                        return me.deviceHive.send(me._generateRequestObject(options.annotation.config, options, options.annotation.limit)).then(function (result) {
                            var type = options.annotation.config.type;
                            var dataPath = me._processVariables(options.annotation.config.dataPath);

                            return result[type + 's'].map(function (item) {
                                var annotationObj = me._extractValueByPath(item, dataPath);
                                annotationObj.annotation = options.annotation;
                                annotationObj.time = annotationObj.time || +moment.utc(item.timestamp).format('x');

                                return annotationObj;
                            });
                        }).catch(function (error) {
                            return me.q.reject({ status: 'error', message: error, title: 'Error' });
                        });
                    }
                }, {
                    key: 'testDatasource',
                    value: function testDatasource() {
                        var me = this;

                        return me.deviceHive.authenticate().then(function () {
                            return Promise.resolve({ status: 'success', message: 'Data source is working', title: 'Success' });
                        }).catch(function (error) {
                            return me.q.reject({ status: 'error', message: error, title: 'Error' });
                        });
                    }
                }, {
                    key: '_convertValue',
                    value: function _convertValue(value, converters) {
                        return converters.reduce(function (v, converter) {
                            return converterManager.convert(converter.name, v, converter.argValues);
                        }, value);
                    }
                }, {
                    key: '_processVariables',
                    value: function _processVariables(stringWithVariables) {
                        var me = this;

                        return me.templateSrv.replace('' + stringWithVariables);
                    }
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
                }, {
                    key: '_generateRequestObject',
                    value: function _generateRequestObject(target, allOptions, limit) {
                        var me = this;
                        var resultObj = {
                            action: target.type + '/list',
                            deviceId: me.jsonData.deviceId,
                            start: allOptions.range.from.toDate().getTime(),
                            end: allOptions.range.to.toDate().getTime(),
                            sortField: 'timestamp',
                            sortOrder: 'ASC',
                            take: limit || 100
                        };

                        resultObj[target.type] = me._processVariables(target.name);

                        return resultObj;
                    }
                }]);

                return DeviceHiveDatasource;
            }();

            _export('default', DeviceHiveDatasource);
        }
    };
});
//# sourceMappingURL=DeviceHiveDatasource.js.map
