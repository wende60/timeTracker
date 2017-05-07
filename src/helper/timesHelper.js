

const timesHelper = {

    leadingZero(number) {
        return number < 10 ? '0' + number : number;
    },

    getFormattedDate(ms) {
        const currentDate = new Date(ms);
        const date = this.leadingZero(currentDate.getDate());
        const month = this.leadingZero(currentDate.getMonth() +1);
        const year = currentDate.getFullYear();
        const dateString = [date, month, year];
        return dateString.join('.');
    },

    getFormattedTime(ms) {
        const currentDate = new Date(ms);
        const hour = this.leadingZero(currentDate.getHours());
        const minutes = this.leadingZero(currentDate.getMinutes());
        const seconds = this.leadingZero(currentDate.getSeconds());
        const timeString = [hour, minutes, seconds]
        return timeString.join(':');
    },

    getRoundedHours(startMs, endMs, digits = 1000) {
        const seconds = (endMs - startMs) / 1000;
        const hours = Math.round((seconds / 3600) * digits) / digits;
        this.sum += hours;
        return hours;
    },

    resetTotal() {
        this.sum = 0;
    },

    getTotal() {
        return this.sum;
    }
}

module.exports = timesHelper;