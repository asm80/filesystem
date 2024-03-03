// technically: memory FS
// but with "backend FS"
// provides transparent write-through cache, lazy read-through cache

export class CacheFS {
    #files;
    #times;
    #cached;
    #backendFS;

    constructor(backendFS) {
        this.#files = {}
        this.#times = {}
        this.#cached = {}
        this.#backendFS = backendFS
    }

    async loadFromCache(name) {
        if (typeof this.#cached[name] == "undefined") {
            let now = new Date().getTime()
            this.#files[name] = await this.#backendFS.readFile(name)
            this.#times[name] = now
            this.#cached[name] = now
        }
    }

    async readFile(name) {
        await this.loadFromCache(name)
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#files[name]
    }

    async writeFile(name, data) {
        this.#files[name] = data
        this.#times[name] = new Date().getTime()
        this.#cached[name] = this.#times[name]
        return this.#backendFS.writeFile(name, data)
    }

    async exists(name) {
        return this.#files[name] != undefined
    }

    async size(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#files[name].length
    }

    async unlink(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        await this.#backendFS.unlink(name)
        delete this.#files[name]
        delete this.#times[name]
        delete this.#cached[name]
        return 
    }

    async rename(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        await this.#backendFS.rename(name, newName)
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
        this.#cached[newName] = this.#cached[name]
        delete this.#files[name]
        delete this.#times[name]
        delete this.#cached[name]
    }

    async copyFile(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        await this.#backendFS.copyFile(name, newName)
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
        this.#cached[newName] = this.#cached[name]
    }

    async readdir(name) {
        return await this.#backendFS.readdir(name)
        //return Object.keys(this.#files)
    }

    async mtime(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#times[name]
    }
}