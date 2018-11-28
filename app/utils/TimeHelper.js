
export function FormatTime(time) {
	if (time <= 0) return '0s';
    const seconds_in_hour = 3600;
    const seconds_in_minute = 60;
    var hours = time/seconds_in_hour;
    hours = hours >= 1 ? Math.floor(hours) + 'h ' : '';
    var minutes = (time/seconds_in_minute)%seconds_in_minute;
    minutes = minutes >= 1 || hours != '' ? Math.floor(minutes) + 'm ' : '';
    var seconds = time%seconds_in_minute + 's';
    return (hours + minutes + seconds);
}