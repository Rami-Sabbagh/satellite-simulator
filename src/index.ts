import 'preloader';

import Application from 'app';
import Interface from 'interface';

const container = document.createElement('div');
container.style.width = '100%';
container.style.height = '100%';
document.body.appendChild(container);

let application = new Application(container);
const userInterface = new Interface(application);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).application = application;

if (module.hot) {
    module.hot.accept('./app', () => {
        const oldApplication = application;
        oldApplication.destroy();

        application = new Application(container);
        application.restoreState(oldApplication);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).application = application;

        userInterface.hotReplaceApplication(application);
    });
}