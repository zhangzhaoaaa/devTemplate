/**
 * [overflow string]
 * @Author: Fu Xiaochun
 * @Email:  fuzhengchun@gomeplus.com
 */

function overflowStr(str,len){
	let newStr = str;
	if (str.length > len) {
		newStr = str.substr(0,len) + '...';
	}
	return newStr;
}

export default overflowStr;