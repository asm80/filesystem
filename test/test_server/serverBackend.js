//test server for the file system
//it provides two functions:
//1. serverStart(port) - start the server
//2. serverStop(server) - stop the server

import express from "express"
import bodyParser from "body-parser";

import { AsyncFileSystem } from "../_asyncFilesystem.js";

// Test methods - filesystem access
/*
Test API:
GET /ping - return {ping:"pong"}
GET /exists/:path - return {ok:true}
*/


export const serverStart = (port) => {
    const afs = new AsyncFileSystem("./test/suite/")
    const app = express();
    app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json({ type: 'application/json' }))

    app.get("/ping", async (req, res) => {
        res.json({ping:"pong"})
    })
    

    app.put("/*", async (req, res) => {
        try {
        let path = req.params[0].replace(/\.\./g, "")
        let data = req.body.data
        //console.log("write", path, req.body)
        await afs.writeFile(path, data)
        res.json({ok:true, path:path, data})
        }
        catch (e) {
            res.status(500)
            res.json(e)
        }
    })

    app.delete("/*", async (req, res) => {
        try {
            let path = req.params[0].replace(/\.\./g, "")
            await afs.unlink(path)
            res.json({ok:true})
        }
        catch (e) {
            res.status(500)
            res.json(e)
        }
    }
    )

    
    app.get("/*", async (req, res) => {
        try {
            let path = req.params[0].replace(/\.\./g, "")
            let fn = req.query

            //?exists
            if (typeof fn.exists !== "undefined") {
               let exists = await afs.exists(path)
               return res.json({ok:true, exists:exists})
            }

            //?size
            if (typeof fn.size !== "undefined") {
                let size = await afs.size(path)
                return res.json({ok:true, size:size})
            }

            //?rename
            if (typeof fn.rename !== "undefined") {
                let newName = fn.rename
                await afs.rename(path, newName)
                return res.json({ok:true})
            }

            //?copy
            if (typeof fn.copy !== "undefined") {
                let newName = fn.copy
                await afs.copyFile(path, newName)
                return res.json({ok:true})
            }

            //?readdir
            if (typeof fn.readdir !== "undefined") {
                let files = await afs.readdir(path)
                return res.json({ok:true, files:files})
            }

            //?mtime
            if (typeof fn.mtime !== "undefined") {
                let mtime = await afs.mtime(path)
                return res.json({ok:true, mtime:mtime})
            }

            let data = await afs.readFile(path)
            return res.json({ok:true, path:path, data:data})
        }
        catch (e) {
            res.status(500)
            res.json({...e, query:req.query, path:req.params[0]})
        }
    })


    let server = app.listen(port);
    return server
}

export const serverStop = async (server) => {
    await server.close()
}
