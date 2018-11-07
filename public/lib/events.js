export default class Events {
    constructor() {
        this.events = {};
    }

    bind(event, callback) {
        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(callback);
    };

    unbind(event, callback) {
        this._events = this._events || {};
        if (event in this._events === false) {
            return;
        }
        this._events[event].splice(this._events[event].indexOf(callback), 1);
    };

    trigger(event) {
        this._events = this._events || {};
        if (event in this._events === false) {
            return;
        };
        for (var i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
};