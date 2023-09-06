import Profile from "../Profile";
import OutputService from "../outputServices/outputService";
import OutputEvent from "../outputServices/outputServiceProvider/OutputEvent";
import OutputAction from "./OutputAction";

export default class OutputMessageAction extends OutputAction {
    outputService: OutputService;
    _isComplete: boolean;

    constructor(profile: Profile, event: OutputEvent) {
        super(profile, event);
        if (!profile.outputService) {
            throw new Error(
                "Attempted to initialize OutputMessageAction with no OutputService.",
            );
        }
        this.outputService = profile.outputService;
        this._isComplete = false;
    }

    complete(): void {
        this._isComplete = true;
    }

    isComplete(): boolean {
        return this._isComplete;
    }

    execute() {
        if (this.event.variables.text) {
            this.outputService.output(this);
        } else {
            this.complete();
        }
    }
}
