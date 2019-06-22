import timesHelper from './timesHelper.js';
import { createCompareString } from './customersHelper.js';
import translate from './translate.js';

const isElectron = process.env.NODE_ENV === 'electron' ? true : false;
let ipcRenderer = false;
if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

const CSV = ';';

export const exportTimes = (customer, projectData, phrases, format) => e => {
    if (ipcRenderer) {
        timesHelper.init(format);
        timesHelper.resetTotal();

        // create csv customer data
        const fileName = customer.compare + '-' + createCompareString(projectData.projectName) + '.csv';
        const filecontent = [];
        filecontent.push(translate(phrases, 'customer') + ': ' + CSV + customer.name + CSV + CSV + CSV);
        filecontent.push(translate(phrases, 'project') + ': ' + CSV + projectData.projectName + CSV + CSV + CSV);
        filecontent.push(CSV + CSV  + CSV + CSV);

        // create csv data header
        const headerRow = [
            translate(phrases, 'startDate'),
            translate(phrases, 'startTime'),
            translate(phrases, 'endDate'),
            translate(phrases, 'endTime'),
            translate(phrases, 'duration')
        ];
        const header = headerRow.join(CSV);
        filecontent.push(header);

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

