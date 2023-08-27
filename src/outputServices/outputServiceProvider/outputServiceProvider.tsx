import OutputMessageAction from "../../outputActions/OutputMessageAction";

export default abstract class OutputServiceProvider {
    readonly name: string = "";
    outputSettings: any; //refers to speech, braille, etc settings

    constructor(outputSettings: any | null = null) {
        this.outputSettings = outputSettings ? outputSettings : {};
        this.ServiceSettingsComponent =
            this.ServiceSettingsComponent.bind(this);
    }

    static async initialize(): Promise<void> {
        return;
    }

    abstract deserialize(data: any): OutputServiceProvider;

    abstract serialize(): any;

    abstract getUIErrors(): Array<string>;

    abstract OutputSettingsComponent({ settings }: { settings: any }): any;

    abstract ServiceSettingsComponent(): any;

    abstract output(action: OutputMessageAction): void;
}
