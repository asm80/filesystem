
import { asyncThrows } from "./_asyncThrows.js";

export const performCachedBasicTests = (QUnit, afs, FileSystem, bfs) => {

    QUnit.test("Instantiate FS", async assert => {
        assert.ok(typeof afs == "object")
        let fs = new FileSystem(afs)
        assert.ok(typeof fs == "object")
    }
    )

    QUnit.test("file TEST does not exists", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "Exists!")
        assert.ok(await bfs.exists("TEST") == false, "Exists!")
    }
    )

    QUnit.test("file TEST write, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await bfs.exists("TEST") == true, "bfs: file not exists")
        assert.ok(await fs.readFile("TEST") == "test", "file content err")
        assert.ok(await bfs.readFile("TEST") == "test", "bfs: file content err")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write on BFS, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await bfs.writeFile("TEST", "test") //write in bfs
        assert.ok(!await fs.exists("TEST") == true, "file should not exists in cache")
        assert.ok(await bfs.exists("TEST") == true, "bfs: file exists")

        let list = await fs.readdir("")
        assert.ok(list.includes("TEST"), "file should be in cache list, but not cached")
        assert.ok(list.length==1, "cache should be OK")

        assert.ok(await fs.readFile("TEST") == "test", "file content err")
        assert.ok(await fs.exists("TEST") == true, "file has to exists in cache")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
    })
        
    QUnit.test("file TEST write, overwrite, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists before test")
        assert.ok(await bfs.exists("TEST") == false, "bfs: file exists before test")
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await bfs.exists("TEST") == true, "bfs: file not exists")
        assert.ok(await fs.readFile("TEST") == "test", "file content err")
        assert.ok(await bfs.readFile("TEST") == "test", "bfs: file content err")
        await fs.writeFile("TEST", "2test")
        assert.ok(await fs.exists("TEST") == true, "overwrited file not exists")
        assert.ok(await bfs.exists("TEST") == true, "bfs: overwrited file not exists")
        assert.ok(await fs.readFile("TEST") == "2test", "overwrited file content err")
        assert.ok(await bfs.readFile("TEST") == "2test", "bfs: overwrited file content err")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false, "file not exists after unlink")
        assert.ok(await bfs.exists("TEST") == false, "file not exists after unlink")
    }
    )


    QUnit.test("file TEST write, read, overwrite, re-read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists before test")
        assert.ok(await bfs.exists("TEST") == false, "bfs: file exists before test")
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await bfs.exists("TEST") == true, "bfs: file not exists")
        assert.ok(await fs.readFile("TEST") == "test")
        assert.ok(await bfs.readFile("TEST") == "test")
        await fs.writeFile("TEST", "test2")
        assert.ok(await fs.readFile("TEST") == "test2")
        assert.ok(await bfs.readFile("TEST") == "test2")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, rename, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        assert.ok(await bfs.exists("TEST") == true)
        await fs.rename("TEST", "TEST2")
        assert.ok(await fs.exists("TEST") == false, "OLD file remains")
        assert.ok(await bfs.exists("TEST") == false, "bfs: OLD file remains")
        assert.ok(await fs.exists("TEST2") == true, "NEW file not exists")
        assert.ok(await bfs.exists("TEST2") == true, "bfs: NEW file not exists")
        assert.ok(await fs.readFile("TEST2") == "test")
        assert.ok(await bfs.readFile("TEST2") == "test")
        await fs.unlink("TEST2")
        assert.ok(await fs.exists("TEST2") == false)
        assert.ok(await bfs.exists("TEST2") == false)
    }
    )

    QUnit.test("file TEST write, copy, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        assert.ok(await bfs.exists("TEST") == true)
        await fs.copyFile("TEST", "TEST2")
        assert.ok(await fs.exists("TEST2") == true)
        assert.ok(await bfs.exists("TEST2") == true)
        assert.ok(await fs.readFile("TEST2") == "test")
        assert.ok(await bfs.readFile("TEST2") == "test")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await fs.unlink("TEST2")
        assert.ok(await fs.exists("TEST2") == false)
        assert.ok(await bfs.exists("TEST2") == false)
    }
    )

    QUnit.test("file TEST write, size, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false,"TEST exists")
        assert.ok(await bfs.exists("TEST") == false,"bfs: TEST exists")
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        assert.ok(await bfs.exists("TEST") == true)
        let size = await fs.size("TEST")
        assert.ok(size == 4, `Size ${size}`)
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, readdir, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        assert.ok(await bfs.exists("TEST") == true)
        let list = await fs.readdir("")
        assert.ok(list.includes("TEST"))
        assert.ok(await fs.exists("TEST") == true)
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        assert.ok(await bfs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, mtime, unlink", async assert => {
        let now1 = new Date().getTime()
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        let mtime = await fs.mtime("TEST")
        let now2 = new Date().getTime()
        assert.ok(mtime >= now1, `${mtime}, ${now1}, ${now2}`)
        assert.ok(mtime <= now2, `${mtime}, ${now1}, ${now2}`)
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST does not exists, read", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false,"Exists!")
        await asyncThrows(assert, () => fs.readFile("TEST"))
    }
    )

    QUnit.test("file TEST does not exists, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists")
        await asyncThrows(assert, () => fs.unlink("TEST"))
    }
    )
    QUnit.test("file TEST does not exists, size", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists")
        await asyncThrows(assert, () => fs.size("TEST"))
    }
    )
    QUnit.test("file TEST does not exists, rename", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists")
        await asyncThrows(assert, () => fs.rename("TEST","TEST2"))
    }
    )
    QUnit.test("file TEST does not exists, copyFile", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists")
        await asyncThrows(assert, () => fs.copyFile("TEST","TEST2"))
    }
    )

    QUnit.test("file TEST does not exists, mtime", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "file exists")
        await asyncThrows(assert, () => fs.mtime("TEST"))
    }
    )


    QUnit.test("file DIR/SUBDIR/TEST write, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == false)
        await fs.writeFile("DIR/SUBDIR/TEST", "test")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == true, "file not exists")
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == true, "bfs: file not exists")
        assert.ok(await fs.readFile("DIR/SUBDIR/TEST") == "test", "file content err")
        assert.ok(await bfs.readFile("DIR/SUBDIR/TEST") == "test", "bfs: file content err")
        await fs.unlink("DIR/SUBDIR/TEST")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == false)
    }
    )

    QUnit.test("file DIR/SUBDIR/TEST write, readdir, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == false)
        await fs.writeFile("DIR/SUBDIR/TEST", "test")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == true, "file not exists")
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == true, "bfs: file not exists")
        let list = await fs.readdir("")
        //console.log(list)
        assert.ok(list.includes("DIR"), "no DIR")
        assert.ok(!list.includes("SUBDIR"), "SUBDIR")
        assert.ok(!list.includes("TEST"), "TEST")
        assert.ok(list.length == 1, "DIR length")
        let bfslist = await fs.readdir("")
        assert.ok(bfslist.includes("DIR"), "bfs: no DIR")
        assert.ok(!bfslist.includes("SUBDIR"), "bfs: SUBDIR")
        assert.ok(!bfslist.includes("TEST"), "bfs: TEST")
        assert.ok(bfslist.length == 1, "bfs: DIR length")
        let list2 = await fs.readdir("DIR")
        //console.log(list2)
        assert.ok(list2.includes("SUBDIR"), "SUBDIR")
        assert.ok(!list2.includes("TEST"), "TEST")
        assert.ok(list2.length == 1, "SUBDIR length")
        let bfslist2 = await fs.readdir("DIR")
        assert.ok(bfslist2.includes("SUBDIR"), "bfs: SUBDIR")
        assert.ok(!bfslist2.includes("TEST"), "bfs: TEST")
        assert.ok(bfslist2.length == 1, "bfs: SUBDIR length")

        assert.ok(await fs.exists("DIR/SUBDIR/TEST2") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST2") == false)
        await fs.writeFile("DIR/SUBDIR/TEST2", "test2")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST2") == true, "file not exists")
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST2") == true, "bfs: file not exists")

        let list3 = await fs.readdir("DIR/SUBDIR")
        //console.log(list3)
        assert.ok(list3.includes("TEST"), "no TEST")
        assert.ok(list3.includes("TEST2"), "no TEST2")
        assert.ok(list3.length == 2, "length")

        let bfslist3 = await fs.readdir("DIR/SUBDIR")
        assert.ok(bfslist3.includes("TEST"), "bfs: no TEST")
        assert.ok(bfslist3.includes("TEST2"), "bfs: no TEST2")
        assert.ok(bfslist3.length == 2, "bfs: length")

        assert.ok(await fs.readFile("DIR/SUBDIR/TEST2") == "test2", "file content err")
        assert.ok(await bfs.readFile("DIR/SUBDIR/TEST2") == "test2", "bfs: file content err")
        await fs.unlink("DIR/SUBDIR/TEST2")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST2") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST2") == false)


        assert.ok(await fs.readFile("DIR/SUBDIR/TEST") == "test", "file content err")
        assert.ok(await bfs.readFile("DIR/SUBDIR/TEST") == "test", "bfs: file content err")
        await fs.unlink("DIR/SUBDIR/TEST")
        assert.ok(await fs.exists("DIR/SUBDIR/TEST") == false)
        assert.ok(await bfs.exists("DIR/SUBDIR/TEST") == false)
    }
    )

}