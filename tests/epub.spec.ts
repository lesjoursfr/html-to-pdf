import test from 'ava';
import { resolve } from 'path';
import { URL } from 'url';
import { PDF } from '../src/index';

async function runTestOn (input: string) : Promise<boolean> {
  const file = resolve(__dirname, `./${input}.html`);
  const target = new URL(`file://${file}`);
  const output = resolve(__dirname, `./${input}.pdf`);

  const pdf = new PDF(target, output);
  await pdf.render();
  return true;
}

test.serial('PDF > generate', async (t) => {
  t.is(await runTestOn('article'), true);
});
