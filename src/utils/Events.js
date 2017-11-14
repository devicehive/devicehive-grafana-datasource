
/**
 * EventTarget implementation
 */
class Events {

    /**
     * Create new Events object
     */
    constructor () {
        const me = this;

        me.listeners = new Map();
    }

    /**
     * Add event listener
     * @param eventName
     * @param callback
     */
    addEventListener(eventName, callback) {
        const me = this;

        if (!me.listeners.has(eventName)) {
            me.listeners.set(eventName, []);
        }

        me.listeners.get(eventName).push(callback);
    }

    /**
     * Remove event listener
     * @param eventName
     * @param callback
     */
    removeEventListener (eventName, callback) {
        const me = this;

        if (!me.listeners.has(eventName)) {
            return;
        }

        const stack = me.listeners.get(eventName);

        for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback){
                stack.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Fire event
     * @param eventName
     * @returns {boolean}
     */
    dispatchEvent (eventName) {
        const me = this;

        if (me.listeners.has(eventName)) {
            const stack = me.listeners.get(eventName);
            const listenersPool = stack.map((listener) => listener);

            listenersPool.forEach((listener) => {
                listener.call(me);
            });
        }

        return true;
    }

    /**
     * Add disposable event listener
     * @param eventName
     * @param callback
     */
    once (eventName, callback) {
        const me = this;
        const wrapper = () => {
            me.removeEventListener(eventName, wrapper);
            callback.call(me, arguments);
        };

        me.addEventListener(eventName, wrapper);
    }
}


export default Events;