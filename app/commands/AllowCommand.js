import { ChatTypes, ErrorTypes } from '../Enum';
import { Command } from './command';

export class AllowCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'allow',
            ['!allow'],
            [ChatTypes.COMMAND, ChatTypes.WHISPER],
            0
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

        this.respond(
            channel,
            userstate,
            `I can now join @${target}'s channel. PogChamp`
        );
        // remove blacklist from db
    }
}
