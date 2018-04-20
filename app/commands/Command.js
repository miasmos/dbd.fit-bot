import { ChatTypes, ErrorTypes } from '../Enum';

export class Command {
    constructor(
        clients,
        name = 'Command',
        triggers = [],
        chatTypes = [ChatTypes.COMMAND]
    ) {
        this.clients = clients;
        this.triggers = triggers;
        this.name = name;
        this.chatTypes = chatTypes;
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
        return message.split(' ').slice(1);
    }

    _trigger(channel, userstate, message, self) {
        if (self) {
            return;
        }

        const command = message.substring(0, message.indexOf(' ')) || message;
        let shouldExecute = false;

        if (this.triggers.indexOf(command) > -1) {
            shouldExecute = true;
        } else {
            return;
        }

        const params = this._params(message);

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
            case ErrorTypes.NOT_ALLOWED:
                message = `You can't do that.`;
                break;
            case ErrorTypes.BUILD_NOT_FOUND:
                message = `That build doesn't exist.`;
                break;
            case ErrorTypes.CHANNEL_NOT_FOUND:
                message = "That channel doesn't exist.";
                break;
            case ErrorTypes.MISSING_ID:
                message = 'Build [id] is required.';
                break;
            case ErrorTypes.INVALID_ID:
                message = 'Invalid build [id].';
                break;
            default:
                message = 'An error occurred.';
                break;
        }

        this.respond(
            channel,
            userstate,
            `@${userstate.username} ${message} ${context}`
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
