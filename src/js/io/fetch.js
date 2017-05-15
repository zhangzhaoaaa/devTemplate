import {loginFlag, page} from 'util/phpCommon';

var fetch = function(url, options) {
	let domain = options['domain'] || 'domain-data';
	var defaults = {
		url: page[domain] + url,
		type: options['type'],
		dataType: 'json',
		timeout: 30000,
		cache: false
	};
	$.extend(true, defaults, options);
	return $.ajax(defaults);
};


var exp = {};
['get', 'post', 'delete'].forEach(function(method) {
	exp[method] = function(url, options) {
		options = options || {};
		options['type'] = method.toUpperCase();
		return fetch(url, options);
	};
});

module.exports = exp;