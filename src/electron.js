const { app, BrowserWindow } = require("electron");
const { writeFileSync } = require("fs");
const { string: yargs } = require("yargs");

// Arguments
const { target, output } = yargs(["target", "output"]).argv;

// Wait until Electron is Ready
app.on("ready", function () {
  // PDF Generation Callback
  let exiting = false;
  function pdfGenerationCallback(err, pdf) {
    // Shutdown Electron
    window.close();
    app.quit();

    // Check if there is an Error
    if (err) {
      // Send the Error
      process.stdout.write(`${JSON.stringify({ error: err.toString() })}\n`, "utf8");
      return;
    } else if (pdf === undefined) {
      // Send the Error
      process.stdout.write(`${JSON.stringify({ error: new Error("Missing PDF buffer").toString() })}\n`, "utf8");
      return;
    }

    // Write the PDF File to a Temporary File
    try {
      writeFileSync(output, pdf);
    } catch (error) {
      // Send the Error
      process.stdout.write(`${JSON.stringify({ error: error.toString() })}\n`, "utf8");
      return;
    }

    // Send a success
    process.stdout.write(`${JSON.stringify({ result: "ok" })}\n`, "utf8");
  }

  // Load the HTML File into Electron
  const window = new BrowserWindow({ show: false, width: 1024, height: 768, webPreferences: { sandbox: false } });
  window.loadURL(target);
  window.webContents.on("did-finish-load", function () {
    // Prevent Multiple Callback Calls
    if (exiting) {
      return;
    }
    exiting = true;

    // Safety Extra Wait
    setTimeout(function () {
      // Print the Content to a Base64 PDF String
      window.webContents
        .printToPDF({
          marginsType: 0,
          pageSize: "A4",
          landscape: false,
          printBackground: false,
          printSelectionOnly: false,
        })
        .then(function (buffer) {
          pdfGenerationCallback(null, buffer);
        })
        .catch(function (err) {
          pdfGenerationCallback(err);
        });
    }, 2000);
  });
});
