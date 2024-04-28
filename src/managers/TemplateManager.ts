import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { Template } from "../types/Template";
import { ParameterManager } from "./ParameterManager";

interface ITemplateManager {
  save(): void;
  createTemplate(template: Template): void;
  updateTemplate(template: Template): boolean;
  setTemplateActive(id: string): boolean;
  deleteTemplate(id: string): void;
  getTemplates(): Template[] | [];
  getTemplateById(id: string): Template | undefined;
  getTemplateContent(uri: vscode.Uri): string | undefined;
}

export class TemplateManager implements ITemplateManager {
  private readonly _filePath: string;
  private _templates: Template[] = [];

  constructor(context: vscode.ExtensionContext) {
    ParameterManager.registerParams();

    this._filePath = path.join(context.extensionPath, "config", "templates.json");
    this._loadTemplates();
  }

  private _loadTemplates() {
    if (!fs.existsSync(this._filePath)) {
      return;
    }

    const payload = fs.readFileSync(this._filePath, "utf-8");

    this._templates = JSON.parse(payload);
  }

  public save() {
    const saveCopy = this._templates.map(template => ({...template}));

    saveCopy.forEach(template => {
      template.content = template.content.replace(/(?:\r\n|\r|\n)/g, "\\n");
    });

    const payload = JSON.stringify(this._templates);
    const dir = path.dirname(this._filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this._filePath, payload, { flag: "w" });
  }

  public createTemplate(template: Template) {
    this._templates.push(template);

    this._updateActiveTemplate(template);
    this.save();
  }

  public updateTemplate(template: Template): boolean {
    const matchingTemplateIndex = this._templates.findIndex(t => t.id === template.id);

    if (matchingTemplateIndex >= 0) {
      this._templates[matchingTemplateIndex] = template;

      this._updateActiveTemplate(template);
      this.save();

      return true;
    }

    return false;
  }

  public setTemplateActive(id: string): boolean {
    const template = this.getTemplateById(id);

    if (template === undefined) {
      return false;
    }

    template.isActive = !template.isActive;

    this._updateActiveTemplate(template);
    this.save();

    return true;
  }

  private _updateActiveTemplate(template: Template) {
    if (template.isActive === false) {
      return;
    }

    this._templates.forEach(t => {
      if (t !== template && t.extension === template.extension) {
        t.isActive = false;
      }
    });
  }

  public deleteTemplate(id: string) {
    const matchingTemplateIndex = this._templates.findIndex(template => template.id === id);

    if (matchingTemplateIndex >= 0) {
      this._templates.splice(matchingTemplateIndex, 1);
    }

    this.save();
  }

  public getTemplates(): Template[] | [] {
    return this._templates;
  }

  public getTemplateById(id: string | undefined): Template | undefined {
    return this._templates.find(template => template.id === id);
  }

  public getTemplateContent(uri: vscode.Uri): string | undefined {
    const fileExt = path.parse(uri.path).ext.substring(1);
    const template = this._templates.find(template => template.extension === fileExt && template.isActive);

    return ParameterManager.shared?.populate(template?.content, {
      uri: uri
    });
  }
}