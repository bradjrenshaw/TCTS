import OutputAction from "../outputActions/OutputAction";
import OutputEvent from "../outputServices/outputServiceProvider/OutputEvent";

type getDefaultActionsFuncType = (event: OutputEvent) => any;
type getVariablesFuncType = (message: any) => any;

export default class ChatEvent {
    readonly name: string;
    readonly parent: ChatEvent | null;
    private childEvents: { [key: string]: ChatEvent };
    protected variableNames: { [key: string]: any };
    protected getVariablesFunc: getVariablesFuncType | null;
    protected getDefaultActionsFunc: getDefaultActionsFuncType | null;

    constructor(
        parent: ChatEvent | null,
        name: string,
        getDefaultActionsFunc: getDefaultActionsFuncType | null = null,
        getVariablesFunc: getVariablesFuncType | null = null,
    ) {
        this.name = name;
        this.parent = parent;
        this.variableNames = {};
        this.getDefaultActionsFunc = getDefaultActionsFunc;
        this.getVariablesFunc = getVariablesFunc;
        this.childEvents = {};
    }

    public getDefaultActions(event: OutputEvent): Array<OutputAction> {
        if (this.getDefaultActionsFunc) {
            return this.getDefaultActionsFunc(event);
        }
        return [];
    }

    public getVariables(message: any): any {
        let variables = {};
        if (this.parent) {
            variables = this.parent.getVariables(message);
        }
        if (this.getVariablesFunc) {
            Object.assign(variables, this.getVariablesFunc(message));
        }
        return variables;
    }
}
