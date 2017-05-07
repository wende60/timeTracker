import './MainView.scss';
import React, { PropTypes, Component } from 'react';
import pouchDB from '../../helper/handlePouchDB.js';
import ItemForm from '../ItemForm/ItemForm.js';

import {
    createCustomer,
    createProject,
    queryCustomers,
    queryProjects,
    queryAllProjectData,
    queryAllCustomerData
} from '../../helper/customersHelper.js';

class MainView extends Component {
    constructor(props) {
        super(props);
        this.state = { error: false };

        pouchDB.init();
    }

    componentWillMount() {
        this.setState(this.state);
    }

    componentWillReceiveProps() {
        this.setState({ error: false });
    }

    createNewCustomer = addString => {
        const newCustomer = createCustomer(addString, this.props.customers);
        if (newCustomer) {
            pouchDB.addDocToList(newCustomer, this.props.setStateCustomers, queryCustomers());
        } else {
            this.setState({ error: 'Diesen Kunden gibt es schon!' });
        }
    }

    createNewProject = addString => {
        const newProject = createProject(addString, this.props.customerId, this.props.projects);
        if (newProject) {
            pouchDB.addDocToList(newProject, this.props.setStateProjects, queryProjects(this.props.customerId));
        } else {
            this.setState({ error: 'Dieses Projekt gibt es schon!' });
        }
    }

    selectCustomer = e => {
        pouchDB.getData(e.currentTarget.dataset.item, this.props.setStateCustomer);
    }

    selectProject = e => {
        pouchDB.getData(e.currentTarget.dataset.item, this.props.setStateProject);
    }

    deleteCustomer = e => {
        pouchDB.getData(e.currentTarget.dataset.item, this.executeDeleteCustomer)
    }

    executeDeleteCustomer = response => {
        if (confirm('Echt jetzt, Kunde ' + response.name + ' mit allen Projekten und Zeiten löschen?')) {
            pouchDB.deleteDocs(queryAllCustomerData(response._id), this.props.setStateCustomers, queryCustomers());
        }
    }

    deleteProject = e => {
        pouchDB.getData(e.currentTarget.dataset.item, this.executeDeleteProject)
    }

    executeDeleteProject = response => {
        if (confirm('Echt jetzt, Projekt ' + response.name + ' mit allen Zeiten löschen?')) {
            pouchDB.deleteDocs(queryAllProjectData(response._id), this.props.setStateProjects, queryProjects(this.props.customerId));
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

export default MainView;

