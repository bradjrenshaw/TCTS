import OutputEvent from "../outputServices/outputServiceProvider/OutputEvent";
import OutputAction from "./OutputAction";
import Profile from "../Profile";

export default class ConsoleLogAction extends OutputAction {

    constructor(profile: Profile, event: OutputEvent) {
        super(profile, event);
    }

    execute(): void {    
        console.log(this.event.message);
    }
};
