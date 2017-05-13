import './TimeView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import TimeButton from '../TimeButton/TimeButton.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimesLimited
} from '../../helper/customersHelper.js';

class TimeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            times: null,
            record: null
        }

        pouchDB.init();
        pouchDB.findDocs(this.displayGetTimes, queryTimesLimited(this.props.projectId));
    }

    componentWillMount() {
        this.setState(this.state);
    }

    createNewTimeRecord = (mode, useCallback = true) => {
        const eventTime = new Date().getTime();
        const callback = useCallback ? this.displayGetTimes : null;
        const timeRecord = mode === 'start' ?
            createTimeRecord(
                eventTime,
                eventTime,
                0,
                this.props.customerId,
                this.props.customer.name,
                this.props.projectId,
                this.props.project.name) :
            Object.assign({}, this.state.record, { end: eventTime });

        if (mode === 'start') {
            this.setState({ record: timeRecord });
            pouchDB.addDocToList(timeRecord, callback, queryTimesLimited(this.props.projectId));
        } else {
            this.setState({ record: null });
            pouchDB.updateAndFind(timeRecord, callback, queryTimesLimited(this.props.projectId));
        }
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

        pouchDB.updateAndFind(timeRecord, this.displayGetTimes, queryTimesLimited(this.props.projectId));
    }

    displayGetTimes = response => {

        const docs = response.docs.length ? response.docs : null;
        this.setState({ times: docs });
    }

    render() {
        return (
            <div className='timeViewWrapper'>
                <TimeButton
                    buttonClick={this.createNewTimeRecord} />

                {this.state.times &&
                    <TimesList
                        times={this.state.times}
                        updateHandler={this.updateTimeRecord}
                        isRecording={this.state.record} />
                }
            </div>
        );
    }
};

export default TimeView;

