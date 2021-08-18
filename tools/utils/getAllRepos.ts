import * as github from '@actions/github';
import { ORG_NAME } from './const';
import { generateQueryString } from './query';

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

const octokit = github.getOctokit(process.env.GITHUB_TOKEN ?? '');

interface BaseRepo {
    id: string;
    name: string;
    description: string;
    isArchived: boolean;
    pushedAt: string;
    isTemplate: boolean;
    isPrivate: boolean;
}

interface Repo extends BaseRepo {
    topics: string[];
}

interface ApiRepo extends BaseRepo {
    repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
}

/**
 * Recursively query all repositories matching query string
 * @param queryStr Query string
 * @param [repos] Previous repos (used for recursion)
 * @param [after] Query repos after this cursor (used for recursion)
 * @returns Repos
 */
async function runQuery (queryStr: string, repos: Repo[] = [], after?: string): Promise<Repo[]> {
    console.log('Running query', queryStr, after);
    const result: { search: { edges: Array<{ cursor: string }>; nodes: ApiRepo[]; repositoryCount: number }} = await octokit.graphql(query, { queryStr, after });

    const curRepos = result.search.nodes.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        isArchived: repo.isArchived,
        isPrivate: repo.isPrivate,
        isTemplate: repo.isTemplate,
        pushedAt: repo.pushedAt,
        topics: repo.repositoryTopics.nodes.map(t => t.topic.name)
    }));

    repos.push(...curRepos);

    if (repos.length === result.search.repositoryCount) return repos;
    if (curRepos.length === 0) return repos;

    const newAfter = result.search.edges[result.search.edges.length - 1].cursor;

    return await runQuery(queryStr, repos, newAfter);
};

const ORG_REPOSITORIES_PROMISE = runQuery(generateQueryString({ org: ORG_NAME })).then(repos => {
    return repos.sort((a, b) => (new Date(b.pushedAt)).getTime() - (new Date(a.pushedAt)).getTime());
});

/**
 * Get all repos of organization
 * @returns Repos
 */
export async function getAllOrgRepos (): Promise<Repo[]> {
    return await ORG_REPOSITORIES_PROMISE;
}
