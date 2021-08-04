# Contributing to this repository

## Introduction
**DO NOT COMMIT ANYTHING TO THE `master` BRANCH!**  
Everything in the `master` branch is automatically generated off the `template` branch via GitHub actions. Any changes must be commited to the `template` branch.

The workflow runs for every push to the `template`-branch and once per day at midnight.  
It takes the `README_TEMPLATE.md`, replaces some placeholder elements (see below for further explanation) and then pushes it as `README.md` and all relevant assets to the `master` branch.

## README Placeholders
### Topic Pills
```html
<span data-topic="web"></span>
```
A `span` element with an `data-topic` attribute will be replaced with a topic pill, which also acts as a link to that topic.

### Repository Lists
```html
<div data-list="mod arma3"></div>
```
A `div` element with a `data-list` attribute will be replaced with a list of repositories in our organization matching those topics. The topics can be specified within the attribute value. Use spaces in between topics to specify multiple. Only public and non-archived repositories will be listed. Up to 8 repositories will be shown the rest will be hidden within a spoiler.

### Other topics
```html
<div data-other-topics="arma3 coop library mission mod template test tvt web"></div>
```
A `div` element with a `data-other-topics` attribute will be replaced with a list of popular topics. You can specify a list of ignored topics in the attribute value (separated by spaces). We only count public and non-archived repositories. 

## Contributing Code
Everything described above is done with Typescript. This is a fairly standard node/typescript setup. All code can be found in the `tools` directory.

### Supplying a GitHub token
The Code needs a GitHub token to make requests to the GitHub API. Usually GitHub Actions provide a usable token, but to run the code locally you have to provide your own.  
First, generate a Personal Access Token [here](https://github.com/settings/tokens) (it does not need any scopes) and then set it as the `GITHUB_TOKEN` environment variable. Either by using export on unix or creating an `.env` file within the root directory of this repository which looks like this (with your token of course):
```env
GITHUB_TOKEN=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
```

### Building & Running locally
1. Supply a GitHub token as described above
2. Install dependencies ```npm ci```
3. Build code ```npm run build```
4. Run code ```npm start```

### Linter
You can run eslint with ```npm run lint```

The output can be found in the `dist` directory.
