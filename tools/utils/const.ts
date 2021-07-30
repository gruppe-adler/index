import { join } from 'path';

export const ORG_NAME = 'gruppe-adler';

export const OUTPUT_DIR = join(__dirname, '..', '..', 'dist');
export const INPUT_PATH = join(__dirname, '..', '..', 'README_TEMPLATE.md');
export const OUTPUT_PATH = join(OUTPUT_DIR, 'README.md');
export const IMG_DIR = join(OUTPUT_DIR, 'img');
