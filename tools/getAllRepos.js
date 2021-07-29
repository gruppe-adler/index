const github = require('@actions/github');
const { ORG_NAME } = require('./const');
const { generateQueryString } = require('./query');

const query = `
query ($queryStr: String!, $after:String) {
    search(query: $queryStr, type: REPOSITORY, first: 100, after:$after) {
        edges{cursor}
        nodes {
            ... on Repository {
                id
                name
                description
                isArchived
                isPrivate
                isTemplate
                pushedAt
                repositoryTopics(first:10) {
                    nodes {
                        topic {
                            name
                        }
                    }
                }
            }
        }
        repositoryCount
    }
}
`;

const octokit = github.getOctokit(process.env.GITHUB_TOKEN ?? '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');

/**
 * @typedef {{ topic: { name: string } }} Topic
 * @typedef {{ cursor: string }} Edge
 * @typedef {{ id: string, name: string, description: string, isArchived: boolean, pushedAt: string, isTemplate: boolean, isPrivate: boolean, topics: string[] }} Repo
 * @typedef {{ id: string, name: string, description: string, isArchived: boolean, pushedAt: string, isTemplate: boolean, isPrivate: boolean, repositoryTopics: { nodes: Topic[] } }} ApiRepo
 */

/**
 * Recursively query all repositories matching query string
 * @param {string} queryStr Query string 
 * @param {Repo[]} [repos] Previous repos (used for recursion)
 * @param {string} [after] Query repos after this cursor (used for recursion)
 * @returns {Promise<Repo[]>} Repos
 */
async function runQuery(queryStr, repos = [], after = undefined) {
    /**
     * @type {{ search: { edges: Edge[], nodes: ApiRepo[], repositoryCount: number }}}
     */
    console.log('Running query', queryStr, after);
    const result = await octokit.graphql(query, { queryStr, after });

    const curRepos = result.search.nodes.map(repo => {
        return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            isArchived: repo.isArchived,
            isPrivate: repo.isPrivate,
            isTemplate: repo.isTemplate,
            pushedAt: repo.pushedAt,
            topics: repo.repositoryTopics.nodes.map(t => t.topic.name),
        }
    });

    repos.push(...curRepos);

    if (repos.length === result.search.repositoryCount) return repos;
    if (curRepos.length === 0) return repos;

    const newAfter = result.search.edges[result.search.edges.length - 1].cursor;


    return runQuery(queryStr, repos, newAfter)
};

const ORG_REPOSITORIES_PROMISE = runQuery(generateQueryString({ org: ORG_NAME })).then(repos => {
    return repos.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
});

/**
 * Get all repos of organization
 * @returns {Promise<Repo[]>}
 */
async function getAllOrgRepos() {
    return ORG_REPOSITORIES_PROMISE;
}

module.exports = {
  getAllOrgRepos
};