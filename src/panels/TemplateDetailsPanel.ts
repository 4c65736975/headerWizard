import * as vscode from "vscode";

import { getUri } from "../utils/uri";
import { getNonce } from "../utils/crypto";
import { Template } from "../types/Template";

type MessageListener = ((e: any) => any) | undefined;

interface ITemplateDetailsPanel {
  dispose(): void;
  getCurrentTemplate(): Template | undefined;
}

export class TemplateDetailsPanel implements ITemplateDetailsPanel {
  public static shared: TemplateDetailsPanel | undefined;

  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _currentTemplate: Template | undefined;

  private constructor(panel: vscode.WebviewPanel, messageListener: MessageListener) {
    this._panel = panel;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._setWebviewMessageListener(this._panel.webview, messageListener);
  }

  public static render(extensionUri: vscode.Uri, template: Template, messageListener: MessageListener) {
    const title = `${template.name || "New Template"} - .${template.extension || "lua"} (${template.isActive ? "Active" : "Inactive"})`;

    if (!this.shared) {
      const panel = vscode.window.createWebviewPanel("autoHeaderTemplateDetailView", title, vscode.ViewColumn.One, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, "out")]
      });

      this.shared = new TemplateDetailsPanel(panel, messageListener);
    }

    this.shared._currentTemplate = template;

    this.shared._panel.title = title;
    this.shared._panel.webview.html = this.shared._getWebviewContent(this.shared._panel.webview, extensionUri);
    this.shared._panel.reveal(vscode.ViewColumn.One);
  }

  private _setWebviewMessageListener(webview: vscode.Webview, messageListener: MessageListener) {
    webview.onDidReceiveMessage(message => {
      const command = message.command;

      switch (command) {
        case "request-webview-data":
          webview.postMessage({
            command: "response-webview-data",
            payload: this._currentTemplate
          });
          break;

        case "update-template-name":
          this._panel.title = message.name;
          break;
      }
    }, undefined, this._disposables);

    if (messageListener) {
      webview.onDidReceiveMessage(messageListener, undefined, this._disposables);
    }
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const webviewUri: vscode.Uri = getUri(webview, extensionUri, ["out", "webview.js"]);
    const styleUri: vscode.Uri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const template: Template | undefined = this._currentTemplate;
    const nonce: string = getNonce();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href="${styleUri}">
          <title>${template?.name}</title>
        </head>

        <body id="template-body">
          <header>
            <h1 id="template-header">${template?.name || "New Template"} - .${template?.extension || "lua"} (${template?.isActive ? "Active" : "Inactive"})</h1>
          </header>

          <section id="template-form">
            <div class="base-template-info-container">
              <vscode-text-field id="name" value="${template?.name}" placeholder="New Template" size="40">Name</vscode-text-field>
              <vscode-text-field id="extension" value="${template?.extension}" placeholder="lua" size="8">
                Extension
                <span slot="start" class="extension-dot">.</span>
              </vscode-text-field>
            </div>
            <vscode-text-area id="content" value="${template?.content}" placeholder="-- @author: 4c65736975, All Rights Reserved\n-- @version: 1.0.0.0, {DD|MM|YYYY}\n-- @filename: {filename}" resize="vertical" rows=15>Content</vscode-text-area>
            <vscode-button disabled id="submit-button">Save</vscode-button>
          </section>

          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }

  public getCurrentTemplate(): Template | undefined {
    return this._currentTemplate;
  }

  public dispose() {
    TemplateDetailsPanel.shared = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();

      if (disposable) {
        disposable.dispose();
      }
    }
  }
}