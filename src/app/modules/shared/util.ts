import { ValidatorFn, AbstractControl } from '@angular/forms';

const DOCKER_LOGS_SEPARATORS = [
    '00000000',
    '01000000',
    '02000000',
    '03000000', // This is not in the Docker docs, but can actually happen when the log stream is broken https://github.com/caprover/caprover/issues/366
];

export class ConfigParser {
    constructor(private readonly values: any) { }

    parse(value: string) {
        let match;

        while (match = /\$\$([a-z_]+)/g.exec(value)) {
            const variableName = match[0];

            // replace variables with empty string if no value is found
            const val = this.values[variableName] || '';

            value = value.replace(variableName, val);
        }

        return value;
    }
}

export const regexFromString = (regEx) => {
    // SOURCE: https://stackoverflow.com/questions/39154255/converting-regexp-to-string-then-back-to-regexp
    let parts = /\/(.*)\/(.*)/.exec(regEx);

    return new RegExp(parts[1], parts[2])
};

export function regexValidator(pattern: string): ValidatorFn {
    const regex = regexFromString(pattern);

    return (control: AbstractControl): { [key: string]: any } | null => {
        if (regex.test(control.value)) {
            return null;
        }

        return {
            pattern: {
                pattern: regex.toString(),
                value: control.value
            }
        }
    }
};

export const parseToken = (token) => {
    if (!token) {
        return {};
    }

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export const hexToString = (hex: string) => {
    if (!hex) {
        return '';
    }

    return decodeURIComponent(hex.substring(8, hex.length).replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'));
};

export const hexLogsToArray = (hexLogs: string) => {
    const lineSeparator = new RegExp(DOCKER_LOGS_SEPARATORS.join('|'), 'g');

    return hexLogs.split(lineSeparator).map(line => hexToString(line));
};