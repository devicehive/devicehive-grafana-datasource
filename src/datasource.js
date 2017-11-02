import DeviceHiveClient from './dh';
import _ from "lodash";

export class GenericDatasource {

    /**
     * Creates an instance of GenericDatasource.
     * @param {Object} instanceSettings
     * @param {any} $q
     * @param backendSrv
     * @param templateSrv
     * @memberof GenericDatasource
     */
    constructor(instanceSettings, $q, backendSrv, templateSrv) {
        this.type = instanceSettings.type;
        this.url = instanceSettings.url;
        this.name = instanceSettings.name;
        this.jsonData = instanceSettings.jsonData;
        this.dhClientPromise = null;
        this.backendSrv = backendSrv;
        this.templateSrv = templateSrv;

        this.q = $q;
        if (instanceSettings.jsonData) {
            if (instanceSettings.jsonData.authType === `Login/Password` || instanceSettings.jsonData.authType === `Token`) {
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
    authenticate(type, auth, url) {
        if (type === `Login/Password`) {
            return this.dhClientPromise = new DeviceHiveClient({
                login: auth.login,
                password: auth.password,
                serverURL: url
            })
                .then(dhClient => {
                    this.dhClient = dhClient;
                    return dhClient;
                });
        } else if (type === `Token`) {
            return this.dhClientPromise = new DeviceHiveClient({
                token: auth.token,
                serverURL: url
            })
                .then(dhClient => {
                    this.dhClient = dhClient;
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
    query(options) {
        const me = this;
        const targets = options.targets.map(target => ({
            dataPath: me._processDataPath(target.dataPath),
            scale: target.scale,
            refId: target.refId,
            type: target.type
        }));

        if (me.dhClient) {
            return me.dhClient
                .queryData(targets, me.jsonData.deviceId, {from: options.range.from._d, to: options.range.to._d})
                .then(result => {
                    return result;
                });
        } else {
            return me.authenticate(this.jsonData.authType, me.jsonData.auth, me.jsonData.serverURL)
                .then(dhClient => dhClient.testDatasource())
                .then(() => {
                    return me.dhClient.queryData(targets, me.jsonData.deviceId, {
                        from: options.range.from._d,
                        to: options.range.to._d
                    })
                })
                .then(result => {
                    return result;
                });
        }
    }

    _processDataPath(dataPath) {
        const me = this;

        return me.templateSrv.variableExists(dataPath) ? dataPath = me.templateSrv.variables
            .find((variable) => variable.name === me.templateSrv.getVariableName(dataPath)).current.value :
            dataPath;
    }

    /**
     * Function used by Grafana to test datasource
     *
     * @returns
     * @memberof GenericDatasource
     */
    testDatasource() {
        return this.dhClientPromise
            .then(dhClient => dhClient.testDatasource())
            .then(() => Promise.resolve({status: `success`, message: `Data source is working`, title: `Success`}))
            .catch((message) => Promise.resolve({status: `error`, message: message.error, title: `Error`}));
    }
}
