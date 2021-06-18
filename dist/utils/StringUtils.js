"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = void 0;
class StringUtils {
    static normalize(string) {
        return string
            .toLowerCase()
            .replace(/[áàãâä]/gi, 'a')
            .replace(/[éèêë]/gi, 'e')
            .replace(/[íìîï]/gi, 'i')
            .replace(/[óòõôö]/gi, 'o')
            .replace(/[úùûü]/gi, 'u')
            .replace(/[ç]/gi, 'c');
    }
    static replaceWhiteSpace(string, replacer) {
        return string.replace(/ /g, replacer);
    }
    static isStringForRegex(string) {
        return string[0] === '/' && string[string.length - 1] === '/';
    }
    static validateString(stringToValidate, rules, separator = ' ') {
        const validate = [false];
        rules.forEach((rule) => {
            if (this.isStringForRegex(rule)) {
                const regexRule = new RegExp(rule.slice(1, rule.length - 1));
                validate.push(!!stringToValidate.match(regexRule));
            }
            else {
                validate.push(stringToValidate.toLocaleLowerCase() === this.replaceWhiteSpace(rule.toLocaleLowerCase(), separator));
            }
        });
        return validate.indexOf(true) !== -1;
    }
    static isEmpty(string) {
        return !string;
    }
}
exports.StringUtils = StringUtils;
