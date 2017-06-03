
const timesHelper = {
    config: {
        formatRegEx: /(\.|\-|\/|\||\:)/,
        formatDate: 'dd.mm.yyyy',
        formatTime: 'hh:mm',
        regExpDate: false,
        regExpTime: false,
        decimal: [',', '.'] // replace second with first
    },

    init() {
        console.info('INIT');
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
                return '([0-9]{' + item.length + '})';
            } else {
                return '\\' + item;
            }
        });
        this.config.regExpTime = new RegExp(regExpTime.join(''));
    },

    createDateFromFormattedStrings(dateString, timeString) {
        const dateParts = this.config.regExpDate.exec(dateString);
        const timeParts = this.config.regExpTime.exec(timeString);

        if (!dateParts || !timeParts) {
            return false;
        }
        return new Date(
            dateParts[3],
            dateParts[2] -1,
            dateParts[1],
            timeParts[1],
            timeParts[2],
            timeParts[3] || 0).getTime();
    },

    createDateFromParts(y,m,d,h = 0, i = 0, s = 0) {
        return new Date(y, m -1, d, h, i, s).getTime();
    },

    createFormattedDate(date, month, year) {
        const formatParts = this.config.formatDate.split(this.config.formatRegEx);
        let dateString = "";
        formatParts.forEach(item => {
            switch (item) {
                case 'd':
                    dateString += date;
                    break;
                case 'dd':
                    dateString += this.leadingZero(date);
                    break;
                case 'm':
                    dateString += month;
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

    createFormattedTime(hour, minute) {
        const formatParts = this.config.formatTime.split(this.config.formatRegEx);
        let timeString  = "";
        formatParts.forEach(item => {
            switch (item) {
                case 'h':
                    timeString += hour;
                    break;
                case 'hh':
                    timeString += this.leadingZero(hour);
                    break;
                case 'm':
                    timeString += minute;
                    break;
                case 'mm':
                    timeString += this.leadingZero(minute);
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

