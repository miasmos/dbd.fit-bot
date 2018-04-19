import { ChatTypes, ErrorTypes } from '../Enum';

export class Command {
    constructor(
        clients,
        name = 'Command',
        triggers = [],
        chatTypes = [ChatTypes.COMMAND],
        paramCount = 0
    ) {
        this.clients = clients;
        this.triggers = triggers;
        this.name = name;
        this.chatTypes = chatTypes;
        this.paramCount = paramCount;
        this.bound = [];

        if (typeof this.triggers === 'string') {
            this.triggers = [this.triggers];
        }
        if (typeof this.chatTypes === 'string') {
            this.chatTypes = [this.chatTypes];
        }

        this.chatTypes.map(chatType => {
            if (chatType === ChatTypes.COMMAND) {
                this._bind(ChatTypes.CHAT);
            } else {
                this._bind(chatType);
            }

            this.bound.push(chatType);
        });
    }

    _bind(chatType) {
        if (this.bound.indexOf(chatType) === -1) {
            this.clients.main.on(chatType, this._trigger.bind(this));
        }
    }

    _params(message) {
        let lastParam = '',
            result = [];

        const params = message.split(' ').slice(1);

        if (params.length === 1) {
            return params;
        }
        params.map((value, index) => {
            if (index < this.paramCount) {
                result.push(value);
            } else {
                const key = this.paramCount - 1;
                if (result.length === this.paramCount - 1) {
                    result[key] = '';
                }
                result[key] += ' ' + value;
            }
        });
        console.log(result);
        return result;
    }

    _trigger(channel, userstate, message, self) {
        if (self) {
            return;
        }

        // if (message.charAt(0) === '!') {
        //     message = message.slice(1);
        // }

        const command = message.substring(0, message.indexOf(' ')) || message;
        let shouldExecute = false;

        if (this.triggers.indexOf(command) > -1) {
            shouldExecute = true;
        } else {
            return;
        }

        const params = this._params(message);

        if (params.length < this.paramCount) {
            this.error(channel, userstate, ErrorTypes.PARAM_COUNT);
            return;
        }

        if (shouldExecute) {
            this.execute(channel, userstate, params, self);
        }
    }

    execute(channel, userstate, params) {
        this.respond(
            channel,
            userstate,
            `${this.name} command triggered via ${
                userstate['message-type']
            } by ${userstate['username']} with params [${params}].`
        );
    }

    error(channel, userstate, error, context = '') {
        let message = '';
        switch (error) {
            case ErrorTypes.PARAM_COUNT:
                message = `This command requires ${
                    this.paramCount
                } parameters.`;
                break;
            case ErrorTypes.NOT_ALLOWED:
                message = `You can't do that.`;
                break;
            default:
                message = 'An error occurred.';
                break;
        }

        this.respond(
            channel,
            userstate,
            `${message} ${context.length ? '(' + context + ')' : ''}`
        );
    }

    respond(channel, userstate, message) {
        switch (userstate['message-type']) {
            case ChatTypes.WHISPER:
                this.clients.group.whisper(channel, message);
                break;
            case ChatTypes.ACTION:
            case ChatTypes.CHAT:
                this.clients.main.say(channel, message);
                break;
        }
    }
}
