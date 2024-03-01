// memory FS - it means "one big object"

export class MemoryFS {
    #files;
    #times;
    constructor() {
        this.#files = {}
        this.#times = {}
    }

    async readFile(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#files[name]
    }

    async writeFile(name, data) {
        this.#files[name] = data
        this.#times[name] = new Date().getTime()
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
        delete this.#files[name]
        delete this.#times[name]
    }

    async rename(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
        delete this.#files[name]
        delete this.#times[name]
    }

    async copyFile(name, newName) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        this.#files[newName] = this.#files[name]
        this.#times[newName] = this.#times[name]
    }

    async readdir(name) {
        return Object.keys(this.#files)
    }

    async mtime(name) {
        if (typeof this.#files[name] == "undefined") throw new Error("File not found")
        return this.#times[name]
    }
}