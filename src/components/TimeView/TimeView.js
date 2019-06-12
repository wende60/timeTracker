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
        this.displayGetTimes();
    }

    componentWillMount() {
        this.setState(this.state);
    }

    createNewTimeRecord = async(mode, useCallback = true) => {
        const eventTime = new Date().getTime();
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
            await pouchDB.addItem(timeRecord);
        } else {
            this.setState({ record: null });
            await pouchDB.updateItem(timeRecord);
        }

        useCallback && this.displayGetTimes();
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

        pouchDB.updateItem(timeRecord);
        this.displayGetTimes();
    }

    displayGetTimes = async() => {
        const response = await pouchDB.findItems(queryTimesLimited(this.props.projectId));
        const times = response && response.docs.length > 0
            ? response.docs 
            : null;
        this.setState({ times });
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
                        deleteHandler={null}
                        isRecording={this.state.record}
                        updated={0} />
                }
            </div>
        );
    }
};

export default TimeView;

