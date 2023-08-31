import assert from "assert";
import { resolve } from "path";
import { URL } from "url";
import { PDF } from "../src/index";

async function runTestOn(input: string): Promise<boolean> {
  const file = resolve(__dirname, `./${input}.html`);
  const target = new URL(`file://${file}`);
  const output = resolve(__dirname, `./${input}.pdf`);

  const pdf = new PDF(target, output);
  const op = await pdf.render();
  return op.result === "ok";
}

it("PDF > generate", async () => {
  assert.strictEqual(await runTestOn("article"), true);
}).timeout(30000);
