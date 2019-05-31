import './Home.scss';
import React, { Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import Selections from '../Selections/Selections.js';
import MainView from '../MainView/MainView.js';
import TimeView from '../TimeView/TimeView.js';
import ManageView from '../ManageView/ManageView.js';
import iconOverview from '../../assets/iconsTimeTrackerOverview.svg';
import iconRecord from '../../assets/iconsTimeTrackerRecord.svg';
import iconEdit from '../../assets/iconsTimeTrackerEdit.svg';


import {
    queryCustomers,
    queryProjects
} from '../../helper/customersHelper.js';

export const DEFAULT_STATE = {
    view: 'main',
    error: false,
    customerId: false,
    projectId: false,
    customer: null,
    project: null,
    projects: null
}

class Home extends Component {

    constructor(props) {
        super(props);

        // default state
        this.state = Object.assign({}, DEFAULT_STATE);

        // fallback for customers as it is loades async
        this.state.customers = null;

        pouchDB.init();
        this.getStoredState();
    }

    componentWillMount() {
        this.setState(this.state);
    }

    componentDidUpdate() {
        this.storeState();
    }

    getStoredState = async() => {

        console.info("xxxxxxx")

        const response = await pouchDB.getDataOrNull('storedAppState');



        const doc = response || {};
        const { stateData: { customers = null } = false } = doc;
        if (customers) {
            this.setState(doc.stateData)
        } else {
            pouchDB.findDocs(this.setStateCustomers, queryCustomers());
        }
    };

    setStateCustomers = response => {
        const customers = response.docs || null;
        this.setState({
            customers,
            error: false
        });
    }

    setStateCustomer = response => {
        const customerId = response._id;
        const customer = response;
        this.setState({
            customerId,
            customer,
            error: false
        });
        pouchDB.findDocs(this.setStateProjects, queryProjects(customerId));
    }

    setStateProjects = response => {
        const projects = response.docs || null;
        const project = false;
        this.setState({
            projects,
            project,
            error: false
        });
    }

    setStateProject = response => {
        const projectId = response._id;
        const project = response;
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
            projectId: false,
            customer: this.state.customer,
            project: null,
            projects: this.state.projects
        });
    };

    storeState = () => {
        const currentState = {
            _id: 'storedAppState',
            stateData: this.state
        }
        pouchDB.replaceDoc(currentState);
    }

    changeView = view => e => {
        this.setState({ error: false });
        switch (view) {
            case 'time':
                if (this.state.projectId) {
                    this.setState({ view });
                } else {
                    this.setState({ error: 'Bitte erst Kunde und Projekt wählen' });
                }
                break;
            case 'edit':
                if (this.state.customerId) {
                    this.setState({ view });
                } else {
                    this.setState({ error: 'Bitte zumindestens Kunde, oder Kunde und Projekt wählen' });
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
            main: ['homeButton', 'isActive'],
            time: ['timeButton', timeActiveClass],
            edit: ['editButton', editActiveClass]
        };
        classes[this.state.view].push('selected');

        return (
            <div className='homeWrapper'>
                <div className='selectionBar'>
                    <div>
                        <h1>TimeTracker</h1>
                    </div>
                    <div>
                        <Selections
                            customerClick={this.customerClickHandler}
                            customerName={this.state.customer ? this.state.customer.name : ''}
                            projectName={this.state.project ? this.state.project.name : ''} />
                    </div>
                </div>

                <div className='timeTrackerNavi'>
                    <div>
                        <span className={classes.main.join(' ')}
                            onClick={this.backToMainView} title='Home'
                            dangerouslySetInnerHTML={{__html:iconOverview}}></span>

                        <span className={classes.time.join(' ')}
                            onClick={this.changeView('time')} title='Time'
                            dangerouslySetInnerHTML={{__html:iconRecord}}></span>

                        <span className={classes.edit.join(' ')}
                            onClick={this.changeView('edit')} title='Edit'
                            dangerouslySetInnerHTML={{__html:iconEdit}}></span>
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
                        project={this.state.project} />
                }

                {this.state.view === 'edit' &&
                    <ManageView
                        customerId={this.state.customerId}
                        customer={this.state.customer}
                        projects={this.state.project ?
                            [this.state.project] : this.state.projects} />
                }
            </div>
        );
    }
};

export default Home;

