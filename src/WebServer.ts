import express from "express";
import path from "path";
import https from "https";
import { readFileSync } from "fs";


export class WebServer {
    private _files: string[];
    private _port: number;
    constructor(files: string[], port: number) {
        this._files = files;
        this._port = port;
    }

    start = () => {
        const app = express();
        // for `node ..../main.js config.json`, public is resolved to process.cwd, which is the 
        //                                      location where node is invoked
        // for `npm start`, public is resolved to the project's root folder,
        // for pkg packing, public is resolved to 
        app.use(express.static(this.getPublicPath()));

        // Read SSL certificate and key
        const sslOptions = {
            key: readFileSync(this.getPublicPath("server.key")),
            cert: readFileSync(this.getPublicPath("server.crt"))
        };

        app.get("/", (req, res) => {
            res.sendFile(this.getPublicPath("index.html"));
        })

        app.get("/search", (req, res) => {
            const { keyword1, keyword2, keyword3, keyword4, keyword5 } = req.query;
            const result: string[] = [];

            // Simulated search result (in real app, query your DB or API)
            for (const file of this.getFiles()) {
                const fileLowerCase = file.toLowerCase();
                if ((fileLowerCase.includes(`${keyword1}`)) // at least 1 input argument
                    && (fileLowerCase.includes(`${keyword2}`) || keyword2 === undefined)
                    && (fileLowerCase.includes(`${keyword3}`) || keyword3 === undefined)
                    && (fileLowerCase.includes(`${keyword4}`) || keyword4 === undefined)
                    && (fileLowerCase.includes(`${keyword5}`) || keyword5 === undefined)
                ) {
                    result.push(file);
                }
            }
            console.log("Found", result.length, "results for search", keyword1, keyword2, keyword3, keyword4, keyword5);
            res.json(result);
        })

        // app.listen(this.getPort(), () => {
        //     console.log(`Server running at http://localhost:${this.getPort()}`);
        // });

        https.createServer(sslOptions, app).listen(4000, "0.0.0.0", () => {
            console.log("HTTPS server running at https://localhost");
        });

    }

    getPublicPath(...segments: string[]) {
        if ((process as any).pkg) {
            // binary mode: __dirname is virtual FS, use execPath as base
            console.log(path.join(path.dirname(process.execPath), "public", ...segments));
            return path.join(path.dirname(process.execPath), "public", ...segments);
        } else {
            // dev mode: relative to source folder
            return path.join(__dirname, "..", "public", ...segments);
        }
    }


    getFiles = () => {
        return this._files;
    }

    getPort = () => {
        return this._port;
    }
}