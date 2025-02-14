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
    } catch (_err) {
      /* Nothing to do */
    }
  }
  return result;
}

function isExecpError(err: unknown): err is Error & { stdout: string; stderr: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return err instanceof Error && typeof (err as any).stdout === "string" && typeof (err as any).stderr === "string";
}

async function exitCodeSafeExec(command: string): Promise<string> {
  // Execute the comand
  let result: { stdout: string; stderr: string };
  try {
    result = await execp(command);
  } catch (execpErr) {
    // Restore the result if there is an error
    if (isExecpError(execpErr)) {
      result = { stdout: execpErr.stdout, stderr: execpErr.stderr };
    } else {
      result = { stdout: "", stderr: execpErr instanceof Error ? execpErr.message : "Missing error message" };
    }
  }

  if (result.stdout !== "") {
    return result.stdout;
  }

  throw new Error(`Operation failed [command : ${command}]\n${result.stderr}`);
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
    const stdout = await exitCodeSafeExec(command);

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
