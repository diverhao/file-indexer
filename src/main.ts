import { readFileSync } from "fs";
import { FolderReader } from "./FolderReader";
import { WebServer } from "./WebServer";


const configFileName = process.argv[2];
console.log("Config file:", configFileName)
if (configFileName === undefined) {
    console.log("Error: failed to read config file", configFileName);
    process.exit();
}

/**
 * Global variable storing search result
 */
const files: string[] = [];
let webServerPort: number = 4000;
let indexPeriod: number = 86400;
let excludes: string[] = [];

/**
 * Read all files in config
 * 
 * clear the variable files 
 */
const readFolders = () => {
    try {
        const configFileStr = readFileSync(configFileName, "utf-8");
        const config = JSON.parse(configFileStr);
        const folders = config["folders"];
        webServerPort = config["port"];
        indexPeriod =  config["indexPeriod"];
        excludes = config["excludes"];

        // empty files
        files.length = 0;

        // read each folders defined in config
        for (const fullPath of folders) {
            const reader = new FolderReader(fullPath, excludes);
            try {
                const filesInFolder = reader.read();
                files.push(...filesInFolder);
            } catch (e) {
                console.log("Error: failed to read folder", fullPath)
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    }
    console.log("Server port:", webServerPort);
    console.log("Index period", indexPeriod, "seconds");
    console.log("Indexed", files.length, "files");
}

readFolders();
setInterval(() => {
    readFolders();
}, indexPeriod * 1000)

const webServer = new WebServer(files, webServerPort);
webServer.start()
