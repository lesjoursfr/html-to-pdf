import { spawn } from 'child_process';
import { resolve } from 'path';
import { URL } from 'url';

function spawnAndWait (url: string, output: string) : Promise<void> {
  const script = resolve(__dirname, './electron.js');

  return new Promise((resolve, reject) => {
    // Error & Data
    let error : any;

    // Spawn the Electron Process
    const child = spawn(
      require.resolve('electron/cli.js'),
      ['--no-sandbox', script, '--target', url, '--output', output],
      { stdio: 'pipe' }
    );

    // Pass stdout response to the parent process
    child.stdout.on('data', function (data) {
      // Check the data type
      if (Buffer.isBuffer(data)) { data = data.toString('utf8'); }

      // Skip non JSON messages
      let message;
      try {
        message = JSON.parse(data);
      } catch (err) {
        return;
      }

      // Check if it's an error
      if (message.error) {
        error = new Error(error);
      }
    });

    // Send Child Errors to the parent process
    child.on('error', function (err: Error) {
      error = err;
    });

    child.on('close', function (code, signal) {
      (error || (code !== 0))
        ? reject(error ?? new Error(`Non 0 exit code : ${code} (signal : ${signal})`))
        : resolve();
    });
  });
}

export class PDF {
  url: URL;
  output: string;

  constructor (url: URL, output: string) {
    // Required options
    this.url = url;
    this.output = output;
  }

  async render () : Promise<void> {
    // Render the PDF
    return spawnAndWait(this.url.toString(), this.output);
  }
}
