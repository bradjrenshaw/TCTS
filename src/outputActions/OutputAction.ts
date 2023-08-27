import OutputEvent from "../outputServices/outputServiceProvider/OutputEvent";
import Profile from "../Profile";

export default abstract class OutputAction {

    readonly name: string = "";
    event: OutputEvent;
    profile: Profile;
    message: any;

    constructor(profile: Profile, event: OutputEvent) {
        this.profile = profile;
        this.event = event;
        this.message = event.message;
    }

    isComplete(): boolean {
        //Most actions will complete immediately, so returning true is the best behavior in a majority of cases
        return true;
    }

    abstract execute(): void;
};
