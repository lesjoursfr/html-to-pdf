import { exec } from "child_process";
import { resolve } from "path";
import { URL } from "url";
import { promisify } from "util";

const execp = promisify(exec);
const script = resolve(__dirname, "./electron.js");

export interface PDFOptions {
  xvfb: boolean;
  xvfbArgs: string | undefined;
}

export interface OperationResult {
  error: string | undefined;
  result: "ok" | undefined;
}

function cleanOutput(std: string): OperationResult | null {
  // We look for a line that contains a valid JSON string
  let result = null;
  for (const line of std.split("\n")) {
    try {
      result = JSON.parse(line);
    } catch (err) {
      /* Nothing to do */
    }
  }
  return result;
}

export class PDF {
  url: URL;
  output: string;
  options: PDFOptions;

  constructor(url: URL, output: string, options?: PDFOptions) {
    // Required options
    this.url = url;
    this.output = output;
    this.options = options || { xvfb: false, xvfbArgs: undefined };
  }

  private command(): string {
    if (this.options.xvfb) {
      return `xvfb-run ${this.options.xvfbArgs || ""} node ${require.resolve(
        "electron/cli.js"
      )} --no-sandbox ${script} --target ${this.url.toString()} --output ${this.output}`;
    }

    return `node ${require.resolve(
      "electron/cli.js"
    )} --no-sandbox ${script} --target ${this.url.toString()} --output ${this.output}`;
  }

  async render(): Promise<OperationResult> {
    // Render the PDF
    const command = this.command();
    const { stdout } = await execp(command);

    // Clean output
    const opResult = cleanOutput(stdout);
    if (opResult === null) {
      throw new Error(`Wrong operation result [command : ${command}]`);
    }

    // Check the result
    if (opResult.error) {
      throw new Error(opResult.error);
    }
    return opResult;
  }
}
