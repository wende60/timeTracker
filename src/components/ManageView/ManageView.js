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

    createProjectBlocks = projectTimes => {
        return projectTimes.map((projectData, index) => {
            return (
                <div key={index}>
                    {projectData.times.length ?
                        <div>
                            <h3>{projectData.projectName}</h3>
                            <TimesList
                                times={projectData.times}
                                updateHandler={this.updateTimeRecord}
                                isRecording={false}
                                updated={this.state.updated} />
                            <div className='printButtonWrapper'>
                                <div className='printButton' onClick={exportTimes(this.props.customer, projectData)}>Export</div>
                            </div>
                        </div> : <h3 className='messageHeader'>In diesem Zeitraum sind keine Zeiten verfügbar</h3>
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

    render() {
        return (
            <div className='manageViewWrapper'>
                {this.state.projectTimes ?
                    <div>
                        <TimesFilter
                            timesFilterChange={this.timesFilterChange} />
                        {this.createProjectBlocks(this.state.projectTimes)}
                    </div> : <h3 className='messageHeader'>Für diesen Kunden gibt es noch kein Projekt</h3>
                }
            </div>
        )
    };
};

export default ManageView;

