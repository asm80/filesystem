// indexedDB connector

export class IDBFS {
    #dbhandler;
    #idb;
    #db;
    #version;

    async opendb() {
        return new Promise((resolve, reject) => {
            let request = this.#dbhandler.open(this.#db,this.#version);
            request.onupgradeneeded = function() {
                let db = request.result
                if (!db.objectStoreNames.contains('files')) {
                    // Creates an object store:
                    db.createObjectStore('files',{ keyPath: 'filename' });
                }
            }  
            request.onsuccess = function(event) {
                let db = event.target.result
                resolve(db)
            };
        })
    }

    constructor(indexedDB, db = "asm80", version = 1) {
        this.#dbhandler = indexedDB;
        this.#db = db;
        this.#version = version;
    }
    

    readFile(name) {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.get(name);
                dataRequest.onsuccess = function(event) {
                    let e = event.target.result
                    if (typeof e == "undefined") return reject("File not found");
                    resolve(event.target.result.data);
                };
                dataRequest.onerror = function(event) {
                    
                    reject(event.target.error);
                }

            })
        })
    }

    writeFile(name, data) {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.put({filename:name, data:data, mtime:new Date().getTime()});
                dataRequest.onsuccess = function(event) {
                    resolve(event.target.result.data);
                };
                dataRequest.onerror = function(event) {
                    reject(event.target.error);
                }

            })
        })

    }

    exists(name) {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.get(name);
                dataRequest.onsuccess = function(event) {
                    let e = event.target.result
                    if (e) resolve(true);
                    else resolve(false);
                };
                dataRequest.onerror = function(event) {
                    resolve(false);
                }

            })
        })     
    }

    async size(name) {
        return (await this.readFile(name)).length;
    }

    unlink(name) {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.get(name);
                dataRequest.onsuccess = function(event) {
                    let e = event.target.result
                    if (typeof e == "undefined") return reject("File not found");
                    let delRequest = store.delete(name);
                    delRequest.onsuccess = function(event) {
                        resolve(true);
                    }
                    delRequest.onerror = function(event) {
                        reject(event.target.error);
                    }
                };
                dataRequest.onerror = function(event) {
                    resolve(false);
                }

            })
        })     
    }

    async rename(name, newName) {
        let data = await this.readFile(name);
        await this.writeFile(newName, data);
        await this.unlink(name);
    }

    async copyFile(name, newName) {
        let data = await this.readFile(name);
        await this.writeFile(newName, data);
    }

    readdir() {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.getAllKeys();
                dataRequest.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                dataRequest.onerror = function(event) {
                    reject(event.target.error);
                }

            })
        })     
    }

    mtime(name) {
        return new Promise( (resolve, reject) => {
            this.opendb().then((db) =>{
                const tx = db.transaction('files', 'readwrite');    
                const store = tx.objectStore('files');
                let dataRequest = store.get(name);
                dataRequest.onsuccess = function(event) {
                    resolve(event.target.result.mtime);
                };
                dataRequest.onerror = function(event) {
                    reject(event.target.error);
                }

            })
        })
    }
}