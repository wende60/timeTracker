import './ManageView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import TimesFilter from '../TimesFilter/TimesFilter.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimesCustomer,
    queryTimesCustomerFiltered,
    createCompareString
} from '../../helper/customersHelper.js';
import timesHelper from '../../helper/timesHelper.js';

// todo, set locale here
timesHelper.init();

const isElectron = require('is-electron-renderer') ? true : false;
let ipcRenderer = false;
if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

const CSV = ';';

class ManageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTimes: null
        }

        pouchDB.init();
        pouchDB.findDocs(this.displayCustomerTimes, queryTimesCustomer(this.props.customerId));
    }

    componentWillMount() {
        this.setState(this.state);
    }

    updateTimeRecord = (id, start, end, customerId, customerName, projectId, projectName) => {
        const timeRecord = createTimeRecord(
                id,
                start,
                end,
                customerId,
                customerName,
                projectId,
                projectName);

        pouchDB.updateAndFind(timeRecord, this.displayCustomerTimes, queryTimesCustomer(this.props.customerId));
    }

    displayCustomerTimes = response => {
        let projectTimes = this.props.projects.map(project => {
            return {
                projectId: project._id,
                projectName: project.name,
                times: response.docs.filter(doc => {
                    return doc.projectId === project._id;
                })
            }
        });
        if (!projectTimes.length) {
            projectTimes = null;
        };

        this.setState({ projectTimes });
        console.info(projectTimes)
    }

    printTimes = projectData => e => {
        if (ipcRenderer) {
            timesHelper.resetTotal();

            const fileName = this.props.customer.compare + '-' +
                createCompareString(projectData.projectName) + '.csv';
            const filecontent = [];
            filecontent.push('Customer' + CSV + this.props.customer.name + CSV + CSV);
            filecontent.push('Project' + CSV + projectData.projectName + CSV + CSV);
            filecontent.push(CSV + CSV  + CSV);
            filecontent.push('Datum' + CSV + 'Start' + CSV + 'Ende' + CSV + 'Dauer');

            projectData.times.map(row => {
                const fileContentRow = [];
                fileContentRow.push(timesHelper.getFormattedDate(row.start));
                fileContentRow.push(timesHelper.getFormattedTime(row.start));
                fileContentRow.push(timesHelper.getFormattedTime(row.end));
                fileContentRow.push(timesHelper.getRoundedHours(row.start, row.end) + ' h');
                filecontent.push(fileContentRow.join(CSV))
            });
            filecontent.push(CSV + CSV  + CSV + timesHelper.getTotal() + ' h');
            // empty footer line as number-bugfix
            filecontent.push(CSV + CSV  + CSV);
            const filecontentString = filecontent.join('\n');

            ipcRenderer.sendSync('synchronous-message',
                {defaultPath: fileName, fileContent: filecontentString});
        } else {
            console.info('Print not available');
        }
    }

    createProjectBlocks = projectTimes => {
        return projectTimes.map((projectData, index) => {
            return (
                <div key={index}>
                    <h3>{projectData.projectName}</h3>
                    <TimesList
                        times={projectData.times}
                        updateHandler={this.updateTimeRecord}
                        isRecording={false} />
                    <div className='printButtonWrapper'>
                        <div className='printButton' onClick={this.printTimes(projectData)}>Export</div>
                    </div>
                </div>
            )
        })
    }

    timesFilterChange = (filterTimeStart, filterTimeEnd) => {
        if (filterTimeStart && filterTimeEnd) {
            pouchDB.findDocs(this.displayCustomerTimes,
                queryTimesCustomerFiltered(this.props.customerId, filterTimeStart, filterTimeEnd));
        } else {
            pouchDB.findDocs(this.displayCustomerTimes, queryTimesCustomer(this.props.customerId));
        }
    }

    render() {
        return (
            <div className='manageViewWrapper'>
                {this.state.projectTimes ?
                    <div>
                        <TimesFilter
                            timesFilterChange={this.timesFilterChange} />
                        {this.createProjectBlocks(this.state.projectTimes)}
                    </div> : <h3>Keine Zeiten verfügbar</h3>
                }
            </div>
        )
    };
};

export default ManageView;

