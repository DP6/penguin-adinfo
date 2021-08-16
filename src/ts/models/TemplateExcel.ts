import { Buffer, Fill, Workbook, Worksheet } from 'exceljs';
import { StringUtils } from '../utils/StringUtils';
import { Config } from './Config';

export class TemplateExcel {
	private _config: Config;
	private _validationRules: { [key: string]: string[] };
	private _columns: string[];
	private _workbook: Workbook;
	private _headerColors: { freeForm: string; semiFreeForm: string; restrictedForm: string };

	constructor(config: Config) {
		this._config = config;
		this._validationRules = config.validationRules;
		this._columns = config.columnNames;
		this._headerColors = {
			freeForm: 'FFE2EFDA',
			semiFreeForm: 'FFFFF2CC',
			restrictedForm: 'FFFCE4D6',
		};
		this._workbook = this._createTemplateExcel();
	}

	get headerColors(): { freeForm: string; semiFreeForm: string; restrictedForm: string } {
		return this._headerColors;
	}

	/**
	 * Criar o template em formato Excel .xlsx.
	 * @returns Workbook Excel com abas 'Template' e 'Validation' populados de acordo com a configuração de validação do AdInfo.
	 */
	private _createTemplateExcel(): Workbook {
		const workbook = new Workbook();
		this._addExcelCoverWorksheet(workbook);
		this._addExcelValidationWorksheet(workbook);
		this._addExcelTemplateWorksheet(workbook);
		return workbook;
	}

	/**
	 * Criar um buffer a partir do Excel gerado na construção da classe.
	 * @returns Uma Promise que retorna um Buffer a partir do Excel gerado na construção da classe.
	 */
	public getExcelBuffer(): Promise<Buffer> {
		return this._workbook.xlsx.writeBuffer({ filename: 'template.xlsx' });
	}

	/**
	 * Gerar a aba 'cover' no Excel Template, contendo informações do template, como data de download, versão da configuração e legenda das cores do header.
	 * @param workbook Objeto Workbook no qual a aba será gerada.
	 */
	private _addExcelCoverWorksheet(workbook: Workbook): void {
		const coverSheet = workbook.addWorksheet('cover');
		coverSheet.getCell('A1').value = `Template downloaded on: ${new Date()}`;
		coverSheet.getCell('A2').value = `Configuration version: ${this._config.version}`;
		coverSheet.getCell('A4').value = 'Color labels';
		coverSheet.getCell('A5').fill = this.getCellStyleFill(this._headerColors.freeForm);
		coverSheet.getCell('B5').value = 'Free field';
		coverSheet.getCell('A6').fill = this.getCellStyleFill(this._headerColors.semiFreeForm);
		coverSheet.getCell('B6').value = 'Free field, that needs to match the regular expression shown on note';
		coverSheet.getCell('A7').fill = this.getCellStyleFill(this._headerColors.restrictedForm);
		coverSheet.getCell('B7').value = 'Field restricted by the values list pre-defined on configuration';
	}

	/**
	 * Gerar a aba de 'Validation' no Excel Template, com os valores populados para validação.
	 * @param workbook Objeto Workbook no qual a aba será gerada.
	 */
	private _addExcelValidationWorksheet(workbook: Workbook): void {
		const validationSheet = workbook.addWorksheet('validation');
		this._setExcelWorksheetHeader(validationSheet);
		this._setHeaderFormat(validationSheet);
		this._setValidationExcelWorksheetValues(validationSheet);
	}

	/**
	 * Gerar a aba de 'Template' no Excel Template, com os campos e validações populados para uso.
	 * @param workbook Objeto Workbook no qual a aba será gerada.
	 */
	private _addExcelTemplateWorksheet(workbook: Workbook): void {
		const templateSheet = workbook.addWorksheet('template');
		this._setExcelWorksheetHeader(templateSheet);
		this._setHeaderFormat(templateSheet);
		this._setTemplateExcelWorksheetDataValidation(templateSheet);
	}

	/**
	 * Nomear as colunas e inserir os valores dos campos na aba do Excel, com os valores de acordo com a configuração de validação do AdInfo.
	 * @param worksheet Objeto Worksheet (aba do Excel) no qual terá os campos inseridos e as colunas nomeadas.
	 */
	private _setExcelWorksheetHeader(worksheet: Worksheet): void {
		const columns = ['url', ...this._columns];
		worksheet.columns = columns.map((column) => {
			return {
				header: column,
				key: column,
				width: 20,
			};
		});
	}

	/**
	 * Inserir o nome do campo e os valores de cada campo que serão usados para validação de dados, de acordo com a configuração de validação do AdInfo.
	 * Caso a regra de validação dos dados seja uma expressão regular, ela não entrará como opção de valor.
	 * @param validationWorksheet Objeto Worksheet (aba do Excel) referente à aba de validação.
	 */
	private _setValidationExcelWorksheetValues(validationWorksheet: Worksheet): void {
		this._columns.forEach((column) => {
			validationWorksheet.getColumn(column).values = [
				column,
				...this._validationRules[column].filter((item) => !StringUtils.isStringForRegex(item)),
			];
		});
	}

	/**
	 * Aplicação da formatação do header, com a formatação da cor de fundo da célula e a adição da nota, quando necessária.
	 * @param worksheet Objeto Worksheet
	 */
	private _setHeaderFormat(worksheet: Worksheet): void {
		const columns = ['url', ...this._columns];
		columns.forEach((column) => {
			const cell = worksheet.getRow(1).getCell(column);
			const config = this.getHeaderConfig(column);
			cell.style = {
				fill: this.getCellStyleFill(config.backgroundColor),
				font: {
					bold: true,
				},
			};
			if (config.note)
				cell.note = {
					texts: [
						{
							text: config.note,
						},
					],
				};
		});
	}

	/**
	 * Retorna a configuração da célula do header de acordo com o nome da coluna.
	 * @param column Nome da coluna
	 * @returns JSON que contém:
	 * 	- backgroundColor: o ARGB da cor de fundo da célula
	 *  - note: se o campo for de preenchimento livre ou de preenchimento restrito, retornará note como null. Caso contrário, ou seja, o campo tenha validação de valores com uma regexp, que não seja tudo, a nota vai conter a regexp correspondente.
	 */
	getHeaderConfig(column: string): { note: string; backgroundColor: string } {
		if (column === 'url')
			return {
				note: null,
				backgroundColor: this._headerColors.freeForm,
			};
		const validationRules = this._validationRules[column];
		if (validationRules.filter((rule) => StringUtils.isStringForRegexAll(rule)).length > 0)
			return {
				note: null,
				backgroundColor: this._headerColors.freeForm,
			};
		else if (validationRules.filter((rule) => StringUtils.isStringForRegex(rule)).length > 0)
			return {
				note: `Regexp: ${validationRules.filter((rule) => StringUtils.isStringForRegex(rule)).join(' ou ')}`,
				backgroundColor: this._headerColors.semiFreeForm,
			};
		else
			return {
				note: null,
				backgroundColor: this._headerColors.restrictedForm,
			};
	}

	/**
	 * Aplicar a validação de dados nos campos do template, de acordo com a configuração de validação do AdInfo, para as primeiras 1000 linhas.
	 * @param templateWorksheet Objecto worksheet (aba do Excel) referente à aba de template.
	 */
	private _setTemplateExcelWorksheetDataValidation(templateWorksheet: Worksheet): void {
		this._columns.forEach((column) => {
			const columnLetter = templateWorksheet.getColumn(column).letter;
			for (let i = 2; i < 1003; i++) {
				templateWorksheet.getCell(columnLetter + i).dataValidation = {
					type: 'list',
					allowBlank: false,
					formulae: [`=validation!$${columnLetter}$2:$${columnLetter}$1000`],
				};
			}
		});
	}

	/**
	 * Retorna a configuração da cor de fundo da célula do Excel.
	 * @param argb String que corresponde ao código argb da cor de funco da célula do Excel.
	 * @returns Fill: Objeto utilizado na configuração da cor de fundo da célula do Excel.
	 */
	getCellStyleFill(argb: string): Fill {
		return {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {
				argb: argb,
			},
		};
	}
}
