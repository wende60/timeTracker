import pouchdb from 'pouchdb-browser'
import pouchdbFind from 'pouchdb-find';
pouchdb.plugin(pouchdbFind);

export const DB_NAME = 'timeTrackerStore';

const handlePouchDB = {
    init() {
        this.db = new pouchdb(DB_NAME);

        /*
        const changes = this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', function(change) {
            //console.info('db changes', change);
        }).on('error', function (err) {
            //console.log(err);
        });
        */
    },

    async addItem(obj) {
        try {
            const response = this.db.put(obj);
            return response;
        } catch(error) {
            console.info('ADD_ITEM_ERROR', error);
            return null;
        }
    },

    async findItems(findQuery) {
        const { fields, findParams } = findQuery;
        try {
            await this.db.createIndex({ index: { fields }});
            const response = await this.db.find(findParams);
            return response;
        } catch(error) {
            console.info('FIND_ITEMS_ERROR', error);
            return null;
        }
    },

    async deleteItemById(id) {
        const itemData = await this.db.get(id);
        try {
            const response = await this.db.remove(itemData);
            return response;
        } catch(error) {
            console.info('DELETE_ITEM_BY_ID_ERROR', error);
            return null;
        }         
    },

    async deleteItems(deleteQuery) {
        const { fields, findParams } = deleteQuery;
        try {
            await this.db.createIndex({ index: { fields }});
            const response = await this.db.find(findParams);
            if (response) {
                response.docs.forEach(doc => {
                    doc._deleted = true;
                });
                this.db.bulkDocs(response.docs);
            }
            return response;
        } catch(error) {
            console.info('FIND_ITEMS_ERROR', error);
            return null;
        }        
    },

    async replaceItem(obj) {
        const replaceItem = await this.findItemById(obj._id);
        try {
            if (replaceItem) {
                await this.db.remove(replaceItem);
            } 
            const response = await this.db.put(obj);
            return response;
        } catch(error) {
            console.info('REPLACE_ITEM_ERROR', error);
            return null;
        }
    },

    async updateItem(obj) {
        const updateItem = await this.findItemById(obj._id);
        try {
            if (updateItem) {
                obj._rev = updateItem._rev;
            } 
            const response = await this.db.put(obj);
            return response;
        } catch(error) {
            console.info('UPDATE_ITEM_ERROR', error);
            return null;
        } 
    },

    async findItemById(id) {
        try {
            const response = await this.db.get(id);
            return response;
        } catch(error) {
            console.info('FIND_ITEM_BY_ID_ERROR', error);
            return null;
        }
    }
}

module.exports = handlePouchDB;
