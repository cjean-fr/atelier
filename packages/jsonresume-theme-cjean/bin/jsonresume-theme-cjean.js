#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { render } from "../dist/index.js";

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      output: { type: "string", short: "o" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(`
Usage: npx jsonresume-theme-cjean [resume.json]

Options:
  -o, --output <file>  Output file (default: resume.html)
  -h, --help           Show help
    `);
    return;
  }

  const input = positionals[0] || "resume.json";
  const output = values.output || "resume.html";

  try {
    console.log(`⌛ Rendering resume from ${input}...`);
    const resumePath = resolve(process.cwd(), input);
    const resumeData = JSON.parse(await readFile(resumePath, "utf-8"));
    const html = await render(resumeData);
    const outputPath = resolve(process.cwd(), output);
    await writeFile(outputPath, html);
    console.log(`✅ Successfully exported resume to ${output}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Error: File not found: ${error.path}`);
    } else {
      console.error(`❌ Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
