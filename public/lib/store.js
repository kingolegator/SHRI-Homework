
import Events from "./events.js";

export default class Store extends Events {
    constructor(data) {
        super();
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
};