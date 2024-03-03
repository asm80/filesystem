import QUnit from "qunit";


QUnit.config.hidepassed = true;

import { asyncThrows } from "./_asyncThrows.js";
import { AsyncFileSystem } from "./_asyncFilesystem.js";

/*
QUnit.test("Unrecognized instruction 4", async assert => {
    asyncThrows(assert,() => {
        let data = `mov a,t`
        return Parser.parse(data, {assembler:I8080});
    })
})
*/

import { FileSystem } from "../filesystem.js";

import { performBasicTests } from "./_basicTests.js";

let afs = new AsyncFileSystem("./test/suite/")

QUnit.module('AFS proxy');
performBasicTests(QUnit, afs, FileSystem)
