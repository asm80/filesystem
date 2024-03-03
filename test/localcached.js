import QUnit from "qunit";
QUnit.config.hidepassed = true;

//import { MemoryFS } from "../connectors/memory/memory.js";
import { LocalStorageFS } from "../connectors/localstorage/localstorage.js";
import { CacheFS } from "../connectors/cache/cache.js";

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


let bfs = new LocalStorageFS(ls)

let afs = new CacheFS(bfs)

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";
import { performCachedBasicTests } from "./_cachedBasicTests.js";

QUnit.module('Cached local storage');
performCachedBasicTests(QUnit, afs, FileSystem, bfs)
