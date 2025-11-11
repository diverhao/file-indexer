import express from "express";


export class WebServer {
    private _files: string[];
    private _port: number;
    constructor(files: string[], port: number) {
        this._files = files;
        this._port = port;
    }

    start = () => {
        const app = express();
        app.use(express.static('public'));

        app.get("/", (req, res) => {
            res.sendFile("index.html")
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

        app.listen(this.getPort(), () => {
            console.log(`Server running at http://localhost:${this.getPort()}`);
        });

    }

    getFiles = () => {
        return this._files;
    }

    getPort = () => {
        return this._port;
    }
}