'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.DateUtils = void 0;
class DateUtils {
	static newDateStringFormat(stringDate, oldFormat, newFormat) {
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
	static generateDateString(seconds = false) {
		const date = new Date();
		const mm = (date.getMonth() + 1).toString().padStart(2, '0'),
			dd = date.getDate().toString().padStart(2, '0'),
			hh = date.getHours().toString().padStart(2, '0'),
			min = date.getMinutes().toString().padStart(2, '0'),
			ss = date.getSeconds().toString().padStart(2, '0');
		return seconds ? `${date.getFullYear()}${mm}${dd}${hh}${min}${ss}` : `${date.getFullYear()}${mm}${dd}${hh}${min}`;
	}
}
exports.DateUtils = DateUtils;
