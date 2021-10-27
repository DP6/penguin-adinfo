export class DateUtils {
	/**
	 * Altera o formato da string correspondente a data
	 * @param stringDate String correspondente a data
	 * @param oldFormat Padrão da data atual
	 * @param newFormat Novo padrão da data
	 * @returns String correspondente a data com o novo padrão informado
	 *
	 * Padrões de data:
	 * s: segundo
	 * M: minuto
	 * h: hora
	 * d: dia
	 * m: mês
	 * y: ano
	 * O caracter deve ser repetido de acordo com quantos caracteres representam aquela informação
	 * Exemplo: 30/12/2020 Padrão da string: dd/mm/yyyy
	 */
	static newDateStringFormat(stringDate: string, oldFormat: string, newFormat: string): string {
		let second = '';
		let minute = '';
		let hour = '';
		let day = '';
		let month = '';
		let year = '';
		for (let i = 0; i <= stringDate.length; i++) {
			switch (oldFormat[i]) {
				case 's':
					second += stringDate[i];
					break;
				case 'M':
					minute += stringDate[i];
					break;
				case 'h':
					hour += stringDate[i];
					break;
				case 'd':
					day += stringDate[i];
					break;
				case 'm':
					month += stringDate[i];
					break;
				case 'y':
					year += stringDate[i];
					break;
			}
		}
		return newFormat
			.replace(/s+/, second)
			.replace(/M+/, minute)
			.replace(/h+/, hour)
			.replace(/d+/, day)
			.replace(/m+/, month)
			.replace(/y+/, year);
	}

	/**
	 * Gera uma string correspondente ao timestamp atual
	 * @param seconds Boolean informando se o retorno contará com a informação de segundos. Esse parametro é false por padrão
	 * @returns String correspondente ao timestamp atual
	 *
	 * Gera uma stirng correspondente ao timestamp atual no padrão: yyyymmddhhMMss (segundos estão por padrão desabilitados)
	 */
	static generateDateString(seconds = false): string {
		const date = new Date();
		const mm = (date.getMonth() + 1).toString().padStart(2, '0'),
			dd = date.getDate().toString().padStart(2, '0'),
			hh = date.getHours().toString().padStart(2, '0'),
			min = date.getMinutes().toString().padStart(2, '0'),
			ss = date.getSeconds().toString().padStart(2, '0');
		return seconds ? `${date.getFullYear()}${mm}${dd}${hh}${min}${ss}` : `${date.getFullYear()}${mm}${dd}${hh}${min}`;
	}

	/**
	 * Gera uma string correspondente ao dia atual, no formato YYYY-MM-DD
	 * @returns String correspondente ao dia atual
	 */
	static today(): string {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();

		return `${year}-${month}-${day}`;
	}
}
