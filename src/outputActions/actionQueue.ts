import OutputEvent from "../outputServices/outputServiceProvider/OutputEvent";
import DataManager from "../DataManager";
import OutputAction from "./OutputAction";

export default class ActionQueue {

    dataManager: DataManager;
    actions: Array<OutputAction>;
    private processing: boolean;
    private currentAction: OutputAction | undefined;

    constructor(dataManager: DataManager) {
        this.dataManager = dataManager;
        this.actions = [];
        this.processing = false;
        this.currentAction = undefined;
        this.process = this.process.bind(this);
        this.run = this.run.bind(this);
    }

    enqueueAction(action: OutputAction): void {
        this.actions.push(action);
    }

    enqueueEvent(event: OutputEvent): void {
        for (let action of event.actions) {
            this.actions.push(action);
        }
    }

    peek(): OutputAction | undefined {
        return this.actions[0];
    }

    pop(): OutputAction | undefined {
        return this.actions.shift();
    }

    process(): void {
        if (this.currentAction) {
            if (this.currentAction.isComplete()) {
                this.currentAction = undefined;
            }
        } else {
            //This is required due to Chrome's handling of Web TTS.
            //The call to cancel is required to keep the speech synthesis active. If this isn't used, the onEnd events or calls to speak stop responding until the browser is focused after a few seconds of inactivity.
            window.speechSynthesis.cancel();
        }
        if (!this.currentAction) {
            this.currentAction = this.pop();
            if (this.currentAction) {
                this.currentAction.execute();
            }
        }
    }

        run(): void {
            this.process();
            setTimeout(this.run, 10);
        }
};
