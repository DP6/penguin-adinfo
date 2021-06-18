'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.TemplateExcel = void 0;
const exceljs_1 = require('exceljs');
const StringUtils_1 = require('../utils/StringUtils');
class TemplateExcel {
	constructor(config) {
		this._config = config;
		this._validationRules = config.validationRules;
		this._columns = Object.keys(this._validationRules);
		this._workbook = this.createTemplateExcel();
	}
	createTemplateExcel() {
		const workbook = new exceljs_1.Workbook();
		this.addExcelCoverWorksheet(workbook);
		this.addExcelValidationWorksheet(workbook);
		this.addExcelTemplateWorksheet(workbook);
		return workbook;
	}
	getExcelBuffer() {
		return this._workbook.xlsx.writeBuffer({ filename: 'template.xlsx' });
	}
	addExcelCoverWorksheet(workbook) {
		const coverSheet = workbook.addWorksheet('cover');
		coverSheet.getCell('A1').value = `Template downloaded on: ${new Date()}`;
		coverSheet.getCell('A2').value = `Configuration version: ${this._config.version}`;
	}
	addExcelValidationWorksheet(workbook) {
		const validationTemplate = workbook.addWorksheet('validation');
		this.setExcelWorksheetHeader(validationTemplate);
		this.setValidationExcelWorksheetValues(validationTemplate);
	}
	addExcelTemplateWorksheet(workbook) {
		const templateSheet = workbook.addWorksheet('template');
		this.setExcelWorksheetHeader(templateSheet);
		this.setTemplateExcelWorksheetDataValidation(templateSheet);
	}
	setExcelWorksheetHeader(worksheet) {
		const columns = ['url', ...this._columns];
		worksheet.columns = columns.map((column) => {
			return {
				header: column,
				key: column,
				width: 20,
			};
		});
	}
	setValidationExcelWorksheetValues(validationWorksheet) {
		this._columns.forEach((column) => {
			validationWorksheet.getColumn(column).values = [column, ...this._validationRules[column]];
		});
	}
	setTemplateExcelWorksheetDataValidation(templateWorksheet) {
		this._columns.forEach((column) => {
			if (!StringUtils_1.StringUtils.isStringForRegex(this._validationRules[column][0])) {
				const validationCount = this._validationRules[column].length;
				let columnLetter = templateWorksheet.getColumn(column).letter;
				for (let i = 2; i < 1003; i++) {
					templateWorksheet.getCell(columnLetter + i).dataValidation = {
						type: 'list',
						allowBlank: false,
						formulae: [`=validation!$${columnLetter}$2:$${columnLetter}$${validationCount + 1}`],
					};
				}
			}
		});
	}
	checkRegex(string) {
		return string.match(/^\/.*\/$/) !== null;
	}
}
exports.TemplateExcel = TemplateExcel;
