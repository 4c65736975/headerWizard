import * as vscode from "vscode";
import * as path from "path";

import { Parameter } from "./Parameter";

export class FilenameParam extends Parameter {
  constructor(name: string) {
    super(name);
  }

  public static register(): FilenameParam {
    return new FilenameParam("PARAM_FILENAME");
  }

  public populate(content: string, args?: any): string {
    content = super.populate(content, args);

    if (args.uri) {
      const uri = args.uri as vscode.Uri;
      const filename = path.parse(uri.path).base;

      if (filename) {
        content = content.replace(/^\s*filename\s*$/, filename);
      }
    }

    return content;
  }
}