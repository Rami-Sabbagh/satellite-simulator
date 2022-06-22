# Satellite Simulator VI - Deluxe Edition

![Satellite Simulator's Logo](./src/assets/logos/logo-white.jpg "Satellite Simulator's Logo")

[![CodeFactor](https://www.codefactor.io/repository/github/rami-sabbagh/satellite-simulator/badge)](https://www.codefactor.io/repository/github/rami-sabbagh/satellite-simulator)

A university physics project for simulating satellites in orbit.

## Installation instructions

1. Clone the git repository locally or download the source-code and extract it.
2. Install [Node.js](https://nodejs.org/) 16.x on your system.
3. Enable Yarn through `corepack`, which ships with Node 16.x.

```sh
# Use an elevated shell (Administrator shell on Windows, sudo on Unix).
corepack enable
```

4. Open a terminal in the root of the repository and install the project's dependencies.

```sh
yarn
```

5. Start the development server.

```sh
yarn start
```

6. A browser page should automatically open with the project running in it.

## Tech stack

-   Three.js
-   TypeScript
-   Husky and ESLint
-   Webpack

## Development Server

It's a webserver provided by [webpack](http://webpack.js.org/) that serves the project while being built in realtime and stored in memory.

You can read more about it [here](https://webpack.js.org/configuration/dev-server/), [here](https://webpack.js.org/guides/development/#using-webpack-dev-server) and [here](https://github.com/webpack/webpack-dev-server).

Runs by default on port 9000 and so can be accessed at http://localhost:9000/ (should automatically open when starting the dev server).

### Live Reload

When using the development server you'll have the benefit of automatic live reload whenever changes are made.

### Hot Module Reload

The HMR support is enabled in the project, but the code has to support it.

Which means writing code that accepts the module replacements and does any adjustments needed.

That is implemented for `src/app.ts` in `src/index.ts`.

So when `app.ts` is modified it's hot reloaded without reloading the whole page, by replacing the old scene instance by a new one.

But when files such as `src/physics/kepler-math.ts` are modified with no HMR support, a whole page reload is automatically performed.

During the project development you might wish to implement HMR support for other sub-modules, for example to avoid losing the state of created scene objects.

You can read more at [webpack's documentation page](https://webpack.js.org/concepts/hot-module-replacement/).

## Build Instructions

After following the installation instructions run:

```sh
yarn build
```

The build can be then accessed at `/dist` and could be served as static page content.

## Credits

Icons are from: https://www.svgrepo.com/

[Satellite](https://sketchfab.com/3d-models/satellite-90c8fafa35c84e3b90601dd3ac8d202f) 3D model, under [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0/), was modified by [RedDeadAlice](https://github.com/RedDeadAlice).

## Developed by

- [Rami Sabbagh](https://rami-sabbagh.github.io/) ([rami.sab07@gmail.com](mailto:rami.sab07@gmail.com)).
- Hasan Mothaffar ([hasan.mozafar@gmail.com](mailto:hasan.mozafar@gmail.com)).
- Yaman Qassas ([yaman102011@gmail.com](mailto:yaman102011@gmail.com)).
- Edward Karra ([edwardkarra@gmail.com](mailto:edwardkarra@gmail.com)).
- [RedDeadAlice](https://github.com/RedDeadAlice).
