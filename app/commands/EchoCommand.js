import { ChatTypes } from '../Enum';
import { Command } from './command';

export class EchoCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'echo',
            ['!echo', '!say'],
            [ChatTypes.COMMAND, ChatTypes.WHISPER],
            1
        );
    }

    execute(channel, userstate, params = []) {
        this.respond(channel, userstate, params.toString());
    }
}
