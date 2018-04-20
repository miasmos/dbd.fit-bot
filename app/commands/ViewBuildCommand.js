import { ChatTypes, ErrorTypes } from '../Enum';
import { Command } from './command';
import { API } from '../services/API';
import { Stringify } from '../Stringify';
import { BuildOutputs } from '../Enum';

export class ViewBuildCommand extends Command {
    constructor(clients) {
        super(
            clients,
            'viewBuild',
            ['!build'],
            [ChatTypes.COMMAND, ChatTypes.WHISPER]
        );
    }

    async execute(channel, userstate, params = []) {
        let hash = params[0];
        const modifier = params[1];

        if (typeof hash === 'undefined') {
            this.error(channel, userstate, ErrorTypes.MISSING_ID);
            return;
        } else if (hash.length === 0 || hash.length > 25) {
            this.error(channel, userstate, ErrorTypes.INVALID_ID);
            return;
        }

        try {
            const json = await API.build({ hash });
            const link = `https://dbd.gg/${hash}`;
            let response;

            if (modifier === BuildOutputs.VERBOSE) {
                response = Stringify.buildVerbose(json);
            } else {
                response = Stringify.build(json);
            }

            this.respond(channel, userstate, `${response} | ${link}`);
        } catch (error) {
            let message;
            switch (error.status) {
                case 404:
                    message = ErrorTypes.BUILD_NOT_FOUND;
                    break;
            }
            this.error(channel, userstate, message);
        }
    }
}
