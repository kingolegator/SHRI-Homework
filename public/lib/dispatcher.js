export default class Dispatcher {
  constructor() {
    this._callbacks = {};
    this._lastID = 1;
  }

  //registration callback from store
  register(callback) {
    let id = this._lastID++;
    this._callbacks[id] = callback;
    return id;
  };

  // removes a callback from the list of registered callbacks
  unregister(id) {
    delete this._callbacks[id];
  };

  // call all registered callbacks, passing them action
  dispatch(payload) {
    debugger;
    for (const id in this._callbacks) {
      this._invokeCallback(id, payload);
    }
  };

  // execution callback func
  _invokeCallback(id, payload) {
    this._callbacks[id](payload);
  };
};