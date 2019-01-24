export function FormatTime(time) {
	var modifier = '';
	if (time < 0) 
	{
		modifier = '-';
		time *= -1;
	}
    const seconds_in_hour = 3600;
    const seconds_in_minute = 60;
    var hours = time/seconds_in_hour;
    hours = hours >= 1 ? Math.floor(hours) + 'h ' : '';
    var minutes = (time/seconds_in_minute)%seconds_in_minute;
    minutes = minutes >= 1 || hours != '' ? Math.floor(minutes) + 'm ' : '';
    var seconds = time%seconds_in_minute + 's';
    return modifier + (hours + minutes + seconds);
}

export function ParseTime(strTime) {
	if (!ValidateTime(strTime) || !strTime) return null;
	var timeArray = strTime.match(/\d+[hms]/g);
	var hours = ReturnTimeBySuffix(timeArray, 'h');
	var minutes = ReturnTimeBySuffix(timeArray, 'm');
	var seconds = ReturnTimeBySuffix(timeArray, 's');
	return (hours * 3600) + (minutes * 60) + seconds;
}

export function ValidateTime(strTime) {
	var regex = new RegExp(/^([1-2]*[0-9]h)*( )*([1-6]*[0-9]m)*( )*([1-6]*[0-9]s)*$/);
	return regex.test(strTime);
}

function ReturnTimeBySuffix(timeArray, suffix)
{
	var result = timeArray.find(function(element) { return element.includes(suffix) });
	if (!result) return 0;
	return parseInt(result.replace(suffix, ''));
}