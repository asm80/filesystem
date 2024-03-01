import QUnit from "qunit";
QUnit.config.hidepassed = true;

import { MemoryFS } from "../connectors/memory/memory.js";

let afs = new MemoryFS()

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";

QUnit.module('Memory proxy');
performBasicTests(QUnit, afs, FileSystem)
