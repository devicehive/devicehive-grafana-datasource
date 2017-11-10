
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
            me.current.jsonData.auth.login = '';
            me.current.jsonData.auth.password = '';
        } else {
            me.current.jsonData.auth.token = '';
        }
    }
}

DeviceHiveConfigCtrl.templateUrl = `partials/datasource.config.html`;


export default DeviceHiveConfigCtrl;