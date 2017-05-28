//import pouchdb from 'pouchdb';
import pouchdb from 'pouchdb-browser'
import pouchdbFind from 'pouchdb-find';
pouchdb.plugin(pouchdbFind);
pouchdb.debug.disable('pouchdb:find');

export const DB_NAME = 'timeTrackerStore';

const handlePouchDB = {

    init() {
        //this.db = new pouchdb(DB_NAME);
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

    addDocToList(obj, cb = null, findQuery = null) {
        this.db.put(obj, (err, response) => {
            if (err) {
                return console.info("addDocToList put error", err);
            }
            if (cb) {
                this.findDocs(cb, findQuery);
            }
        });
    },

    addSingleDoc(obj, cb = null) {
        this.db.put(obj, (err, response) => {
            if (err) {
                return console.info("addSingleDoc put error", err);
            }
            if (cb) {
                this.getData(obj._id, cb);
            }
        });
    },

    findDocs(cb, findQuery) {
        const { fields, findParams } = findQuery;

        this.db.createIndex({ index: { fields }}, () => {
            this.db.find(findParams, (err, response) => {
                if (err) {
                    return console.info("findDocs error", err);
                }
                cb(response);
            })
        });
    },

    deleteDoc(id, cb = null, findQuery = null) {
        this.db.get(id, (err, doc) => {
            if (err) {
                return console.info("deleteDoc get error", err);
            }
            this.db.remove(doc, (err, response) => {
                if (err) {
                    return console.info("deleteDoc remove error", err);
                }
                if (cb) {
                    this.findDocs(cb, findQuery);
                }
            });
        });
    },

    deleteDocs(deleteQuery, cb = null, findQuery = null) {
        const { fields, findParams } = deleteQuery;

        this.db.createIndex({ index: { fields }}, () => {
            this.db.find(findParams, (err, response) => {
                if (err) {
                    return console.info("deleteDocs find error", err);
                }

                // mark to delete
                response.docs.forEach(doc => {
                    doc._deleted = true;
                });

                // put to remove
                this.db.bulkDocs(response.docs, (rmErr, rmResponse) => {
                    if (cb) {
                        this.findDocs(cb, findQuery);
                    }
                });
            });
        });
    },

    allDocs() {
        this.db.allDocs({
            include_docs: true
        }, (err, response) => {
            if (err) {
                return console.info("allDocs error", err);
            }
            console.info(response);
        });
    },

    replaceDoc(obj, cb = null) {
        this.db.get(obj._id, (err, doc) => {

            if (typeof doc === 'undefined') {
                return this.addSingleDoc(obj, cb);
            }

            this.db.remove(doc, err => {
                if (err) {
                    return console.info("replaceDoc remove error", err);
                }
                this.addSingleDoc(obj, cb);
            });
        });
    },

    updateAndFind(obj, cb = null, findQuery = null) {
        this.db.get(obj._id, (err, doc) =>{
            if (err) {
                return console.info("updateDoc get error", err);
            }
            if (doc) {
                obj._rev = doc._rev;
            }

            this.db.put(obj, (err, response) => {
                if (err) {
                    return console.info("updateDoc put error", err);
                }
                if (cb) {
                    this.findDocs(cb, findQuery);
                }
            });
        });
    },

    getData(id, cb = null) {
        this.db.get(id, (err, response) => {
            if (err) {
                return console.info("getData get error", err);
            }
            if (cb) {
                cb(response);
            }
        });
    },

    getDataOrNull(id, cb) {
        this.db.get(id, (err, response) => {
            const returnValue = err ? null : response;
            cb(returnValue);
        });
    }
}


module.exports = handlePouchDB;


