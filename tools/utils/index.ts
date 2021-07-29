export async function replaceAsync (str: string, regex: string|RegExp, asyncFn: (substring: string, ...args: string[]) => Promise<string>): Promise<string> {
    const promises: Array<Promise<string>> = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);

        return match;
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift() ?? '');
}

export function includesAll<T> (arr: T[], values: T[]): boolean {
    return values.every(v => arr.includes(v));
}
