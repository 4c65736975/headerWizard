<div id="top"></div>
<br/>
<div align="center">
  <a href="https://github.com/4c65736975/headerWizard">
    <img src="https://github.com/4c65736975/headerWizard/assets/107006334/79fe12a9-8607-4a5b-8e76-86c626b77d1f" alt="Logo" width="128" height="128">
  </a>
  <h3>HeaderWizard</h3>
  <p>
    Visual Studio Code Extension
    <br/>
    <br/>
    <a href="https://github.com/4c65736975/headerWizard/issues">Report Bug</a>
    ·
    <a href="https://github.com/4c65736975/headerWizard/issues">Request Feature</a>
    ·
    <a href="https://github.com/4c65736975/headerWizard/blob/main/CHANGELOG.md">Changelog</a>
  </p>
</div>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li>
          <a href="#key-features">Key Features</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#prerequisites">Prerequisites</a>
        </li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li>
          <a href="#parameters">Parameters</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
    <li>
      <a href="#acknowledgments">Acknowledgments</a>
    </li>
  </ol>
</details>

## About the project

HeaderWizard extension for Visual Studio Code enhances your coding experience by allowing you to effortlessly add custom headers to specified file types. With this extension, you can define templates for headers tailored to different file extensions, ensuring consistency and compliance with project standards.

### Key Features:
- **Custom Templates**: Define unique header templates for various file types, such as .lua, .cpp, .java, etc.
- **Automatic Header Insertion**: When creating a new file with a supported extension, the extension automatically adds the predefined header template.
- **Flexibility**: Modify and update templates easily to adapt to changing project requirements or coding standards.
- **Save Time and Maintain Consistency**: Streamline your workflow by eliminating the need to manually add headers to each file, while ensuring uniformity across your codebase.
- **Simple Interface**: Simple configuration interface within VS Code makes setting up and managing templates a breeze.
- **Extensibility**: Support for adding new file types and customizing templates as per your needs.

Get the HeaderWizard extension for VS Code now and level up your coding efficiency and consistency!

<p align="right">&#x2191 <a href="#top">back to top</a></p>

## Getting started

Create your first template

<img src="https://github.com/4c65736975/headerWizard/assets/107006334/e8839579-b967-4877-bf52-a7e937251ce3" alt="screenshot">
<img src="https://github.com/4c65736975/headerWizard/assets/107006334/c35afbe7-78fd-4de3-98c2-d356ce145341" alt="screenshot">
<img src="https://github.com/4c65736975/headerWizard/assets/107006334/5ac2549a-583b-4f7a-a234-5f8e53bf10a0" alt="screenshot">

### Prerequisites

[Visual Studio Code](https://code.visualstudio.com/) (1.87.0 or newer)

If you want to install the development version you need to have [node](https://nodejs.org/en/) and [npm](https://nodejs.org/en/) installed on your system to run it. It is recommended to use the node version used for VS Code development itself which is documented [here](https://github.com/Microsoft/vscode/wiki/How-to-Contribute#prerequisites)

### Installation

Development Version:

1. `git clone https://github.com/4c65736975/headerWizard`
2. `code headerWizard`
3. `npm install` in the terminal, then `F5` to run

Latest Stable Development Version:

1. Download the [latest](https://github.com/4c65736975/headerWizard/releases) release
2. Open the VS Code Extensions tab `Ctrl+Shift+X`
3. Click `···` in upper right corner of the tab
4. Click `Install from VSIX...` and select the downloaded .vsix file

Latest Stable Version:

1. Install it like any other extension via VS Code Marketplace, you can follow the official [docs](https://code.visualstudio.com/docs/editor/extension-marketplace
)

<p align="right">&#x2191 <a href="#top">back to top</a></p>

## Usage

Make sure that the template you want to use is currently enabled

<img src="https://github.com/4c65736975/headerWizard/assets/107006334/37eb8e1a-6288-4ca4-91bb-14a462a18a07" alt="screenshot">

When creating a new file, the template that is currently enabled for a given extension is automatically applied

<img src="https://github.com/4c65736975/headerWizard/assets/107006334/6348a7e1-f0d3-4c0d-b7f2-d0f65e8bce9d" alt="screenshot">
<img src="https://github.com/4c65736975/headerWizard/assets/107006334/2fc711ab-c807-4681-bbd5-c522841f38e5" alt="screenshot">

### Parameters

Customize your header templates effortlessly using dynamic parameters enclosed in curly braces {}. Available parameters include:

**Filename**
<br/>
Inserts the created file name with its extension.
<br/>
`{filename}` e.g. main.ts

**Date**
<br/>
Inserts the current day.
<br/>
`{DD}` e.g. 28

Inserts the current month.
<br/>
`{MM}` e.g. 04

Inserts the current short year.
<br/>
`{YY}` e.g. 24

Inserts the current long year.
<br/>
`{YYYY}` e.g. 2024

Combine these parameters to create your desired date format. For instance, `{DD.MM.YY}` or `{MM/DD/YYYY}`. The possibilities are endless!

<p align="right">&#x2191 <a href="#top">back to top</a></p>

## License

Distributed under the GPL-3.0 license. See [LICENSE](https://github.com/4c65736975/headerWizard/blob/main/LICENSE) for more information.

<p align="right">&#x2191 <a href="#top">back to top</a></p>

## Acknowledgments

* [Choose an Open Source License](https://choosealicense.com)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">&#x2191 <a href="#top">back to top</a></p>
