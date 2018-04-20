import * as Factories from '../../dbd.gg/app/js/factories';
import {
    Amounts,
    Types,
    Rarities,
    ItemTypes,
    ModifierTypes,
    Languages,
    TypeNames
} from '../../dbd.gg/app/js/data';
import { EnumToString } from '../../dbd.gg/app/js/react/EnumToString';

export class Stringify {
    static build({
        name,
        player,
        power,
        type,
        perks,
        tiers,
        addons,
        offering
    }) {
        let result = '';

        player = Factories.AllPlayerFactory.get(player);
        result += player.name;

        if (perks.length) {
            perks = perks
                .map(value => Factories.AllPerkFactory.get(value))
                .filter(value => !value.empty);

            result += ' | ';

            perks.map((value, index) => {
                result += value.name;

                if (index !== perks.length - 1) {
                    result += ', ';
                }
            });
        }

        if (type === Types.SURVIVOR) {
            power = Factories.ItemFactory.get(power);

            if (!power.empty) {
                result += ` | ${power.name}`;
            }
        }

        if (addons.length) {
            addons = addons
                .map(value => Factories.AllAddonFactory.get(value))
                .filter(value => !value.empty);

            if (addons.length) {
                result += ' | ';
            }

            addons.map((value, index) => {
                result += value.name;

                if (index !== addons.length - 1) {
                    result += ', ';
                }
            });
        }

        offering = Factories.AllOfferingFactory.get(offering);
        if (!offering.empty) {
            result += ` | ${offering.name}`;
        }

        return result;
    }

    static buildVerbose({
        name,
        player,
        power,
        type,
        perks,
        tiers,
        addons,
        offering
    }) {
        let result = '';

        result += `${name} - ${EnumToString.type(type)} | `;

        player = Factories.AllPlayerFactory.get(player);
        result += player.name;

        if (perks.length) {
            perks = perks
                .map(value => Factories.AllPerkFactory.get(value))
                .filter(value => !value.empty);

            result += ' | PERKS: ';

            perks.map((value, index) => {
                result += value.name;
                if (typeof tiers[index] !== 'undefined') {
                    result += `(${tiers[index]})`;
                } else {
                    result += '(3)';
                }

                if (index !== perks.length - 1) {
                    result += ', ';
                }
            });
        }

        if (type === Types.SURVIVOR) {
            power = Factories.ItemFactory.get(power);

            if (!power.empty) {
                result += ` | ITEM: ${power.name}`;
            }
        }

        if (addons.length) {
            addons = addons
                .map(value => Factories.AllAddonFactory.get(value))
                .filter(value => !value.empty);

            if (addons.length) {
                result += ' | ADDONS: ';
            }

            addons.map((value, index) => {
                result += value.name;

                if (index !== addons.length - 1) {
                    result += ', ';
                }
            });
        }

        offering = Factories.AllOfferingFactory.get(offering);
        if (!offering.empty) {
            result += ` | OFFERING: ${offering.name}`;
        }

        return result;
    }
}
