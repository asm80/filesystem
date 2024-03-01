// filesystem module
// implements filesystem interface for the ASM80 system, compiler, IDE, ...
// provides a virtual filesystem for the ASM80 system
// uses fs connectors for localStorage, indexedDB, server backend, ...

//filesystem interface
/*

const fileSystem = {
    readFile: async (name), // read file, return its content
    writeFile: async (name, data), // write file, return nothing
    exists: async (name), // return true if file exists
    unlink: async (name), // delete file, return nothing
    rename: async (name, newName), // rename file, return nothing
    copyFile: async (name, newName),  // copy file, return nothing
    readdir: async (name), // list directory, return array of names
    mtime: async (name) // return modification time of file
}

Directory structure:
not real "directory" structure, but a flat structure with names like "dir1/dir2/file.ext"

*/

//usage: const fs = new FileSystem(localStorageConnector)

/*
export const FileSystem = (conn) => {

    // just dummy object with enclosured connector
    return {
        readFile: async (name) => await conn.readFile(name),
        writeFile: async (name, data) => await conn.writeFile(name, data),
        exists: async (name) => await conn.exists(name),
        unlink: async (name) => await conn.unlink(name),
        rename: async (name, newName) => await conn.rename(name, newName),
        copyFile: async (name, newName) => await conn.copyFile(name, newName),
        readdir: async (name) => await conn.readdir(name),
        mtime: async (name) => await conn.mtime(name)
    }
}
*/
export class FileSystem {
    #conn;
    constructor(conn) {
        this.#conn = conn
        this.dummy = "dummy"
    }

    async readFile(name) {
        return await this.#conn.readFile(name)
    }

    async writeFile(name, data) {
        return await this.#conn.writeFile(name, data)
    }

    async exists(name) {
        return await this.#conn.exists(name)
    }

    async unlink(name) {
        return await this.#conn.unlink(name)
    }

    async rename(name, newName) {
        return await this.#conn.rename(name, newName)
    }

    async copyFile(name, newName) {
        return await this.#conn.copyFile(name, newName)
    }

    async size (name) {
        return await this.#conn.size(name)
    }

    async readdir(name) {
        return await this.#conn.readdir(name)
    }

    async mtime(name) {
        return await this.#conn.mtime(name)
    }
}