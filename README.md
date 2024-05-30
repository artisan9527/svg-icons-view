# svg-icons-view

## Overview

`svg-icons-view` is a CLI tool that allows you to preview, rename, and delete SVG files within your project. It achieves this by starting a local HTTP server and opening a browser window for previewing the SVG files.

**By default, the `node_modules` and `.git` folder is ignored. To include `node_modules`, please use the `--node_modules` parameter.**

## Installation

To install `svg-icons-view`, use npm:

```shell
npm install svg-icons-view -g
```

This will install the package globally, allowing you to use the `icons` command from anywhere in your terminal.

## Usage

To use `svg-icons-view`, navigate to your project's root directory in your terminal and execute the following command:

```shell
icons
```

This will start the HTTP server and open a browser window where you can preview all SVG files within your project.

## Features

- **Preview SVG Files**: View all SVG files within your project in a browser window.
- **Rename SVG Files**: Rename SVG files directly from the browser interface.
- **Delete SVG Files**: Delete SVG files directly from the browser interface.
