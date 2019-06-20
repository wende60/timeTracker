const FORMATS = {
    dmy: {
        formatDate: 'dd.mm.yyyy',
        formatTime: 'hh:mm',
        decimal: [',', '.']
    },
    ydm: {
        formatDate: 'yyyy/dd/mm',
        formatTime: 'h:m', // represents the 12 hours format
        decimal: ['.', ',']
    },
    ymd: {
        formatDate: 'yyyy-mm-dd',
        formatTime: 'hh:mm',
        decimal: ['.', ',']
    }
}

export default FORMATS;
