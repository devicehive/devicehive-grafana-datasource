import lodash from "lodash";
import Events from "./utils/Events";


/**
 * DeviceHive api class
 */
class DeviceHive extends Events {

    /**
     * Creates an instance of DeviceHive.
     * @param {Object} { login, password, serverUrl, token }
     * @memberof DeviceHive
     */
    constructor({ login, password, serverUrl, token }) {
        super();

        const me = this;

        if (serverUrl && ((login && password) || token )) {
            me.socket = new WebSocket(serverUrl);
            me.login = login;
            me.password = password;
            me.serverUrl = serverUrl;
            me.token = token;
            me.isOpen = false;
            me.isAuthenticated = false;
            me.isTokenRequested = false;
            me.isAuthenticationStarted = false;

            me.socket.addEventListener(`open`, () => me.isOpen = true);
            me.socket.addEventListener(`close`, () => me.isOpen = false);
        } else {
            throw new Error(`You need to specify URL, login and password or token`);
        }
    }

    /**
     * Send message object over WS session by the key
     * @param messageObject
     * @return {Promise}
     */
    send(messageObject) {
        const me = this;

        return me._getReadyClient()
            .then(() => {
                return me.isAuthenticated === true ||
                    messageObject.action === `authenticate` ||
                    messageObject.action === `token` ?
                    Promise.resolve() : me.authenticate();
            })
            .then(() => new Promise((resolve, reject) => {
                messageObject.requestId = messageObject.requestId || lodash.uniqueId(`deviceHiveId_`);
                me.socket.send(JSON.stringify(messageObject));

                const listener = (event) => {
                    const messageData = JSON.parse(event.data);
                    const isSuccess = messageData.status === `success`;

                    if (messageData.action === messageObject.action &&
                        messageData.requestId === messageObject.requestId) {
                        me.socket.removeEventListener(`message`, listener);
                        me.isAuthenticated = isSuccess === false ? isSuccess : me.isAuthenticated;
                        isSuccess ? resolve(messageData) : reject(messageData.error);
                    }
                };

                me.socket.addEventListener(`message`, listener);
            }));
    }

    /**
     * Internal `authenticate` message sender
     * @param {String} accessToken
     * @memberof DeviceHive
     */
    authenticate({ token, login, password } = {}) {
        const me = this;

        me.token = token || me.token;
        me.login = login || me.login;
        me.password = password || me.password;

        return new Promise((resolve, reject) => {
            me.once(`authenticated`, () => {
                me.isTokenRequested = false;
                me.isAuthenticationStarted = false;
                me.isAuthenticated = true;
                resolve();
            });

            if (me.isAuthenticated === true) {
                me.dispatchEvent(`authenticated`);
            } else {
                if (me.isAuthenticationStarted === false || me.isTokenRequested === false) {
                    if (me.token) {
                        me.isAuthenticationStarted = true;
                        me.send({action: `authenticate`, token: me.token})
                            .then(() => me.dispatchEvent(`authenticated`))
                            .catch((error) => reject(error));
                    } else {
                        me.isTokenRequested = true;
                        me.send({action: `token`, login: me.login, password: me.password})
                            .then(({accessToken, refreshToken}) => me.authenticate({token: accessToken}))
                            .catch((error) => reject(error));
                    }
                }
            }
        });
    }

    /**
     * Waits for WS session to be opened
     * @return {Promise}
     * @private
     */
    _getReadyClient() {
        const me = this;

        function onOpen(resolve) {
            me.socket.removeEventListener(`open`, onOpen);
            resolve(me)
        }

        return new Promise((resolve) => me.isOpen ? resolve(me) : me.socket.addEventListener(`open`, () => onOpen(resolve)));
    }
}


export default DeviceHive;