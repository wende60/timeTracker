
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
    findParams: {
        selector: {
            compare: { $gt: null },
            type: 'customer'
        },
        sort: [{"compare": "asc"}]
    },
    fields: ['compare', 'type']
});

export const queryProjects = customerId => ({
    findParams: {
        selector: { type: 'project', compare: { $gt: null }, customerId },
        sort: [{ 'compare': 'asc' }]
    },
    fields: ['compare', 'type', 'customerId', '_id'],
});

/*
export const queryTimesLimited = (projectId, limit = 1) => ({
    findParams: {
        selector: { type: 'times', projectId, start: { $gt: null }},
        sort: [{ 'start': 'desc' }],
        limit
    },
    fields: ['start', 'type', 'projectId', '_id'],
});
*/

export const queryTimesLimited = (projectId, limit = 1) => ({
    findParams: {
        selector: { type: 'times', projectId},
        sort: [{ '_id': 'desc' }],
        limit
    },
    fields: ['_id', 'type', 'projectId'],
});

export const queryTimes = projectId => ({
    findParams: {
        selector: { type: 'times', projectId, start: { $gt: null }},
        sort: [{ 'start': 'desc' }]
    },
    fields: ['start', 'type', 'projectId', '_id']
});

export const queryTimesCustomer = customerId => ({
    findParams: {
        selector: { type: 'times', customerId, projectId: { $gt: null }, start: { $gt: null }},
        sort: [{ 'projectId': 'asc' }, { 'start': 'asc' }]
    },
    fields: ['projectId', 'start', 'type', 'customerId']
});

export const queryTimesCustomerFiltered = (customerId, filterTimeStart, filterTimeEnd) => ({
    findParams: {
        selector: { type: 'times', customerId, projectId: { $gt: null }, start: {
            $gte: filterTimeStart,
            $lte: filterTimeEnd
        }},
        sort: [{ 'projectId': 'asc' }, { 'start': 'asc' }]
    },
    fields: ['projectId', 'start', 'type', 'customerId']
});

export const queryAllCustomerData = customerId => ({
    findParams: {
        selector: {
            $or: [
                { customerId },
                { _id: customerId }
            ]
        },
    },
    fields: ['customerId', '_id'],
});

export const queryAllProjectData = projectId => ({
    findParams: {
        selector: {
            $or: [
                { projectId },
                { _id: projectId }
            ]
        },
    },
    fields: ['projectId', '_id'],
});

/**
 * ------------------------
 * Times helper
 * ------------------------
 */
export const createTimeRecord = (id, start, end = 0, customerId, customerName, projectId, projectName) => {
    const timeNow = new Date();
    return {
        _id: id.toString(),
        type: 'times',
        start,
        end,
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
    const isAvailable = allCustomers && allCustomers.find(customer => {
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
    const isAvailable = allProjects && allProjects.find(project => {
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



