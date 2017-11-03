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
                .map(target => me.deviceHive.send({
                    action: `${target.type}/list`,
                    deviceId: me.jsonData.deviceId,
                    notification: me._processVariable(target.name),
                    start: options.range.from.toDate(),
                    end: options.range.to.toDate(),
                    sortField: `timestamp`,
                    sortOrder: `ASC `,
                    take: 600,
                    skip: 0
                }))
            ))
            .then(results => {
                return {
                    data: results.map((result, index) => {
                        const type = options.targets[index].type;
                        const scale = me._processVariable(options.targets[index].scale);
                        const dataPath = me._processVariable(options.targets[index].dataPath);
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
     * Function used by Grafana to test datasource
     *
     * @returns
     * @memberof GenericDatasource
     */
    testDatasource() {
        const me = this;

        return me.deviceHive.authenticate()
            .then(() => Promise.resolve({status: `success`, message: `Data source is working`, title: `Success`}))
            .catch((error) => Promise.resolve({status: `error`, message: error, title: `Error`}));
    }

    /**
     *
     * @param options
     */
    annotationQuery(options) {

    }

    /**
     *
     * @param options
     */
    metricFindQuery(options) {

    }

    /**
     *
     * @param variable
     * @return {*}
     * @private
     */
    _processVariable(variable) {
        const me = this;

        return me.templateSrv.variableExists(variable) ? me.templateSrv.variables
            .find((variableObj) => variableObj.name === me.templateSrv.getVariableName(variable)).current.value :
            variable;
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

        fields.forEach(field => current = current[field] ? current[field] : null);

        return current;
    }
}


export default GenericDatasource
