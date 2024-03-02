
import { asyncThrows } from "./_asyncThrows.js";

export const performBasicTests = (QUnit, afs, FileSystem) => {

    QUnit.test("Instantiate FS", async assert => {
        assert.ok(typeof afs == "object")
        let fs = new FileSystem(afs)
        assert.ok(typeof fs == "object")
    }
    )

    QUnit.test("file TEST does not exists", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false, "Exists!")
    }
    )

    QUnit.test("file TEST write, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await fs.readFile("TEST") == "test", "file content err")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, overwrite, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await fs.readFile("TEST") == "test", "file content err")
        await fs.writeFile("TEST", "2test")
        assert.ok(await fs.exists("TEST") == true, "overwrited file not exists")
        assert.ok(await fs.readFile("TEST") == "2test", "overwrited file content err")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
    }
    )


    QUnit.test("file TEST write, read, overwrite, re-read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true, "file not exists")
        assert.ok(await fs.readFile("TEST") == "test")
        await fs.writeFile("TEST", "test2")
        assert.ok(await fs.readFile("TEST") == "test2")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, rename, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        await fs.rename("TEST", "TEST2")
        assert.ok(await fs.exists("TEST") == false, "OLD file remains")
        assert.ok(await fs.exists("TEST2") == true, "NEW file not exists")
        assert.ok(await fs.readFile("TEST2") == "test")
        await fs.unlink("TEST2")
        assert.ok(await fs.exists("TEST2") == false)
    }
    )

    QUnit.test("file TEST write, copy, read, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        await fs.copyFile("TEST", "TEST2")
        assert.ok(await fs.exists("TEST2") == true)
        assert.ok(await fs.readFile("TEST2") == "test")
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
        await fs.unlink("TEST2")
        assert.ok(await fs.exists("TEST2") == false)
    }
    )

    QUnit.test("file TEST write, size, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false,"TEST exists")
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        let size = await fs.size("TEST")
        assert.ok(size == 4, `Size ${size}`)
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
    }
    )

    QUnit.test("file TEST write, readdir, unlink", async assert => {
        let fs = new FileSystem(afs)
        assert.ok(await fs.exists("TEST") == false)
        await fs.writeFile("TEST", "test")
        assert.ok(await fs.exists("TEST") == true)
        let list = await fs.readdir(".")
        assert.ok(list.includes("TEST"))
        await fs.unlink("TEST")
        assert.ok(await fs.exists("TEST") == false)
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
}