[![npm version](https://badge.fury.io/js/@lesjoursfr%2Fhtml-to-pdf.svg)](https://badge.fury.io/js/@lesjoursfr%2Fhtml-to-pdf)
[![QC Checks](https://github.com/lesjoursfr/html-to-pdf/actions/workflows/quality-control.yml/badge.svg)](https://github.com/lesjoursfr/html-to-pdf/actions/workflows/quality-control.yml)

# @lesjoursfr/html-to-pdf

Generate PDF from HTML with simple API in Node.js.

# What is this library?

This library use electron to generate PDF files from HTML.

## Usage

Install the lib and add it as a dependency :

```
    npm install @lesjoursfr/html-to-pdf
```

Then put this in your code:

```javascript
    const { PDF } = require("@lesjoursfr/html-to-pdf");

    const pdf = new PDF(target, output);
    pdf.render()
        .then(() => {
            console.log("PDF Generated Successfully!")
        })
        .catch((err) => {
            console.error("Failed to generate PDF because of ", err)
        });
    );
```

#### Parameters

- `target`:
  The URL of the HTML page
- `output`:
  The PDF file path

## Electron 42

Previously, the electron npm package would download the Electron binary from the repository's GitHub Releases in the package's postinstall script.
With recent supply chain security attacks against the npm ecosystem with postinstall scripts as a common attack vector, Electron will now download itself dynamically the first time that its main bin script is run (e.g. via npx electron).
With this change, you can now use Electron with the npm --ignore-scripts flag.

If you need to download the Electron binary on-demand, you can now call the install-electron script:

```bash
npx install-electron
```

See the [release post](https://www.electronjs.org/blog/electron-42-0) for more details.
