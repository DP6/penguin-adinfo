export class CsvUtils {
	/**
	 * Verifica se o CSV é vazio
	 * @param linesOfCsv Array com as linhas do csv
	 * @returns Booleano indicando se o conteúdo do csv é vazio ou não
	 *
	 * Retorna true caso todas as linhas sejam vazias ou contenham somente espaços em branco
	 */
	private static isCsvEmpty(linesOfCsv: string[]): boolean {
		return linesOfCsv.filter((line) => line.trim() !== '').length === 0;
	}

	/**
	 * Verifica se a linha do CSV é vazia
	 * @param lineOfCsv linha do csv no padrão {coluna: valor}
	 */
	static isLineEmpty(lineOfCsv: { [key: string]: string }): boolean {
		return Object.keys(lineOfCsv).filter((column) => lineOfCsv[column].trim() !== '').length === 0;
	}

	/**
	 * Transformação CSV > JSON
	 * @param csvContent Conteúdo do CSV
	 * @param separator Caracter utilizado na separação de colunas do CSV
	 * @returns Objeto JSON correspondente ao CSV
	 *
	 * Função que converte uma string de um conteúdo CSV em um objeto JSON
	 */
	static csv2json(csvContent: string, separator: string): { [key: string]: string }[] {
		const linesOfCsv = csvContent.split('\n').filter((line) => line.trim() !== '');

		if (this.isCsvEmpty(linesOfCsv)) return [];

		const headers: string[] = [];
		linesOfCsv[0].split(separator).map((header) => {
			headers.push(header.replace('\\r', '').trim());
		});

		const jsonFromCsv: { [key: string]: string }[] = [];
		const body = linesOfCsv.slice(1);
		body.map((line) => {
			const lineInJson: { [key: string]: string } = {};
			line.split(separator).map((item, index) => {
				lineInJson[headers[index]] = item.replace('\r', '').trim();
			});
			jsonFromCsv.push(lineInJson);
		});
		return jsonFromCsv;
	}
	/**
	 * Identificador do separador a ser usado no CSV
	 * @param csvHeader Conteúdo do header do CSV
	 * @param csvSeparatorDefault Lista de separadores configurados para validarmos a prioridade
	 * @returns Separador a ser utilizado
	 * 
	 * Função que identifica o separador utilizado no CSV, de acordo com os separadores já configurados no Config, para utilizarmos na parametrização
	 */

	static identifyCsvSepartor(csvHeader: string, csvSeparatorDefault: string[]): string {
		if (csvSeparatorDefault) {
			let separadorFinal = ',';
			csvSeparatorDefault.forEach((separador) => {
				if (csvHeader.includes(separador)) {
					separadorFinal = separador;
				}
			});
			return separadorFinal;
		} else {
			return csvHeader.includes(',') ? ',' : ';';
		}
	}
}
