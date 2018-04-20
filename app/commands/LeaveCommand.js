import { ChatTypes } from '../Enum';
import { Command } from './command';
import { API } from '../services/API';

export class LeaveCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'leave',
            ['!leave', '!remove'],
            [ChatTypes.COMMAND, ChatTypes.WHISPER]
        );
    }

    async execute(channel, userstate, params = []) {
        let target;
        if (params.length && !!params[0]) {
            target = params[0] || '';
        } else {
            target = userstate.username;
        }

        try {
            await this.clients.main.part(target);
            await API.leave({ channel: target });
            this.respond(channel, userstate, `Left @${target} 's channel.`);
        } catch (error) {
            let message;
            switch (error) {
                case TwitchErrors.NO_RESPONSE:
                    message = ErrorTypes.CHANNEL_NOT_FOUND;
            }

            this.error(channel, userstate, message);
        }
    }
}
