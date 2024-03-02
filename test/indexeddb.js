import QUnit from "qunit";
QUnit.config.hidepassed = true;

//indexeddb polyfill
import "fake-indexeddb/auto";

import { IDBFS } from "../connectors/indexeddb/indexeddb.js";


let afs = new IDBFS(indexedDB)

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";

QUnit.module('IDB');
performBasicTests(QUnit, afs, FileSystem)
