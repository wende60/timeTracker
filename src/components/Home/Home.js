import './Home.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pouchDB from '../../helper/handlePouchDB.js';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
import Selections from '../Selections/Selections.js';
import MainView from '../MainView/MainView.js';
import TimeView from '../TimeView/TimeView.js';
import ManageView from '../ManageView/ManageView.js';
import UserView from '../UserView/UserView.js';
import iconOverview from '../../assets/iconsTimeTrackerOverview.svg';
import iconRecord from '../../assets/iconsTimeTrackerRecord.svg';
import iconEdit from '../../assets/iconsTimeTrackerEdit.svg';
import iconUser from '../../assets/iconsTimeTrackerUser.svg';

import {
    queryCustomers,
    queryProjects
} from '../../helper/customersHelper.js';

export const DEFAULT_STATE = {
    view: 'main',
    error: false,
    customerId: null,
    projectId: null,
    customer: null,
    project: null,
    projects: null
}

class Home extends PureComponent {
    constructor() {
        super();
        this.runner = null;

        this.state = Object.assign({
            customers: null,
            language: 'de',
            format: 'dmy'
        }, DEFAULT_STATE);

        pouchDB.init();
        this.getStoredState();
    }

    componentDidMount() {
        this.props.changeLanguage(this.state.language);
    }

    componentDidUpdate(_prevProps, prevState) {
        // avoid too many updates of stored state as it results in pochdb update-conflicts
        clearTimeout(this.runner);
        this.runner = setTimeout(() => {
            this.storeState();
        }, 500);

        if (this.state.language !== prevState.language) {
            this.props.changeLanguage(this.state.language);
        }
    }

    getStoredState = async() => {
        const response = await pouchDB.findItemById('storedAppState');
        const stateData = response && response.stateData
            ? response.stateData
            : {};

        // set stored state and add - in case - customers
        this.setState(stateData, () => {
            !this.state.customers && this.setStateCustomers();
        });
    };

    setStateCustomers = async() => {
        const response = await pouchDB.findItems(queryCustomers());
        const customers = response ? response.docs : null;
        this.setState({
            customers,
            error: false
        });
    }

    setStateCustomer = async(item) => {
        const customer = await pouchDB.findItemById(item);
        const customerId = customer ? customer._id : null;
        this.setState({
            customerId,
            customer,
            error: false
        });
        this.setStateProjects();
    }

    setStateProjects = async() => {
        if (!this.state.customerId) {
            return
        }
        const response = await pouchDB.findItems(queryProjects(this.state.customerId));
        const projects = response ? response.docs : null;
        const project = null;
        this.setState({
            projects,
            project,
            error: false
        });
    }

    setStateProject = async(item) => {
        const project = await pouchDB.findItemById(item);
        const projectId = project ? project._id : null;
        const view = 'time';
        this.setState({
            projectId,
            project,
            view,
            error: false
        });
    }

    customerClickHandler = () => {
        this.state.customer && this.setState({
            view: 'main',
            error: false,
            customerId: this.state.customerId,
            projectId: null,
            customer: this.state.customer,
            project: null,
            projects: this.state.projects
        });
    };

    userchangeHandler = (language, format) => {
        this.setState({
            language,
            format
        });
    };

    storeState = () => {
        const currentState = {
            _id: 'storedAppState',
            stateData: this.state
        }
        pouchDB.updateItem(currentState);
    }

    changeView = view => e => {
        this.setState({ error: false });
        const errorTime = translate(this.context, 'errorSelectCustomerAndProject');
        const errorEdit = translate(this.context, 'errorSelectCustomer');
        switch (view) {
            case 'time':
                if (this.state.projectId) {
                    this.setState({ view });
                } else {
                    this.setState({ error: errorTime });
                }
                break;
            case 'edit':
                if (this.state.customerId) {
                    this.setState({ view });
                } else {
                    this.setState({ error: errorEdit });
                }
                break;
            default:
                this.setState({ view });
        }
    }

    backToMainView = () => {
        this.setState(DEFAULT_STATE);
    }

    render() {
        const timeActiveClass = this.state.customerId && this.state.projectId ? 'isActive' : 'inActive';
        const editActiveClass = this.state.customerId ? 'isActive' : 'inActive';
        const classes = {
            main: ['button', 'homeButton', 'isActive'],
            time: ['button', 'timeButton', timeActiveClass],
            edit: ['button', 'editButton', editActiveClass],
            user: ['button', 'userButton', 'isActive']
        };
        classes[this.state.view].push('selected');

        return (
            <div className='homeWrapper'>
                <div className='selectionBar'>
                    <div>
                        <h1>TimeTracker</h1>
                    </div>
                    <div>
                        <LocalizationContext.Consumer>
                            {value => (
                                <Selections
                                    dict={value}
                                    customerClick={this.customerClickHandler}
                                    customerName={this.state.customer ? this.state.customer.name : ''}
                                    projectName={this.state.project ? this.state.project.name : ''} />
                            )}
                        </LocalizationContext.Consumer>
                    </div>
                </div>

                <div className='timeTrackerNavi'>
                    <div>
                        <div className={classes.main.join(' ')}
                            onClick={this.backToMainView} title='Select customer and project'
                            dangerouslySetInnerHTML={{__html:iconOverview}}></div>

                        <div className={classes.time.join(' ')}
                            onClick={this.changeView('time')} title='Push the time-button'
                            dangerouslySetInnerHTML={{__html:iconRecord}}></div>

                        <div className={classes.edit.join(' ')}
                            onClick={this.changeView('edit')} title='Edit time records'
                            dangerouslySetInnerHTML={{__html:iconEdit}}></div>
                    </div>
                    <div>
                        <div className={classes.user.join(' ')}
                            onClick={this.changeView('user')} title='User settings'
                            dangerouslySetInnerHTML={{__html:iconUser}}></div>
                    </div>
                </div>

                {this.state.error &&
                    <div className='messageHeader'>{ this.state.error }</div>
                }

                {this.state.view === 'main' &&
                    <MainView
                        customers={this.state.customers}
                        customerId={this.state.customerId}
                        projectId={this.state.projectId}
                        customer={this.state.customer}
                        projects={this.state.projects}
                        project={this.state.project}
                        setStateCustomers={this.setStateCustomers}
                        setStateProjects={this.setStateProjects}
                        setStateCustomer={this.setStateCustomer}
                        setStateProject={this.setStateProject} />
                }

                {this.state.view === 'time' &&
                    <TimeView
                        customerId={this.state.customerId}
                        projectId={this.state.projectId}
                        customer={this.state.customer}
                        project={this.state.project}
                        format={this.state.format} />
                }

                {this.state.view === 'edit' &&
                    <ManageView
                        customerId={this.state.customerId}
                        customer={this.state.customer}
                        projects={this.state.project ?
                            [this.state.project] : this.state.projects}
                        format={this.state.format} />
                }

                {this.state.view === 'user' &&
                    <UserView
                        language={this.state.language}
                        format={this.state.format}
                        changeHandler={this.userchangeHandler} />
                }
            </div>
        );
    }
};

Home.contextType = LocalizationContext;

Home.propTypes = {
    changeLanguage: PropTypes.func.isRequired
};

export default Home;

