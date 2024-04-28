import * as vscode from "vscode";

import { Template } from "../types/Template";

type TreeDataOnChangeEvent = TemplateItem | undefined | null | void;

export class TemplatesDataProvider implements vscode.TreeDataProvider<TemplateItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<TreeDataOnChangeEvent>();
  readonly onDidChangeTreeData: vscode.Event<TreeDataOnChangeEvent> = this._onDidChangeTreeData.event;

  data: TemplateItem[];

  constructor(templates: Template[]) {
    this.data = templates.map(template => new TemplateItem(template.id, template.name, template.extension, template.isActive));
  }

  refresh(templates: Template[]): void {
    this._onDidChangeTreeData.fire();
    this.data = templates.map(template => new TemplateItem(template.id, template.name, template.extension, template.isActive));
  }

  getTreeItem(element: TemplateItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TemplateItem | undefined): vscode.ProviderResult<TemplateItem[]> {
    if (element === undefined) {
      return this.data;
    }

    return element.children;
  }

  getParent() {
    return null;
  }
}

class TemplateItem extends vscode.TreeItem {
  children?: TemplateItem[];

  constructor(id: string, name: string, extension: string, isActive: boolean) {
    super(name.concat(" - .", extension, ` ${isActive ? "(Active)" : "(Inactive)"}`));

    this.id = id;
    this.iconPath = new vscode.ThemeIcon("notebook-mimetype", new vscode.ThemeColor(isActive ? "notebookStatusSuccessIcon.foreground" : "notebookStatusErrorIcon.foreground"));
    this.command = {
      title: "Open template",
      command: "headerWizard.showTemplateDetailView"
    };
  }
}