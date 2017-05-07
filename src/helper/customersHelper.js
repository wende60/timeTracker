
/**
 * ------------------------
 * Common helper
 * ------------------------
 */
export const createCompareString = string => {
    return string.toLowerCase().replace(/\s/g,'')
}

/**
 * ------------------------
 * queries
 * ------------------------
 */
export const queryCustomers = () => ({
    selector: { type: 'customer', compare: { $gt: null }},
    fields: ['compare', 'type', '_id'],
    sort: [{"compare": "asc"}]
});

export const queryProjects = customerId => ({
    selector: { type: 'project', compare: { $gt: null }, customerId },
    fields: ['compare', 'type', 'customerId', '_id'],
    sort: [{"compare": "asc"}]
});

export const queryTimes = projectId => ({
    selector: { type: 'times', projectId },
    fields: ['type', 'projectId', '_id'],
    sort: [{ _id: 'desc' }]
});

export const queryAllCustomerData = customerId => ({
    selector: {
        $or: [
            { customerId },
            { _id: customerId }
        ]
    },
    fields: ['customerId', '_id'],
    sort: null
});

export const queryAllProjectData = projectId => ({
    selector: {
        $or: [
            { projectId },
            { _id: projectId }
        ]
    },
    fields: ['projectId', '_id'],
    sort: null
});

/**
 * ------------------------
 * Times helper
 * ------------------------
 */
export const createTimeRecord = (start, customerId, customerName, projectId, projectName) => {
    const timeNow = new Date();
    return {
        _id: start.toString(),
        type: 'times',
        start,
        end: 0,
        customerId,
        customerName,
        projectId,
        projectName
    }
}

/**
 * ------------------------
 * Customer helper
 * ------------------------
 */
export const createCustomer = (addCustomer, allCustomers) => {
    const compare = createCompareString(addCustomer);
    const isAvailable = allCustomers.find(customer => {
        return compare === customer.compare;
    });

    if (isAvailable) {
        return false;
    } else {
        const timeNow = new Date();
        return {
            _id: timeNow.getTime().toString(),
            type: 'customer',
            name: addCustomer,
            compare
        }
    }
}

/**
 * ------------------------
 * Project helper
 * ------------------------
 */
export const createProject = (addProject, customerId, allProjects) => {
    const compare = createCompareString(addProject);
    const isAvailable = allProjects.find(project => {
        return compare === project.compare;
    });

    if (isAvailable) {
        return false;
    } else {
        const timeNow = new Date();
        return {
            _id: timeNow.getTime().toString(),
            type: 'project',
            name: addProject,
            customerId,
            compare
        }
    }
}



