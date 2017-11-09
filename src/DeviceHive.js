import lodash from "lodash";
import Events from "./utils/Events";

/**
 *
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
            .then(() => new Promise((resolve, reject) => {
                messageObject.requestId = messageObject.requestId || lodash.uniqueId(`deviceHiveId_`);
                me.socket.send(JSON.stringify(messageObject));

                const listener = (event) => {
                    const messageData = JSON.parse(event.data);
                    const isSuccess = messageData.status === `success`;

                    if (messageData.action === messageObject.action &&
                        messageData.requestId === messageObject.requestId) {
                        me.socket.removeEventListener(`message`, listener);
                        me.isAuthenticated = isSuccess;
                        isSuccess ? resolve(messageData) : reject(messageData.error);
                    }
                };

                me.socket.addEventListener(`message`, listener);
            }));
    }

    /**
     * Internal `authenticate` message sender
     *
     * @param {String} accessToken
     * @memberof DeviceHive
     */
    authenticate({ token, login, password } = {}) {
        const me = this;

        me.token = token || me.token;
        me.login = login || me.login;
        me.password = password || me.password;

        return  me.isAuthenticated ? Promise.resolve() : (me.token ?
            me.send({ action: `authenticate`, token: me.token }) :
            me.send({ action: `token`, login: me.login,  password: me.password })
                .then(({ accessToken, refreshToken }) => me.authenticate({ token: accessToken }))
                .catch(() => me.authenticate({ login: me.login, password: me.password })))
            .then(() => me.isAuthenticated = true );
    }

    /**
     *
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