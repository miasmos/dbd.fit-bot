import { ChatTypes, ErrorTypes } from '../Enum';
import { Command } from './command';
import { API } from '../services/API';

export class BlockCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'block',
            ['!block'],
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

        if (userstate.username !== target) {
            this.error(
                channel,
                userstate,
                ErrorTypes.NOT_ALLOWED,
                'Only the channel owner is allowed.'
            );
            return;
        }

        try {
            this.clients.main.part(target);
            await API.block({ channel: target });
            this.respond(
                channel,
                userstate,
                `Left @${target} 's channel forever. BibleThump`
            );
        } catch (error) {
            this.error(channel, userstate);
        }
    }
}
