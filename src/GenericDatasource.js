import moment from 'moment';
import DeviceHive from './DeviceHive';


/**
 *
 */
class GenericDatasource {

    /**
     * Creates an instance of GenericDatasource.
     * @param {Object} instanceSettings
     * @param {any} $q
     * @param backendSrv
     * @param templateSrv
     * @memberof GenericDatasource
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
    query(options) {
        const me = this;

        return me.deviceHive.authenticate()
            .then(() => Promise.all(options.targets
                .filter(target => target.hide !== true )
                .map(target => me.deviceHive.send(me._generateRequestObject(target, options)))
            ))
            .then(results => {
                return {
                    data: results.map((result, index) => {
                        const type = options.targets[index].type;
                        const scale = me._processVariables(options.targets[index].scale);
                        const dataPath = me._processVariables(options.targets[index].dataPath);
                        const refId = options.targets[index].refId;

                        return {
                            target: `${type}${refId}`,
                            datapoints: result[`${type}s`].map(target => {
                                return [
                                    me._extractValueByPath(target, dataPath) * (scale === `` ? 1 : scale),
                                    +moment.utc(target.timestamp).format(`x`)
                                ]
                            })
                        };
                    })
                }
            });
    }

    /**
     *
     * @param options
     * @returns {Promise.<TResult>}
     */
    annotationQuery(options) {
        const me = this;

        return me.deviceHive.authenticate()
            .then(() => me.deviceHive.send(me._generateRequestObject({
                type: options.annotation.type,
                name: options.annotation.entityName,
                dataPath: options.annotation.dataPath
            }, options)))
            .then(result => {
                const type = options.annotation.type;
                const dataPath = me._processVariables(options.annotation.dataPath);

                return result[`${type}s`].map((result, index) => {
                    const res = me._extractValueByPath(result, dataPath);
                    res.annotation = options.annotation;

                    return res;
                });
            });
    }

    /**
     * Function used by Grafana to test datasource
     *
     * @returns
     * @memberof GenericDatasource
     */
    testDatasource() {
        const me = this;

        return me.deviceHive.authenticate()
            .then(() => {
                return { status: `success`, message: `Data source is working`, title: `Success` };
            })
            .catch((error) => {
                return { status: `error`, message: error, title: `Error` };
            });
    }

    /**
     *
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
     *
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
     *
     * @param target
     * @param allOptions
     * @returns {{action: string, deviceId: *, start: number, end: number, sortField: string, sortOrder: string, skip: number}}
     * @private
     */
    _generateRequestObject(target, allOptions) {
        const me = this;
        const resultObj = {
            action: `${target.type}/list`,
            deviceId: me.jsonData.deviceId,
            start: allOptions.range.from.toDate().getTime(),
            end: allOptions.range.to.toDate().getTime(),
            sortField: `timestamp`,
            sortOrder: `ASC`,
            take: 10000,
            skip: 0
        };

        resultObj[target.type] = me._processVariables(target.name);

        return resultObj;
    }
}


export default GenericDatasource
