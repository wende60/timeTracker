import './TimeView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import TimeButton from '../TimeButton/TimeButton.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimes
} from '../../helper/customersHelper.js';

class TimeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            times: null,
            record: null
        }

        pouchDB.init();
        pouchDB.findDocs(this.displayGetTimes, queryTimes(this.props.projectId));
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
                this.props.customerId,
                this.props.customer.name,
                this.props.projectId,
                this.props.project.name) :
            Object.assign({}, this.state.record, { end: eventTime });

        if (mode === 'start') {
            this.setState({ record: timeRecord });
            pouchDB.addDocToList(timeRecord, callback, queryTimes(this.props.projectId));
        } else {
            this.setState({ record: null });
            pouchDB.updateAndFind(timeRecord, callback, queryTimes(this.props.projectId));
        }
    }

    displayGetTimes = response => {

        const docs = response.docs.length ? response.docs : null;
        this.setState({ times: docs });
    }

    render() {
        return (
            <div className='TimeViewWrapper'>
                <TimeButton
                    buttonClick={this.createNewTimeRecord} />

                {this.state.times &&
                    <TimesList
                        times={this.state.times} />
                }
            </div>
        );
    }
};

export default TimeView;

