var isToday = function(date){
	var today = new Date();
	return (date.getFullYear() + date.getMonth() + date.getDate()) === (today.getFullYear() + today.getMonth() + today.getDate());
};

export default isToday;