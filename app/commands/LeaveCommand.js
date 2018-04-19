import { ChatTypes } from '../Enum';
import { Command } from './command';

export class LeaveCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'leave',
            ['!leave', '!remove'],
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

        await this.clients.main.part(target);
        this.respond(channel, userstate, `Left @${target}'s channel.`);
    }
}
