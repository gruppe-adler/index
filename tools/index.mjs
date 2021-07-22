import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { insertTopicPills } from './topicPills.mjs';

const INPUT_PATH = join(__dirname, '..', 'README.md');
const OUTPUT_PATH = join(__dirname, '..', 'dist', 'README.md');

let readmeText = readFileSync(INPUT_PATH, 'utf-8');

// TODO: Insert Mod list's etc.

readmeText = insertTopicPills(readmeText)

writeFileSync(OUTPUT_PATH, readmeText);