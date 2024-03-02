import QUnit from "qunit";
QUnit.config.hidepassed = true;

//import { MemoryFS } from "../connectors/memory/memory.js";
import { LocalStorageFS } from "../connectors/localstorage/localstorage.js";

//localstorage fast emu for testing

let ls = {}
ls.getItem = function(name) {
    return this[name]
}
ls.setItem = function(name, data) {
    this[name] = data
}
ls.removeItem = function(name) {
    delete this[name]
}


let afs = new LocalStorageFS(ls)

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";

QUnit.module('Local storage');
performBasicTests(QUnit, afs, FileSystem)
