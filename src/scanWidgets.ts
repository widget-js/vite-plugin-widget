import { Widget } from "@widget-js/core";
import fs from "fs";
import path from "path";
import * as process from "process";
import * as ts from "typescript";
import * as vm from "vm";

const fileExt = ".widget.ts";

function searchFile(currentDirPath: string, callback: (path: string, dirent: fs.Dirent) => {}) {
    fs.readdirSync(currentDirPath, {withFileTypes: true}).forEach((dirent) => {
        const filePath = path.join(currentDirPath, dirent.name);
        if (dirent.isFile()) {
            callback(filePath, dirent);
        } else if (dirent.isDirectory()) {
            searchFile(filePath, callback);
        }
    });
}

function scanWidgets() {
    const widgets: Widget[] = [];
    searchFile(path.join('./src'), async function (filePath, stat) {
        if (filePath.endsWith(fileExt)) {
            const file = path.join(process.cwd(), filePath);
            const code = fs.readFileSync(file).toString();
            const result = ts.transpileModule(code, {
                compilerOptions: {
                    module: ts.ModuleKind.CommonJS,
                    target: ts.ScriptTarget.ESNext,
                    moduleResolution: ts.ModuleResolutionKind.NodeNext
                }
            });
            const contextObject = {
                require: require,
                console: console,
                exports: exports,
            };
            const widget = vm.runInNewContext(result.outputText, contextObject)
            widgets.push(widget)
        }
    });
    return widgets
}

export default scanWidgets;
