var rp = require('request-promise');
import { Config } from '../Config';
import { Env } from '../Env';

class APIClass {
    constructor() {
        this.url = Env.isDevelopment() ? `${Config.protocol}://${Config.host}:${Config.port}` : `${Config.protocol}://${Config.host}`;
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
                    console.error(error)
                    reject('response' in error && 'body' in error.response ? error.response.body : error)
                });
        });
    }
}

export const API = new APIClass();
