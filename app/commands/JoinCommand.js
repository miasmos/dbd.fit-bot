import { ChatTypes } from '../Enum';
import { Command } from './command';

export class JoinCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'join',
            ['!join', '!add'],
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

        await this.clients.main.join(target);
        this.respond(channel, userstate, `Joined @${target}'s channel.`);
    }
}
