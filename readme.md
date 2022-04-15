[![npm version](https://badge.fury.io/js/@lesjoursfr%2Fhtml-to-pdf.svg)](https://badge.fury.io/js/@lesjoursfr%2Fhtml-to-pdf)
[![Build Status](https://travis-ci.org/lesjoursfr/html-to-pdf.svg?branch=master)](https://travis-ci.org/lesjoursfr/html-to-pdf)

# html-to-pdf

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

-   `target`:
    The URL of the HTML page
-   `output`:
    The PDF file path
