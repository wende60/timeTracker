import formats from '../config/formats.js';

const timesHelper = {
    defaults: {
        formatRegEx: /(\.|\-|\/|\||\:)/,
        format12HoursRegEx: /^([0-9]{1,2})\s*([A-Z]{2})$/i,
        formatDate: formats.dmy.formatDate, // default
        formatTime: formats.dmy.formatTime,  // default
        regExpDate: false,
        regExpTime: false,
        decimal: formats.dmy.decimal  // default
    },

    init(format) {
        this.config = {
            ...this.defaults,
            ...formats[format]
        };

        const formatPartsDate = this.config.formatDate.split(this.config.formatRegEx);
        const regExpDate = formatPartsDate.map(item => {
            if (/[a-z]/i.exec(item)) {
                return '([0-9]{' + item.length + '})';
            } else {
                return '\\' + item;
            }
        });
        this.config.regExpDate = new RegExp(regExpDate.join(''));

        const formatPartsTime = this.config.formatTime.split(this.config.formatRegEx);
        const regExpTime = formatPartsTime.map(item => {
            if (/[a-z]/i.exec(item)) {
                return item === 'm'
                    ? '([0-9]{1,2}\\s*[a-zA-Z]{2})' // we deal with 'h:m' which represents 12 hours format
                    : '([0-9]{' + item.length + '})';
            } else {
                return '\\' + item;
            }
        });
        this.config.regExpTime = new RegExp(regExpTime.join(''));
    },

    createDateFromString(dateString) {
        let year = 0;
        let month = 0;
        let day = 0;
        let counter = 1;

        const dateParts = this.config.regExpDate.exec(dateString);
        if (!dateParts) {
            return { year, month, day };
        }

        const formatParts = this.config.formatDate.split(this.config.formatRegEx);
        formatParts.forEach(item => {
            switch (item) {
                case 'dd':
                    day = dateParts[counter];
                    counter += 1;
                    break;
                case 'mm':
                    month = dateParts[counter];
                    counter += 1;
                    break;
                case 'yyyy':
                    year = dateParts[counter];
                    counter += 1;
                    break;
            }
        });

        return { year, month, day };
    },

    createTimeFromString(timeString) {
        const timeParts = this.config.regExpTime.exec(timeString);
        let hours = timeParts ? timeParts[1] : 0;
        let minutes = timeParts ? timeParts[2] : 0;

        // 'h:m' represents 12 hours time format
        // minutes will contain the AM / PM suffix
        // recalculate hours and replace suffix from minutes
        if (this.config.formatTime === 'h:m') {
            const minuteParts = this.config.format12HoursRegEx.exec(minutes);
            if (minuteParts) {
                const ampm = minuteParts[2];
                hours = ampm.toLowerCase() === 'pm'
                    ? parseInt(hours) + 12
                    : hours;
                minutes = minuteParts[1];
            }
        }

        return { hours, minutes };
    },

    createDateFromFormattedStrings(dateString, timeString) {
        const { year, month, day} = this.createDateFromString(dateString);
        const { hours, minutes } = this.createTimeFromString(timeString);
        return this.createDateFromParts(year, month, day, hours, minutes);
    },

    createDateFromParts(y,m,d,h = 0, i = 0, s = 0) {
        return new Date(y, m -1, d, h, i, s).getTime();
    },

    createFormattedDate(date, month, year) {
        const formatParts = this.config.formatDate.split(this.config.formatRegEx);
        let dateString = "";
        formatParts.forEach(item => {
            switch (item) {
                case 'dd':
                    dateString += this.leadingZero(date);
                    break;
                case 'mm':
                    dateString += this.leadingZero(month);
                    break;
                case 'yyyy':
                    dateString += year;
                    break;
                default:
                    dateString += item;
            }
        });
        return dateString;
    },

    createFormattedTime(hours, minutes) {
        const formatParts = this.config.formatTime.split(this.config.formatRegEx);
        const hoursInt = parseInt(hours);
        let timeString  = "";
        formatParts.forEach(item => {
            switch (item) {
                case 'h':
                    const hours12h = hoursInt > 12
                        ? hoursInt % 12
                        : hoursInt;
                    timeString += this.leadingZero(hours12h);
                    break;
                case 'hh':
                    timeString += this.leadingZero(hours);
                    break;
                case 'm':
                    const ampm = hoursInt > 12
                        ? 'PM'
                        : 'AM';
                    timeString += this.leadingZero(minutes) + ' ' + ampm;
                    break;
                case 'mm':
                    timeString += this.leadingZero(minutes);
                    break;
                default:
                    timeString += item;
            }
        });
        return timeString;
    },

    leadingZero(number) {
        return number < 10 ? '0' + number : number;
    },

    getFormattedDate(ms) {
        const currentDate = new Date(ms);
        const date = currentDate.getDate();
        const month = currentDate.getMonth() +1;
        const year = currentDate.getFullYear();
        return this.createFormattedDate(date, month, year);
    },

    getFormattedTime(ms) {
        const currentDate = new Date(ms);
        const hour = currentDate.getHours();
        const minute = currentDate.getMinutes();
        return this.createFormattedTime(hour, minute);
    },

    getRoundedHours(startMs, endMs, digits = 1000) {
        const seconds = (endMs - startMs) / 1000;
        const hours = seconds / 3600;

        // also summ up total hours here
        this.sum += hours;
        return this.formatValue(hours);
    },

    resetTotal() {
        this.sum = 0;
    },

    getTotal() {
        return this.formatValue(this.sum);
    },

    formatValue(value) {
        const formatValue = parseFloat(value).toFixed(2);
        const stringValue = formatValue.toString();
        return stringValue.replace(this.config.decimal[1], this.config.decimal[0]);
    },

    getLastDayOfMonth(y,m) {
        const lastDate = new Date(y, m, 0);
        return lastDate.getDate();
    }
};

module.exports = timesHelper;
