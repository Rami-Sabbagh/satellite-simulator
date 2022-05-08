import 'styles/index.css';
import Application from 'app';

/**
 * Spawns a fullscreen instance of the THREE.js application.
 */
function spawnApplication() {
    const container = document.createElement('div');

    container.style.width = '100%';
    container.style.height = '100%';

    document.body.appendChild(container);
    return new Application(container);
}

let application = spawnApplication();

if (module.hot) {
    module.hot.accept('./app', () => {
        application.container.remove();
        application = spawnApplication();
    });
}