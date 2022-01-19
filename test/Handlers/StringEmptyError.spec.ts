import { expect } from 'chai';
import { StringEmptyHandler } from '../../src/ts/Handlers/StringEmptyHandler'

describe('StringEmptyHandler', () => {
	describe('Valida o Handler String Empty', () => {
		it('Validação caso a string seja vazia', () => {
			const empty = new StringEmptyHandler();
            let errorName: string;
            try {
                empty.handle('');
            } catch(e) {
                errorName = e.name;
            }
			expect(errorName).to.equal('StringEmptyError');
		});
		it('Validação caso a string não seja vazia', () => {
			const empty = new StringEmptyHandler();
            let result: boolean;
            let errorName: string;
            try {
                result = empty.handle('string não vazia!');
            } catch(e) {
                errorName = e.name;
            }
			expect(result).to.equal(true);
		});
	});
});
