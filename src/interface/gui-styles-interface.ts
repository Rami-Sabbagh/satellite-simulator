import type Application from 'app';
import GUI from 'lil-gui';

// All variable names can be found here: https://lil-gui.georgealways.com/examples/kitchen-sink/
const propertyToVariableMap = {
    fontSize: '--font-size',
    inputFontSize: '--input-font-size',
    spacing: '--spacing',
};

type Properties = {
    [key: string]: string | number;
};

export default class GUIInterface {
    protected readonly folder = this.gui.addFolder('GUI Styles').onChange(this.onChange.bind(this));

    protected properties: Properties;
    protected guiContainer = document.querySelector(".lil-gui.root") as HTMLElement;
    protected allGuiElements = document.querySelectorAll(
        '.lil-gui'
    ) as NodeListOf<HTMLElement>;

    constructor(protected readonly gui: GUI, protected app: Application) {
        this.properties = this.getproperties();

        this.folder.open(false);
        this.folder
            .add(this.properties, 'fontSize')
            .name('Font size')
            .min(11)
            .max(30)
            .step(1);

        this.folder
            .add(this.properties, 'spacing')
            .name('Spacing')
            .min(4)
            .max(20)
            .step(1);

        this.updateGUIStyles(this.properties);
    }

    private getproperties = () => {
        const oldproperties = localStorage.getItem('guiproperties');
        if (oldproperties) return JSON.parse(oldproperties);

        // Default properties
        return { fontSize: 11, spacing: 4 };
    };

    private updateGUIStyles(properties: Properties) {
        for (const [key, value] of Object.entries(properties)) {
            const CSSVariableName = propertyToVariableMap[key as keyof typeof propertyToVariableMap];
            if (CSSVariableName) {
                // You have to loop over all lil-gui's elements, otherwise
                // only the first one will be updated because of CSS inheritance.
                this.allGuiElements.forEach((element) => {
                    element.style.setProperty(CSSVariableName, value + 'px');

                    // Update both font size and input size at once
                    if (key === 'fontSize') {
                        const inputFontSizeVariable = propertyToVariableMap['inputFontSize'];
                        element.style.setProperty(inputFontSizeVariable, value + 'px');
                    }
                });
            }
        }
    }

    hotReplaceApplication(app: Application) {
        this.app = app;
    }

    onChange({ property, value }: {
        property: string;
        value: number;
    }) {
        this.updateGUIStyles({ [property]: value });
        localStorage.setItem('guiproperties', JSON.stringify(this.properties));
    }
}
