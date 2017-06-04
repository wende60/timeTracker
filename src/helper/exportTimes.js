import timesHelper from './timesHelper.js';
import { createCompareString } from './customersHelper.js';

// todo, set locale here
timesHelper.init();

const isElectron = require('is-electron-renderer') ? true : false;
let ipcRenderer = false;
if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

const CSV = ';';

export const exportTimes = (customer, projectData) => e => {
    if (ipcRenderer) {
        // hour counter reset
        timesHelper.resetTotal();

        // create csv customer data
        const fileName = customer.compare + '-' + createCompareString(projectData.projectName) + '.csv';
        const filecontent = [];
        filecontent.push('Customer' + CSV + customer.name + CSV + CSV + CSV);
        filecontent.push('Project' + CSV + projectData.projectName + CSV + CSV + CSV);
        filecontent.push(CSV + CSV  + CSV + CSV);

        // create csv data header
        filecontent.push('Startdatum' + CSV + 'Startzeit' + CSV + 'Enddatum' + CSV + 'Endzeit' + CSV + 'Dauer');

        // create each row
        projectData.times.map(row => {
            const fileContentRow = [];
            fileContentRow.push(timesHelper.getFormattedDate(row.start));
            fileContentRow.push(timesHelper.getFormattedTime(row.start));
            fileContentRow.push(timesHelper.getFormattedDate(row.end));
            fileContentRow.push(timesHelper.getFormattedTime(row.end));
            fileContentRow.push(timesHelper.getRoundedHours(row.start, row.end) + ' h');
            filecontent.push(fileContentRow.join(CSV))
        });
        filecontent.push(CSV + CSV  + CSV + CSV + timesHelper.getTotal() + ' h');

        // empty footer line as number-bugfix
        filecontent.push(CSV + CSV  + CSV + CSV);
        const filecontentString = filecontent.join('\n');

        // send to main process
        ipcRenderer.sendSync('synchronous-message',
            {defaultPath: fileName, fileContent: filecontentString});
    } else {
        console.info('Export is not available in web environment');
    }
}