import Profile from "../../Profile";
import ChatEvent from "../../events/ChatEvent";
import OutputAction from "../../outputActions/OutputAction";

export default class OutputEvent {
    profile: Profile;
    chatEvent: ChatEvent;
    message: any;
    variables: { [key: string]: any };
    actions: Array<OutputAction>;
    preventDefaultBehavior: boolean;

    constructor(profile: Profile, chatEvent: ChatEvent, message: any) {
        this.profile = profile;
        this.chatEvent = chatEvent;
        this.message = message;
        this.actions = [];

        //Whether or not to prevent default event behavior (based on the chat descriptor default behavior function)
        this.preventDefaultBehavior = false;

        //Variables should be snapshot at the time of the event firing
        this.variables = this.chatEvent.getVariables(message);
    }

    process(): void {
        //Will iterate through triggers when they are added
        if (!this.preventDefaultBehavior)
            this.actions.push(...this.chatEvent.getDefaultActions(this));
    }
}
