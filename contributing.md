# Contributing to Satellite Simulator VI

To ensure the best code quality possible when initiating a Pull Request, please follow the guidelines below.

## Contribution workflow

When you want to add a new feature, bug fix, or whatever that you think will be a good addition to the project, please stick to this workflow:

1. Create a new local branch from `origin/main`
2. Select a proper name for your branch that reflects your contribution.
3. Add your code.
4. Push your code to a branch on the remote (origin) with the same name as your local branch.
5. Go to the `pull requests` tab and create a new pull request.
6. If there's an issue that's related to your feature, please reference it in the pull request's description.

    To reference an issue in a pull request, just write the issue's number preceded by a `#` in the pull request's description.

7. Assign reviewers from the right sidebar.

## Git

### Commit Messages

Please refer to this guideline when writing your commit messages: https://gist.github.com/robertpainsi/b632364184e70900af4ab688decf6f53

In short, keep them concise and below 70 characters. You can always provide a longer description for your commits below the message.

### Log

Please strive to keep Git's log clean and informative.

For example, if you're pushing a feature branch, try to squash your commits into bigger ones that clearly indicate the purpose of your branch.

So instead of extremely atomic commits that fill too many rows of git's log such as

-   `Fix a typo in readme`
-   `Fix a variable name`
-   `Create a new object`

Try to squash them into a `Introduce feature XYZ`.

More on this here: https://spin.atomicobject.com/2017/04/23/maintain-clean-git-history/

## Linting

Before commiting code to any branch, husky will run `eslint` against the staged files. If there are any errors, you have to fix them before being able to commit them.

You can specify other scripts to run before the commit phase using the `lint-staged` key in the `package.json` file.

## Naming

### Files

Please name your files according to the `kebab-case` convention.

```
// Good
math-constants.ts

// Bad
MathConstants.ts
```

### Variables

Please use the `camelCase` convention when naming your variables.

```ts
// Good
const colorPicker = {};

// Bad
const color_picker = {};
```

## TypeScript

It's highly, highly recommended that you use proper types for everything that you write. They not only prevent possible bugs, but also add intellisense support.

Using `any` is frowned-upon, unless you have a valid reason to do so.
