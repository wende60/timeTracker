import './MainView.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pouchDB from '../../helper/handlePouchDB.js';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
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

    createNewCustomer = async(addString) => {
        const newCustomer = createCustomer(addString, this.props.customers);
        if (newCustomer) {
            this.setState({ error: false });
            const response = await pouchDB.addItem(newCustomer);
            this.props.setStateCustomers();
        } else {
            const error = translate(this.context, 'errorCustomerAvailable');
            this.setState({ error });
        }
    }

    createNewProject = async(addString) => {
        const newProject = createProject(addString, this.props.customerId, this.props.projects);
        if (newProject) {
            this.setState({ error: false });
            const response = await pouchDB.addItem(newProject);
            this.props.setStateProjects();
        } else {
            const error = translate(this.context, 'errorProjectAvailable');
            this.setState({ error });
        }
    }

    selectCustomer = e => {
        this.setState({ error: false });
        this.props.setStateCustomer(e.currentTarget.dataset.item);
    }

    selectProject = e => {
        this.setState({ error: false });
        this.props.setStateProject(e.currentTarget.dataset.item);
    }

    deleteCustomer = async(e) => {
        this.setState({ error: false });
        const response = await pouchDB.findItemById(e.currentTarget.dataset.item);
        const confirmString = translate(this.context, 'confirmDeleteCustomer', { customer: response.name });
        if (response && confirm(confirmString)) {
            await pouchDB.deleteItems(queryAllCustomerData(response._id));
            this.props.setStateCustomers();
        }
    }

    deleteProject = async(e) => {
        this.setState({ error: false });
        const response = await pouchDB.findItemById(e.currentTarget.dataset.item);
        const confirmString = translate(this.context, 'confirmDeleteProject', { project: response.name });
        if (response && confirm(confirmString)) {
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

MainView.contextType = LocalizationContext;

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

