import * as fs from "fs";
import * as vscode from "vscode";

import { v4 as uuidv4 } from "uuid";

import { Template } from "./types/Template";
import { TemplateDetailsPanel } from "./panels/TemplateDetailsPanel";
import { TemplatesDataProvider } from "./providers/TemplatesDataProvider";
import { TemplateManager } from "./managers/TemplateManager";

export function activate(context: vscode.ExtensionContext) {
  const templateManager: TemplateManager = new TemplateManager(context);
  const templates = templateManager.getTemplates();
  const templatesDataProvider = new TemplatesDataProvider(templates);

  const treeView = vscode.window.createTreeView("autoHeader.templates", {
    treeDataProvider: templatesDataProvider,
    showCollapseAll: false
  });

  const openTemplate = vscode.commands.registerCommand("autoHeader.showTemplateDetailView", () => {
    const selectedTreeViewItem = treeView.selection[0];
    const matchingTemplate = templateManager.getTemplateById(selectedTreeViewItem.id);

    if (!matchingTemplate) {
      vscode.window.showErrorMessage("No matching header template found!");
      return;
    }

    TemplateDetailsPanel.render(context.extensionUri, matchingTemplate, onDidReceiveMessage);
  });

  const createTemplate = vscode.commands.registerCommand("autoHeader.createTemplate", () => {
    const newTemplate: Template = {
      id: uuidv4(),
      name: "",
      extension: "",
      content: "",
      isActive: true
    };

    TemplateDetailsPanel.render(context.extensionUri, newTemplate, onDidReceiveMessage);
  });

  const activeTemplate = vscode.commands.registerCommand("autoHeader.activeTemplate", (template: Template) => {
    if (templateManager.setTemplateActive(template.id)) {
      templatesDataProvider.refresh(templates);

      const currentTemplate = TemplateDetailsPanel.shared?.getCurrentTemplate();
      const updatedTemplate = templateManager.getTemplateById(template.id);

      if (currentTemplate && updatedTemplate && currentTemplate.extension === updatedTemplate.extension) {
        TemplateDetailsPanel.render(context.extensionUri, currentTemplate, onDidReceiveMessage);
      }
    }
  });

  const deleteTemplate = vscode.commands.registerCommand("autoHeader.deleteTemplate", (template: Template) => {
    templateManager.deleteTemplate(template.id);
    templatesDataProvider.refresh(templates);
    // Close the panel if it's open
    TemplateDetailsPanel.shared?.dispose();
  });

  const onDidCreateFilesEvent = vscode.workspace.onDidCreateFiles(event => {
    event.files.forEach(uri => {
      const templateContent = templateManager.getTemplateContent(uri);

      if (templateContent === undefined) {
        return;
      }

      fs.writeFileSync(uri.fsPath, templateContent, {
        flag: "a+"
      });
    });
  });

  const onDidReceiveMessage = (message: any) => {
    const command = message.command;

    switch (command) {
      case "save-template":
        const template = message.template;

        if (!templateManager.updateTemplate(template)) {
          templateManager.createTemplate(template);
        }

        templatesDataProvider.refresh(templates);
        break;
    }
  };

  context.subscriptions.push(
    openTemplate,
    createTemplate,
    activeTemplate,
    deleteTemplate,
    onDidCreateFilesEvent
  );
}

export function deactivate() {}