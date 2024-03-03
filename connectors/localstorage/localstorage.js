// connector for localstorage k/v store

export class LocalStorageFS {
    #fs;

    constructor( storage = window.localStorage) {
        if (typeof storage == "undefined") throw new Error("LocalStorage not available");
        if (typeof storage._metas == "undefined") storage._metas = {};
        this.#fs = storage;
    }

    async readFile(name) {
        if (typeof this.#fs.getItem(name) == "undefined") throw new Error("File not found");
        return this.#fs.getItem(name);
    }

    async writeFile(name, data) {
        if (typeof this.#fs._metas[name] == "undefined") this.#fs._metas[name] = {mtime:null}
        this.#fs._metas[name].mtime = new Date().getTime();
        return this.#fs.setItem(name, data);
    }

    async exists(name) {
        return typeof this.#fs.getItem(name) != "undefined";
    }

    async size(name) {
        return this.#fs.getItem(name).length;
    }

    async unlink(name) {
        if (typeof this.#fs.getItem(name) == "undefined") throw new Error("File not found");
        delete this.#fs._metas[name];
        return this.#fs.removeItem(name);
    }

    async rename(name, newName) {
        if (typeof this.#fs.getItem(name) == "undefined") throw new Error("File not found");
        const data = this.#fs.getItem(name);
        this.#fs.setItem(newName, data);
        this.#fs.removeItem(name);
        this.#fs._metas[newName] = this.#fs._metas[name];
        delete this.#fs._metas[name];
    }

    async copyFile(name, newName) {
        if (typeof this.#fs.getItem(name) == "undefined") throw new Error("File not found");
        const data = this.#fs.getItem(name);
        this.#fs.setItem(newName, data);
        this.#fs._metas[newName] = {...this.#fs._metas[name]};
    }

    async readdir() {
        let nk = Object.keys(this.#fs);
        //filtering out _metas, getItem, setItem, removeItem
        return nk.filter((item) => !["getItem","setItem","removeItem","_metas"].includes(item));
    }

    async mtime(name) {
        return this.#fs._metas[name].mtime;
    }
}