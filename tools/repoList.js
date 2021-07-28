const { ORG_NAME } = require('./const');
const { getAllOrgRepos } = require('./getAllRepos');
const { replaceAsync, includesAll } = require('./utils');

const REPO_LIST_PATTERN = /<div [^>]*data-list="([a-z0-9-_\s]+)"[^>]*>[^<]*<\/div>/gi

/**
 * @param {Object[]} repositories Repository names
 * @returns {Promise<string>} Rendered list
 */
async function generateList(repositories) {
    return `<p align="center">\n${(await Promise.all(repositories.map(renderRepo))).join('\n')}\n</p>`;
}

/**
 * @param repo Repository name
 * @returns {Object} Rendered repository
 * @returns {Promise<string>} Rendered repo
 */
async function renderRepo(repo) {
    const { name, description } = repo;

    await generateRepoImage(name, description);

    const str = `<a href="https://github.com/${ORG_NAME}/${name}"><img src="./img/repositories/${name}.svg"></a>`;

    return str;
}

async function generateRepoImage(name, description) {

}

/**
 * Insert repository lists in string
 * @param {string} str 
 * @returns {string} String with repository lists
 */
async function insertRepoList(str) {
    return replaceAsync(str, REPO_LIST_PATTERN, async (match, topicsStr) => {
        const topics = topicsStr.split(' ');

        const allRepos = await getAllOrgRepos();

        const repos = allRepos.filter(repo => !repo.isArchived && !repo.isPrivate && includesAll(repo.topics, topics))

        return generateList(repos)
    });
}

module.exports = {
    insertRepoList
};