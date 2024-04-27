import {
  Button,
  TextArea,
  TextField,
  provideVSCodeDesignSystem,
  vsCodeButton,
  vsCodeDivider,
  vsCodeTextArea,
  vsCodeTextField
} from "@vscode/webview-ui-toolkit";

import { Template } from "../types/Template";

provideVSCodeDesignSystem().register(
  vsCodeButton(),
  vsCodeTextArea(),
  vsCodeTextField(),
  vsCodeDivider()
);

const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

let currentTemplate: Template;

function main() {
  setVSCodeMessageListener();

  vscode.postMessage({
    command: "request-webview-data"
  });

  const titleHeader = document.getElementById("template-header") as HTMLHeadingElement;
  const titleInput = document.getElementById("name") as TextField;
  const extensionInput = document.getElementById("extension") as TextField;
  const contentInput = document.getElementById("content") as TextArea;
  const saveButton = document.getElementById("submit-button") as Button;

  const updateButton = () => {
    saveButton.disabled = titleInput.value === "" || extensionInput.value === "" || contentInput.value === "";
  };

  const updateName = () => {
    const isActive = currentTemplate.isActive ? "Active" : "Inactive";
    const name = titleInput.value + " - " + `.${extensionInput.value}` + ` (${isActive})`;

    vscode.postMessage({
      command: "update-template-name",
      name: name
    });

    titleHeader.innerText = name;

    updateButton();
  };

  titleInput.addEventListener("keyup", updateName);
  extensionInput.addEventListener("keyup", updateName);
  contentInput.addEventListener("keyup", updateButton);

  const onSaveButtonClick = () => {
    const template: Template = {
      id: currentTemplate.id,
      name: titleInput.value,
      extension: extensionInput.value,
      content: contentInput.value,
      isActive: currentTemplate.isActive
    };

    vscode.postMessage({
      command: "save-template",
      template: template
    });
  };

  saveButton?.addEventListener("click", onSaveButtonClick);
}

function setVSCodeMessageListener() {
  window.addEventListener("message", event => {
    const command = event.data.command;

    switch (command) {
      case "response-webview-data":
        currentTemplate = event.data.payload;
        break;
    }
  });
}