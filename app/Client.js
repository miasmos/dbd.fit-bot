import * as tmi from 'tmi.js';
import 'request-promise';
import { Env, Config } from './services/Env';
import * as Command from './commands';
import { API } from './services/API';
const credentials = require('../credentials.json');

export class Client {
    constructor() {
        const options = Env.isDevelopment()
            ? {
                  debug: true
              }
            : {};

        const main = new tmi.client({
            options,
            connection: {
                reconnect: true
            },
            identity: {
                username: credentials.username,
                password: credentials.password
            },
            channels: ['#dbdgg']
        });

        const group = new tmi.client({
            options,
            connection: {
                reconnect: true,
                random: 'group'
            },
            identity: {
                username: credentials.username,
                password: credentials.password
            }
        });

        this.options = {
            clientId: credentials.clientId,
            secret: credentials.secret
        };

        main.on('connected', this.onConnected.bind(this));
        this.clients = { main, group };
        this.commands = [];
        main.connect();
        group.connect();
    }

    async initialize() {
        try {
            const channels = await API.channels();

            channels.map(value => {
                if (!value.blocked && value.join) {
                    this.clients.main.join(value.channel);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    onConnected() {
        this.initialize();
        this.clients.main.color('Red');

        this.commands.push(
            new Command.JoinCommand(this.clients),
            new Command.EchoCommand(this.clients),
            new Command.LeaveCommand(this.clients),
            new Command.BlockCommand(this.clients),
            new Command.AllowCommand(this.clients),
            new Command.ViewBuildCommand(this.clients)
        );
    }
}
