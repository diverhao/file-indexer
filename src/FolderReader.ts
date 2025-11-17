import { fstatSync, readdirSync, readFileSync } from "fs"
import * as fs from "fs";
import { join } from "path";

export class FolderReader {
    private _result: string[] = [];
    private _sizeThreashold = 1024 * 1024 * 500; // 500 MB
    private _rootPath: string;
    private _exludes: string[] = [];
    constructor(rootPath: string, exludes: string[]) {
        this._rootPath = rootPath;
        this._exludes = exludes;
    }

    read = () => {
        this._readFolder(this.getRootPath());
        return this.getResult();
    }

    /**
     * Read one folder 
     */
    private _readFolder = (fullPath: string) => {
        if (this.getExcludes().includes(fullPath)) {
            return;
        }
        const dirContent = readdirSync(fullPath);
        for (const childPath of dirContent) {
            const childFullPath = join(fullPath, childPath);
            const childStat = fs.lstatSync(childFullPath)
            if (childStat.isDirectory()) {
                this._readFolder(childFullPath);
            } else if (childStat.isFile()) {
                if (childStat.size > this.getSizeThreshold()) {
                    this.getResult().push(childFullPath);
                } else {
                    // small file size
                    // do nothing
                }
            } else {
                // symbolic link
                // do nothing
            }
        }
        // console.log(dirContent)
    }

    getResult = () => {
        return this._result;
    }

    getSizeThreshold = () => {
        return this._sizeThreashold;
    }

    getRootPath = () => {
        return this._rootPath;
    }

    getExcludes = () => {
        return this._exludes;
    }
}