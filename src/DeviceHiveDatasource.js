import moment from 'moment';
import DeviceHive from './DeviceHive';
import ConverterManager from './ConverterManager.js';

const converterManager = new ConverterManager();


/**
 * DeviceHive datasource class
 * Datasource object communicates with the database and transforms data to times series.
 */
class DeviceHiveDatasource {

    /**
     * Creates an instance of DeviceHiveDatasource.
     * @param {Object} instanceSettings
     * @param {any} $q
     * @param backendSrv
     * @param templateSrv
     * @memberof DeviceHiveDatasource
     */
    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        const me = this;

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
            refreshToken: me.jsonData.auth.refreshToken,
        });
    }

    /**
     * Function used by Grafana to query data
     * @param {Object} options
     * @returns
     * @memberof DeviceHiveDatasource
     */
    query(options) {
        const me = this;
        const targetIndexes = [];

        return Promise.all(options.targets
                .filter((target, index) => {
	                const isVisible = target.hide !== true;

                    if (isVisible) {
	                    targetIndexes.push(index);
                    }

                    return isVisible;
                })
                .map(target => me.deviceHive.send(me._generateRequestObject(target, options, options.maxDataPoints))))
            .then(results => {
                return {
                    data: results.map((result, index) => {
                        const type = options.targets[targetIndexes[index]].type;
                        const label = options.targets[targetIndexes[index]].label;
                        const dataPath = me._processVariables(options.targets[targetIndexes[index]].dataPath);
                        const refId = options.targets[targetIndexes[index]].refId;

                        return {
                            target: label || `${type}${refId}`,
                            datapoints: result[`${type}s`].map(target => {
                                return [
                                    me._convertValue(me._extractValueByPath(target, dataPath), options.targets[targetIndexes[index]].converters),
                                    +moment.utc(target.timestamp).format(`x`)
                                ]
                            })
                        };
                    })
                }
            })
            .catch((error) => me.q.reject({ status: `error`, message: error, title: `Error` }));
    }

    /**
     * Used by dashboards to get annotations
     * @param options
     * @returns {Promise}
     */
    annotationQuery(options) {
        const me = this;

        return me.deviceHive.send(me._generateRequestObject(
                options.annotation.config, options, options.annotation.limit))
            .then(result => {
                const type = options.annotation.config.type;
                const dataPath = me._processVariables(options.annotation.config.dataPath);

                return result[`${type}s`].map((item) => {
                    const annotationObj = me._extractValueByPath(item, dataPath);
                    annotationObj.annotation = options.annotation;
                    annotationObj.time = annotationObj.time || +moment.utc(item.timestamp).format(`x`);

                    return annotationObj;
                });
            })
            .catch((error) => me.q.reject({ status: `error`, message: error, title: `Error` }));
    }

    /**
     * Function used by Grafana to test datasource
     * @returns
     * @memberof DeviceHiveDatasource
     */
    testDatasource() {
        const me = this;

        return me.deviceHive.authenticate()
            .then(() => Promise.resolve({ status: `success`, message: `Data source is working`, title: `Success` }))
            .catch((error) => me.q.reject({ status: `error`, message: error, title: `Error` }));
    }

    /**
     * Converting value by ConverterManager
     * @param value
     * @param converters
     * @private
     */
    _convertValue(value, converters) {
        return converters.reduce((v, converter) =>
            converterManager.convert(converter.name, v, converter.argValues), value);
    }

    /**
     * Transform template variable to it's values
     * @param stringWithVariables
     * @return {*}
     * @private
     */
    _processVariables(stringWithVariables) {
        const me = this;

        return me.templateSrv.replace(`${stringWithVariables}`);
    }

    /**
     * Internal function to extract value from object based on path
     * @param {Object} object
     * @param {String} path
     * @returns
     * @memberof DeviceHive
     */
    _extractValueByPath(object, path) {
        const fields = path.split(/[\.\[\]]/).filter(elem => elem !== ``);
        let current = object;

        fields.forEach(field => current = current && current[field] ? current[field] : null);

        return current;
    }

    /**
     * Generate DeviceHive WS request object
     * @param target
     * @param allOptions
     * @param limit
     * @returns {Object}
     * @private
     */
    _generateRequestObject(target, allOptions, limit) {
        const me = this;
        const resultObj = {
            action: `${target.type}/list`,
            deviceId: me.jsonData.deviceId,
            start: allOptions.range.from.toDate().getTime(),
            end: allOptions.range.to.toDate().getTime(),
            sortField: `timestamp`,
            sortOrder: `ASC`,
            take: limit || 100
        };

        resultObj[target.type] = me._processVariables(target.name);

        return resultObj;
    }
}


export default DeviceHiveDatasource
