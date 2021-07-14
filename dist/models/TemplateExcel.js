'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TemplateExcel = void 0;
const exceljs_1 = require('exceljs');
const StringUtils_1 = require('../utils/StringUtils');
class TemplateExcel {
	constructor(config) {
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
	get headerColors() {
		return this._headerColors;
	}
	_createTemplateExcel() {
		const workbook = new exceljs_1.Workbook();
		this._addExcelCoverWorksheet(workbook);
		this._addExcelValidationWorksheet(workbook);
		this._addExcelTemplateWorksheet(workbook);
		return workbook;
	}
	getExcelBuffer() {
		return this._workbook.xlsx.writeBuffer({ filename: 'template.xlsx' });
	}
	_addExcelCoverWorksheet(workbook) {
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
	_addExcelValidationWorksheet(workbook) {
		const validationSheet = workbook.addWorksheet('validation');
		this._setExcelWorksheetHeader(validationSheet);
		this._setHeaderFormat(validationSheet);
		this._setValidationExcelWorksheetValues(validationSheet);
	}
	_addExcelTemplateWorksheet(workbook) {
		const templateSheet = workbook.addWorksheet('template');
		this._setExcelWorksheetHeader(templateSheet);
		this._setHeaderFormat(templateSheet);
		this._setTemplateExcelWorksheetDataValidation(templateSheet);
	}
	_setExcelWorksheetHeader(worksheet) {
		const columns = ['url', ...this._columns];
		worksheet.columns = columns.map((column) => {
			return {
				header: column,
				key: column,
				width: 20,
			};
		});
	}
	_setValidationExcelWorksheetValues(validationWorksheet) {
		this._columns.forEach((column) => {
			validationWorksheet.getColumn(column).values = [
				column,
				...this._validationRules[column].filter((item) => !StringUtils_1.StringUtils.isStringForRegex(item)),
			];
		});
	}
	_setHeaderFormat(worksheet) {
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
	getHeaderConfig(column) {
		if (column === 'url')
			return {
				note: null,
				backgroundColor: this._headerColors.freeForm,
			};
		const validationRules = this._validationRules[column];
		if (validationRules.filter((rule) => StringUtils_1.StringUtils.isStringForRegexAll(rule)).length > 0)
			return {
				note: null,
				backgroundColor: this._headerColors.freeForm,
			};
		else if (validationRules.filter((rule) => StringUtils_1.StringUtils.isStringForRegex(rule)).length > 0)
			return {
				note: `Regexp: ${validationRules
					.filter((rule) => StringUtils_1.StringUtils.isStringForRegex(rule))
					.join(' ou ')}`,
				backgroundColor: this._headerColors.semiFreeForm,
			};
		else
			return {
				note: null,
				backgroundColor: this._headerColors.restrictedForm,
			};
	}
	_setTemplateExcelWorksheetDataValidation(templateWorksheet) {
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
	getCellStyleFill(argb) {
		return {
			type: 'pattern',
			pattern: 'solid',
			fgColor: {
				argb: argb,
			},
		};
	}
}
exports.TemplateExcel = TemplateExcel;
