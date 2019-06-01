import './MainView.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pouchDB from '../../helper/handlePouchDB.js';
import ItemForm from '../ItemForm/ItemForm.js';

import {
    createCustomer,
    createProject,
    queryAllProjectData,
    queryAllCustomerData
} from '../../helper/customersHelper.js';

class MainView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { 
            error: false 
        };

        pouchDB.init();
    }

    componentWillMount() {
        this.setState(this.state);
    }

    componentWillReceiveProps() {
        this.setState({ error: false });
    }

    createNewCustomer = async(addString) => {
        const newCustomer = createCustomer(addString, this.props.customers);
        if (newCustomer) {
            const response = await pouchDB.addItem(newCustomer);
            this.props.setStateCustomers();
        } else {
            this.setState({ error: 'Diesen Kunden gibt es schon!' });
        }
    }

    createNewProject = async(addString) => {
        const newProject = createProject(addString, this.props.customerId, this.props.projects);
        if (newProject) {
            const response = await pouchDB.addItem(newProject);
            this.props.setStateProjects();
        } else {
            this.setState({ error: 'Dieses Projekt gibt es schon!' });
        }
    }

    selectCustomer = e => {
        this.props.setStateCustomer(e.currentTarget.dataset.item);
    }

    selectProject = e => {
        this.props.setStateProject(e.currentTarget.dataset.item);
    }

    deleteCustomer = async(e) => {
        const response = await pouchDB.findItemById(e.currentTarget.dataset.item);
        if (response && confirm('Echt jetzt, Kunde ' + response.name + ' mit allen Projekten und Zeiten löschen?')) {
            await pouchDB.deleteItems(queryAllCustomerData(response._id));
            this.props.setStateCustomers();
        }
    }

    deleteProject = async(e) => {
        const response = await pouchDB.findItemById(e.currentTarget.dataset.item);
        if (response && confirm('Echt jetzt, Projekt ' + response.name + ' mit allen Zeiten löschen?')) {
            await pouchDB.deleteItems(queryAllProjectData(response._id));
            this.props.setStateProjects();
        }
    }

    render() {
        return (
            <div className='mainViewWrapper'>

                {this.state.error &&
                    <div className="errorMessage">
                        {this.state.error}
                    </div>
                }

                {!this.props.customer &&
                    <ItemForm
                        buttonClick={this.createNewCustomer}
                        items={this.props.customers}
                        mode='customer'
                        selectClick={this.selectCustomer}
                        deleteClick={this.deleteCustomer} />
                }

                {this.props.customer &&
                    <ItemForm
                        buttonClick={this.createNewProject}
                        items={this.props.projects}
                        mode='project'
                        selectClick={this.selectProject}
                        deleteClick={this.deleteProject} />
                }

            </div>
        );
    }
};

MainView.propTypes = {
    customers: PropTypes.array,
    customerId: PropTypes.string,
    projectId: PropTypes.string,
    customer: PropTypes.object,
    projects: PropTypes.array,
    project: PropTypes.object,
    setStateCustomers: PropTypes.func.isRequired,
    setStateProjects: PropTypes.func.isRequired,
    setStateCustomer: PropTypes.func.isRequired,
    setStateProject: PropTypes.func.isRequired
};

export default MainView;

