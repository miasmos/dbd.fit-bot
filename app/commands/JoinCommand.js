import { ChatTypes, ErrorTypes, TwitchErrors } from '../Enum';
import { Command } from './command';
import { API } from '../services/API';

export class JoinCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'join',
            ['!join', '!add'],
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
            const json = await API.channel({ channel: target });
            if (!!json && json.blocked) {
                this.respond(
                    channel,
                    userstate,
                    `I am blocked from joining @${target} 's channel.`
                );
                return;
            }

            await API.join({ channel: target });
            await this.clients.main.join(target);
            this.respond(channel, userstate, `Joined @${target} 's channel.`);
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
