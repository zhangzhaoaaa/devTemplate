/*
 * leftPad('1', '00') -> '01'
 */
export default function leftPad(str, pad) {
	if (typeof str !== 'string') {
		str = JSON.stringify(str);
	}
	return pad.substring(0, pad.length - str.length) + str;
};