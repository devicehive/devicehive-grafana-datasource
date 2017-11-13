
/**
 * DeviceHive configuration controller
 */
class DeviceHiveConfigCtrl {

    /**
     * On Auth Type change
     */
    onChangeInternal() {
        const me = this;

        if (me.current.jsonData.authType === 'Token') {
            me.current.jsonData.auth = {
                login: ``,
                password: ``
            }
        } else {
            me.current.jsonData.auth = {
                accessToken: ``,
                refreshToken: ``
            }
        }
    }
}

DeviceHiveConfigCtrl.templateUrl = `partials/datasource.config.html`;


export default DeviceHiveConfigCtrl;