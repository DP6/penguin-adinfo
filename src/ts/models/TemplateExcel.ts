import { Buffer, Workbook, Worksheet } from 'exceljs';
import { StringUtils } from '../utils/StringUtils';
import { Config } from './Config';

export class TemplateExcel {
    private _config: Config;
    private _validationRules: { [key:string]: string[] };
    private _columns: string[];
    private _workbook: Workbook;

    constructor(config: Config) {
        this._config = config;
        this._validationRules = config.validationRules;
        this._columns = Object.keys(this._validationRules);
        this._workbook = this.createTemplateExcel();
    }

    /**
	 * Criar o template em formato Excel .xlsx.
     * @returns Workbook Excel com abas 'Template' e 'Validation' populados de acordo com a configuração de validação do AdInfo.
	 */
	private createTemplateExcel(): Workbook {
		const workbook = new Workbook();
        this.addExcelCoverWorksheet(workbook);
        this.addExcelValidationWorksheet(workbook);
        this.addExcelTemplateWorksheet(workbook);
        return workbook;
	}

    /**
     * Criar um buffer a partir do Excel gerado na construção da classe.
     * @returns Uma Promise que retorna um Buffer a partir do Excel gerado na construção da classe.
     */
    public getExcelBuffer(): Promise<Buffer> {
        return this._workbook.xlsx.writeBuffer({filename: 'template.xlsx'});
    }

    /**
     * Gerar a aba 'cover' no Excel Template, contendo informações do template, como data de download e versão da configuração.
     * @param workbook Objeto Workbook no qual a aba será gerada.
     */
    private addExcelCoverWorksheet(workbook: Workbook): void {
        const coverSheet = workbook.addWorksheet('cover');
        coverSheet.getCell('A1').value = `Template downloaded on: ${new Date()}`;
        coverSheet.getCell('A2').value = `Configuration version: ${this._config.version}`
    }

    /**
     * Gerar a aba de 'Validation' no Excel Template, com os valores populados para validação.
     * @param workbook Objeto Workbook no qual a aba será gerada.
     */
    private addExcelValidationWorksheet(workbook: Workbook): void {
        const validationTemplate = workbook.addWorksheet('validation');
        this.setExcelWorksheetHeader(validationTemplate);
        this.setValidationExcelWorksheetValues(validationTemplate);
    }

    /**
     * Gerar a aba de 'Template' no Excel Template, com os campos e validações populados para uso.
     * @param workbook Objeto Workbook no qual a aba será gerada.
     */
    private addExcelTemplateWorksheet(workbook: Workbook): void {
        const templateSheet = workbook.addWorksheet('template');
        this.setExcelWorksheetHeader(templateSheet);
        this.setTemplateExcelWorksheetDataValidation(templateSheet);
    }

    /**
     * Nomear as colunas e inserir os valores dos campos na aba do Excel, com os valores de acordo com a configuração de validação do AdInfo.
     * @param worksheet Objeto Worksheet (aba do Excel) no qual terá os campos inseridos e as colunas nomeadas.
     */
    private setExcelWorksheetHeader(worksheet: Worksheet): void {
        const columns = ["url", ...this._columns];
        worksheet.columns = columns.map(column => {
            return {
                header: column,
                key: column,
                width: 20
            }
        })
    }

    /**
     * Inserir o nome do campo e os valores de cada campo que serão usados para validação de dados, de acordo com a configuração de validação do AdInfo.
     * @param validationWorksheet Objeto Worksheet (aba do Excel) referente à aba de validação.
     */
    private setValidationExcelWorksheetValues(validationWorksheet: Worksheet): void {
        this._columns.forEach(column => {
            validationWorksheet.getColumn(column).values = [column, ...this._validationRules[column]];
        })
    }

    /**
     * Aplicar a validação de dados nos campos do template, de acordo com a configuração de validação do AdInfo, para as primeiras 1000 linhas.
     * @param templateWorksheet Objecto worksheet (aba do Excel) referente à aba de template.
     */
    private setTemplateExcelWorksheetDataValidation(templateWorksheet: Worksheet): void {
        this._columns.forEach(column => {
            if (!StringUtils.isStringForRegex(this._validationRules[column][0])) {
                const validationCount = this._validationRules[column].length;
                let columnLetter = templateWorksheet.getColumn(column).letter;
                for(let i = 2; i < 1003; i++) {
                    templateWorksheet.getCell(columnLetter + i).dataValidation = {
                        type: 'list',
                        allowBlank: false,
                        formulae: [`=validation!$${columnLetter}$2:$${columnLetter}$${validationCount + 1}`]
                    };
                }
            }
        })
    }
}