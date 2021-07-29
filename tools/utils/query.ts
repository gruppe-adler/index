interface Query {
    topics?: string[];
    org?: string;
    archived?: boolean;
}

/**
 * Generate link to GitHub search.
 * @param  {Query} query
 * @returns {string}
 */
export function generateQueryLink (query: Query): string {
    const queryStr = generateQueryStrings(query).map(encodeURIComponent).join('+');

    return `https://github.com/search?q=${queryStr}`;
};

/**
 * Generate string for GitHub search.
 * @param  {Query} query
 * @returns {string}
 */
export function generateQueryString (query: Query): string {
    return generateQueryStrings(query).join(' ');
};

/**
 * @param  {Query} query
 * @returns {string[]}
 */
function generateQueryStrings (query: Query): string[] {
    const queries: string[] = [];

    if (query.org !== undefined) queries.push(`org:${query.org}`);
    if (query.archived !== undefined) queries.push(`archived:${query.archived ? 'true' : 'false'}`);

    for (const topic of query.topics ?? []) {
        queries.push(`topic:${topic}`);
    }

    return queries;
}
