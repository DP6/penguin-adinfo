'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.StringUtils = void 0;
class StringUtils {
	/**
	 * Normalização da String
	 * @param string String a ser normalizada
	 * @returns String sanitizada e em letras minusculas
	 *
	 * Passa a string recebia para letras minusculas e retira as acentuações
	 */
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
	/**
	 * Substitui espaços em branco por um caracter
	 * @param string String para substituir os espaços em branco
	 * @param replacer Caracter que substituirá os espaços em branco da string
	 * @returns String com os espaços em branco substituidos pelo caracter informado
	 *
	 * Substitui os espaços em branco da string pelo caracter informado
	 */
	static replaceWhiteSpace(string, replacer) {
		return string.replace(/ /g, replacer);
	}
	/**
	 * Verifica se há string corresponde a um padrão de regex
	 * @param string String a ser validade
	 * @returns Boolean indicando se a string corresponde a um padrão de regex ou não
	 *
	 * Verifica o começo e o final da string, se começar e terminar com barra,
	 * significa que a string refere-se a um padrão de regex
	 */
	static _isStringForRegex(string) {
		return string[0] === '/' && string[string.length - 1] === '/';
	}
	/**
	 * Valida se a String está dentro de um padrão
	 * @param stringToValidate String a ser validada
	 * @param rules Array contendo as string que de comparação ou as regex
	 * @param separator Caracter a ser substituido pelos espaços em brancos.
	 * Por padrão é o próprio espaço em branco para que a string não seja alterada
	 * @returns Informa se a string coincide ou não com as regras informadas
	 *
	 * Dado um array com strings ou padrões de regex, verifica se a string passada é exatamente igual a alguma string contida no array,
	 * ou se corresponde a alguma regex presente no array
	 */
	static validateString(stringToValidate, rules, separator = ' ') {
		const validate = [false];
		rules.forEach((rule) => {
			if (this._isStringForRegex(rule)) {
				//Regex
				const regexRule = new RegExp(rule.slice(1, rule.length - 1));
				validate.push(!!stringToValidate.match(regexRule));
			} else {
				//String
				validate.push(
					stringToValidate.toLocaleLowerCase() ===
						this.replaceWhiteSpace(
							rule.toLocaleLowerCase(),
							separator
						)
				);
			}
		});
		return validate.indexOf(true) !== -1;
	}
}
exports.StringUtils = StringUtils;
