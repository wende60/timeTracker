import './ManageView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import TimesFilter from '../TimesFilter/TimesFilter.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimesCustomer,
    queryTimesCustomerFiltered
} from '../../helper/customersHelper.js';
import { exportTimes } from '../../helper/exportTimes.js';

class ManageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTimes: null,
            initialCall: false,
            updated: 0
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
            projectName
        );

        this.setState({ updated: id });
        pouchDB.updateAndFind(timeRecord, this.displayCustomerTimes, queryTimesCustomer(this.props.customerId));
    }

    deleteTimeRecord = rowData => {
        const timeRecordString = rowData.formattedStartDate + ' ' + rowData.formattedStartTime;
        if (confirm('Echt jetzt, Zeiterfassung vom ' + timeRecordString + ' löschen?')) {
            this.setState({ updated: 0 });
            pouchDB.deleteDoc(rowData._id, this.displayCustomerTimes, queryTimesCustomer(this.props.customerId));
        }
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

        this.setState({ projectTimes, initialCall: true });
    }

    createProjectBlocks = projectTimes => {
        return projectTimes.map((projectData, index) => {
            return (
                <div key={index} className='projectBlockWrapper'>
                    {projectData.times.length ?
                        <div>
                            <h3>
                                <div>Projekt: </div>
                                {projectData.projectName}
                            </h3>
                            <TimesList
                                times={projectData.times}
                                updateHandler={this.updateTimeRecord}
                                deleteHandler={this.deleteTimeRecord}
                                isRecording={false}
                                updated={this.state.updated} />
                            <div className='printButtonWrapper'>
                                <div className='printButton' onClick={exportTimes(this.props.customer, projectData)}>Export</div>
                            </div>
                        </div> : <div className='messageHeader'>In diesem Zeitraum sind keine Zeiten verfügbar</div>
                    }
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

    createCustomerMessageHeader = () => {
        const header = this.state.initialCall ?
                        <div className='messageHeader'>Für diesen Kunden gibt es noch kein Projekt</div> : null;
        return header;
    }

    render() {
        return (
            <div className='manageViewWrapper'>
                {this.state.projectTimes ?
                    <div>
                        <TimesFilter
                            timesFilterChange={this.timesFilterChange} />
                        {this.createProjectBlocks(this.state.projectTimes)}
                    </div> :
                    <div>
                        {this.createCustomerMessageHeader()}
                    </div>
                }
            </div>
        )
    };
};

export default ManageView;

