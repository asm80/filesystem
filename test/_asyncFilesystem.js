// simple dummy test filesystem

import {promises as fs} from "fs";

const namefix = (name) => encodeURIComponent(name).replace(/\./g, "%2E")

export class AsyncFileSystem {
    #internalPath;
    constructor (path) {
        this.#internalPath = path
    }
    async readFile (name) {
        //console.log("readFile",name, process.cwd(), fs.readFileSync(this.#internalPath+namefix(name), "utf-8"))
        return fs.readFile(this.#internalPath+namefix(name), "utf-8")
    }
    async writeFile (name, data) {
        return fs.writeFile(this.#internalPath+namefix(name), data)
    }
    async exists (name) {
        let fn = this.#internalPath+namefix(name)
        try {
            await fs.stat(fn);
            return true;
          } catch {
            return false;
          }
    }
    async unlink (name) {
        return fs.unlink(this.#internalPath+namefix(name))
    }
    async rename (name, newName) {
        return fs.rename(this.#internalPath+namefix(name), this.#internalPath+namefix(newName))
    }
    async copyFile (name, newName) {
        return fs.copyFile(this.#internalPath+namefix(name), this.#internalPath+namefix(newName))
    }
    /*
    async stat (name) {
        return fs.stat(this.#internalPath+namefix(name))
    }
    */
    async size (name) {
        let stat = await fs.stat(this.#internalPath+namefix(name))
        return stat?stat.size:null
    }

    async readdir () {
        let files = await fs.readdir("./test/suite/")
        //fix file names back from encodeURIComponent
        files = files.map((file) => decodeURIComponent(file))
        return files
    }
    async mtime (name) {
        try {
            let stat = await fs.stat(this.#internalPath+namefix(name))
            let mtime = stat.mtime
            return new Date().getTime(mtime)
        } catch (e) {
            throw new Error("File not found")
            return null
        }
    }
}