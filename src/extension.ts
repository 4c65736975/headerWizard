import * as fs from "fs";
import * as vscode from "vscode";
import path from "path";

const templatesFolder = "templates";

interface ITemplateFile {
  [key: string]: string;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "autoheader" is now active!');

  let templates = loadHeaderTemplates(context);

  let disposableCommand = vscode.commands.registerCommand("extension.createHeaderTemplate", () => {
    createHeaderTemplate(context, templates);
  });

  let disposableOnFiles = vscode.workspace.onDidCreateFiles((e: vscode.FileCreateEvent) => {
    e.files.forEach((uri: vscode.Uri) => {
      const headerTemplate = templates[path.parse(uri.path).ext.substring(1)];

      if (!headerTemplate) {
        return;
      }

      const headerTemplateContent = fs.readFileSync(headerTemplate, "utf-8");

      fs.writeFileSync(uri.fsPath, populateParams(uri, headerTemplateContent), {
        flag: "a+"
      });
    });
  });

  context.subscriptions.push(disposableCommand, disposableOnFiles);
}

function populateParams(filePath: vscode.Uri, headerContent: string): string {
  headerContent = headerContent.replaceAll("{filename}", path.parse(filePath.path).base);
  headerContent = headerContent.replaceAll("{date}", getCurrentDateParam());
  return headerContent;
}

function loadHeaderTemplates(context: vscode.ExtensionContext): ITemplateFile {
  const templatesFolderPath = path.join(context.extensionPath, templatesFolder);

  if (!fs.existsSync(templatesFolderPath)) {
    return {};
  }

  const templates: ITemplateFile = {};
  const files = fs.readdirSync(templatesFolderPath);

  files.forEach((file: string) => {
    templates[path.parse(file).name] = path.join(templatesFolderPath, file);
  });

  return templates;
}

function createHeaderTemplate(context: vscode.ExtensionContext, templates: ITemplateFile) {
  vscode.window.showInputBox({
    prompt: "Enter the extension name of the template file:"
  }).then(fileName => {
    if (fileName) {
      const templatesFolderPath = path.join(context.extensionPath, templatesFolder);
      const filePath = path.join(templatesFolderPath, `${fileName}.txt`);

      if (!fs.existsSync(templatesFolderPath)) {
        fs.mkdirSync(templatesFolderPath);
      }

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "");

        templates[fileName] = filePath;
      } else {
        vscode.window.showInformationMessage(`Template for .${fileName} extension already exists!`);
      }

      vscode.workspace.openTextDocument(filePath).then(doc => {
        vscode.window.showTextDocument(doc);
      });
    }
  });
}

function getCurrentDateParam(): string {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear());

  return `${day}|${month}|${year}`;
}

export function deactivate() {}