
class Events {

    constructor () {
        const me = this;

        me.listeners = new Map();
    }

    addEventListener(eventName, callback) {
        const me = this;

        if (!me.listeners.has(eventName)) {
            me.listeners.set(eventName, []);
        }

        me.listeners.get(eventName).push(callback);
    }

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

    dispatchEvent (eventName) {
        const me = this;

        if (!me.listeners.has(eventName)) {
            return true;
        }

        const stack = me.listeners.get(eventName);

        for (let i = 0, l = stack.length; i < l; i++) {
            stack[i].call(me);
        }

        return;
    }
}

export default Events;