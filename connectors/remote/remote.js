// This file is used to connect to the remote server

// simple API call
const callAPI = async (path, PORT, method="GET",body=null) => {

    let opt = {
        method: method,
    }
    if (body) {
        opt.body = JSON.stringify({data:body})
        opt.headers = {}
        opt.headers['Content-Type'] = 'application/json'
    }

    //console.log(`Fetching ${path}, ${method}`)
    let response = await fetch(`http://localhost:${PORT}/${path}`, opt)
    if (response.status > 299) {
        //console.log(`Error ${response.status} while fetching ${path}, ${method}`)
        //console.log(await response.json())
        throw new Error(`Error ${response.status} while fetching ${path}, ${method}`)
    }
    let data = await response.json()
    //console.log(data)
    return data
}

export class RemoteFS {
    #PORT;
    constructor (opt) {
        this.#PORT = opt.PORT
    }


    
    async readFile (name) {
        let data = await callAPI(name, this.#PORT)
        return data.data
    }
    async writeFile (name, data) {
        return callAPI(name, this.#PORT, "PUT", data)
    }
    async exists (name) {
        let data = await callAPI(name+"?exists", this.#PORT)
        return data.exists
    }
    async size (name) {
        let data = await callAPI(name+"?size", this.#PORT)
        return data.size
    }
    async rename (name, newName) {
        return callAPI(name+"?rename="+newName, this.#PORT)
    }
    async copyFile (name, newName) {
        return callAPI(name+"?copy="+newName, this.#PORT)
    }
    async unlink (name) {
        return callAPI(name, this.#PORT, "DELETE")
    }
    async readdir () {
        let data = await callAPI("?readdir", this.#PORT)
        return data.files
    }
    async mtime (name) {
        let data = await callAPI(name+"?mtime", this.#PORT)
        return data.mtime
    }
}