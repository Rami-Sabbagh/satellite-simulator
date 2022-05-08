import 'styles/index.css';
import Application from 'app';

const container = document.createElement('div');
container.style.width = '100%';
container.style.height = '100%';
document.body.appendChild(container);

let application = new Application(container);

if (module.hot) {
    module.hot.accept('./app', () => {
        application.destroy();
        application = new Application(container);
    });
}