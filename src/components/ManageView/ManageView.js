import './ManageView.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pouchDB from '../../helper/handlePouchDB.js';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
import TimesFilter from '../TimesFilter/TimesFilter.js';
import TimesList from '../TimesList/TimesList.js';
import {
    createTimeRecord,
    queryTimesCustomer,
    queryTimesCustomerFiltered
} from '../../helper/customersHelper.js';
import { exportTimes } from '../../helper/exportTimes.js';

class ManageView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            projectTimes: null,
            initialCall: false,
            updated: '0',
            filterTimeStart: false,
            filterTimeEnd: false
        }

        pouchDB.init();
        this.displayCustomerTimes(queryTimesCustomer(this.props.customerId));
    }

    componentWillMount() {
        this.setState(this.state);
    }

    getQueryForState() {
        const { filterTimeStart, filterTimeEnd } = this.state;
        return filterTimeStart && filterTimeEnd
            ? queryTimesCustomerFiltered(this.props.customerId, filterTimeStart, filterTimeEnd)
            : queryTimesCustomer(this.props.customerId);
    }

    updateTimeRecord = async(id, start, end, customerId, customerName, projectId, projectName) => {
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
        await pouchDB.updateItem(timeRecord);

        const query = this.getQueryForState();
        this.displayCustomerTimes(query);
    }

    deleteTimeRecord = async(rowData) => {
        const timeRecordString = rowData.formattedStartDate + ' ' + rowData.formattedStartTime;
        const confirmString = translate(this.context, 'confirmDeleteTime', { time: timeRecordString });
        if (confirm(confirmString)) {
            this.setState({ updated: '0' });
            await pouchDB.deleteItemById(rowData._id);

            const query = this.getQueryForState();
            this.displayCustomerTimes(query);
        }
    }

    displayCustomerTimes = async(query) => {
        const response = await pouchDB.findItems(query);
        const timeList = response ? response.docs : [];

        let projectTimes = this.props.projects.map(project => {
            return {
                projectId: project._id,
                projectName: project.name,
                times: timeList.filter(doc => doc.projectId === project._id)
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
                    {projectData.times.length
                        ?   <div>
                                <h3>
                                    <div>{translate(this.context, 'project')}: </div>
                                    {projectData.projectName}
                                </h3>

                                <LocalizationContext.Consumer>
                                    {value => (
                                        <TimesList
                                            dict={value}
                                            times={projectData.times}
                                            updateHandler={this.updateTimeRecord}
                                            deleteHandler={this.deleteTimeRecord}
                                            updated={this.state.updated}
                                            format={this.props.format} />
                                    )}
                                </LocalizationContext.Consumer>

                                <div className='printButtonWrapper'>
                                    <div
                                        className='printButton'
                                        onClick={exportTimes(this.props.customer, projectData, this.context, this.props.format)}>
                                        {translate(this.context, 'export')}
                                    </div>
                                </div>
                            </div>
                        :   <div>
                                <h3>
                                    <div>{translate(this.context, 'project')}: </div>
                                    {projectData.projectName}
                                </h3>
                                <div className='messageHeader'>
                                    {translate(this.context, 'errorFilter')}
                                </div>
                            </div>
                    }
                </div>
            )
        })
    }

    timesFilterChange = (filterTimeStart, filterTimeEnd) => {
        this.setState({ filterTimeStart, filterTimeEnd }, () => {
            const query = this.getQueryForState();
            this.displayCustomerTimes(query);
        });
    }

    createCustomerMessageHeader = () => {
        const header = this.state.initialCall
            ? <div className='messageHeader'>Für diesen Kunden gibt es noch kein Projekt</div>
            : null;
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

ManageView.contextType = LocalizationContext;

ManageView.propTypes = {
    customerId: PropTypes.string.isRequired,
    customer: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    format: PropTypes.string.isRequired
};

export default ManageView;

