import QUnit from "qunit";
QUnit.config.hidepassed = true;

const PORT = 27354

import { serverStart, serverStop } from "./test_server/serverBackend.js";

let server = null

QUnit.begin(async () => {
    console.log("Starting server")
    server = serverStart(PORT)
})

QUnit.done(async () => {
    console.log("Stopping server")
    await serverStop(server)
    console.log("Server stopped")
})

/// ---------

import { RemoteFS } from "../connectors/remote/remote.js";

//fetch test
const callAPI = async (path, method="GET",body=null) => {

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


QUnit.module('Server');

QUnit.test("Instantiate server and test ping", async assert => {
    let data = await callAPI("ping")
    assert.ok(typeof data == "object", "Object returned")
    assert.ok(data.ping == "pong", "Ping pong")
}
)

/*
QUnit.test("Test exists", async assert => {
    let data = await callAPI("TEST/DIR/SUBDIR?exists")
    assert.ok(typeof data == "object", "Object returned")
    assert.ok(data.ok == true, "Exists")
}   
)

QUnit.test("Test write", async assert => {
    let data = await callAPI("DIR/SUBDIR/TEST","PUT","test")
    assert.ok(typeof data == "object", "Object returned")
    assert.ok(data.ok == true, "Exists")
}   
)*/

let afs = new RemoteFS({PORT:PORT})

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";

QUnit.module('Calling remote storage');
performBasicTests(QUnit, afs, FileSystem)