const { join, dirname } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const { insertTopicPills } = require('./topicPills');
const { insertRepoList } = require('./repoList');

const INPUT_PATH = join(__dirname, '..', 'README.md');
const OUTPUT_PATH = join(__dirname, '..', 'dist', 'README.md');

(async function() {
    let readmeText = readFileSync(INPUT_PATH, 'utf-8');
    
    readmeText = await insertRepoList(readmeText);
    
    readmeText = insertTopicPills(readmeText)
    
    writeFileSync(OUTPUT_PATH, readmeText);
})()
