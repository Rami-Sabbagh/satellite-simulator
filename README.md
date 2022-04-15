
# satellite-simulator

A university physics project for simulating satellites in orbit.

## Installation instructions

1. Clone the git repository locally or download the source-code and extract it.
2. Install [Node.js](https://nodejs.org/) 16 or later on your system.
3. Install Yarn 1.x globally on the system. (command works cross-paltform).

```
npm install -g yarn
```

4. Open a terminal in the root of the repository and install the project's dependencies.

```
yarn
```

5. Start the development server.

```
yarn start
```

6. A browser page should automatically open with the project running in it.

## Development Server

It's a webserver provided by [webpack](http://webpack.js.org/) that serves the project while being built in realtime and stored in memory.

You can read more about it [here](https://webpack.js.org/configuration/dev-server/), [here](https://webpack.js.org/guides/development/#using-webpack-dev-server) and [here](https://github.com/webpack/webpack-dev-server).

Runs by default at port 3000 and so can be accessed at http://localhost:3000/ (should automatically open when starting the dev server).

### Live Reload

When using the development server you'll have the benefit of automatic live reload whenever changes are made.

### Hot Module Reload

The HMR support is enabled in the project, but the code has to support it.

Which means writing code that accepts the module replacements and does any adjustements needed.

That is implemented for `src/scene.ts` in `src/index.ts`.

So when `scene.ts` is modified it's hot reloaded without reloading the whole page, by replacing the old scene instance by a new one.

But when files such as `index.ts` are modified with no HMR support, a whole page reload is automatically performed.

During the project development you might wish to implement HMR support for other sub-modules, for example to avoid losing the state of created scene objects.

You can read more at [webpack's documentation page](https://webpack.js.org/concepts/hot-module-replacement/).

## Build Instructions

After following the installation instructions run:

```
yarn build
```

The build can be then accessed at `/dist` and could be served as a static page content.
