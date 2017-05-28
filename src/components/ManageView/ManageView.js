import './ManageView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimesCustomer
} from '../../helper/customersHelper.js';

const isElectron = require('is-electron-renderer') ? true : false;
let ipcRenderer = false;
if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

console.info("ipcRenderer", ipcRenderer);

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

    printTimes = data => e => {
        //console.info('printTimes', data);
        if (ipcRenderer) {
            ipcRenderer.sendSync('synchronous-message', data);
        } else {
            console.info('Print not available');
        }
    }

    createProjectBlock = projectTimes => {
        return projectTimes.map((projectData, index) => {
            return (
                <div key={index}>
                    <h3>{projectData.projectName}</h3>
                    <TimesList
                        times={projectData.times}
                        updateHandler={this.updateTimeRecord}
                        isRecording={false} />
                    <div onClick={this.printTimes(projectData)}>PRINT</div>
                </div>
            )
        })
    }

    render() {
        return (
            <div className='manageViewWrapper'>
                {this.state.projectTimes ?
                    this.createProjectBlock(this.state.projectTimes) : <h3>Keine Zeiten verfügbar</h3>
                }
            </div>
        )
    };
};

export default ManageView;

