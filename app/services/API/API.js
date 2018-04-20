var rp = require('request-promise');
import { Config } from '../Config';
import { Env } from '../Env';

class APIClass {
    constructor() {
        this.url = `${Config.protocol}://${Config.host}:${Config.port}`;
    }

    block(params) {
        return this.request(`/chat/block`, params);
    }

    allow(params) {
        return this.request(`/chat/allow`, params);
    }

    join(params) {
        return this.request(`/chat/join`, params);
    }

    leave(params) {
        return this.request(`/chat/leave`, params);
    }

    view(params) {
        return this.request(`/chat/view`, params);
    }

    channel(params) {
        return this.request(`/chat/channel`, params);
    }

    channels(params) {
        return this.request(`/chat/channels`, params);
    }

    build(params) {
        return this.request(`/build/get`, params);
    }

    request(path, params) {
        return new Promise((resolve, reject) => {
            rp({
                uri: `${this.url}${path}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                json: true,
                body: params
            })
                .then(json => resolve(json.data))
                .catch(error => {
                    reject(error.response.body);
                });
        });
    }
}

export const API = new APIClass();
