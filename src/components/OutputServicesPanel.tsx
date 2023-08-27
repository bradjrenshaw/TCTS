import { useState } from "react";
import { useDataContext } from "../contexts/DataContext";
import DataManager from "../DataManager";
import OutputService from "../outputServices/outputService";
import Modal from "./Modal";
import OutputServiceSettings from "./OutputServiceSettings";

enum Action {
    List,
    Add,
    Edit,
    Delete
};

type onActionType = (action: Action, service: OutputService) => void;

const OutputServiceRow = ({service, onAction}: {service: OutputService, onAction: onActionType}) => {
    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
        onAction(Action.Delete, service);
    }

    const handleEditClick = (event: React.MouseEvent<HTMLElement>) => {
        onAction(Action.Edit, service);
    };

    return <tr>
        <td>{service.name}</td>
        <td><button onClick={handleEditClick}>Edit</button></td>
        <td><button onClick={handleDeleteClick}>Delete</button></td>
    </tr>;
}

const OutputServicesList = ({outputServices, onAction}: {outputServices: Array<OutputService>, onAction: onActionType}) => {
    let data: DataManager = useDataContext();
    
    const handleAddClick = (event: React.MouseEvent<HTMLElement>) => {
        let service: OutputService = new OutputService(data);
        onAction(Action.Add, service);
    };
    
    return <table>
        <thead>
            <tr>
        <th>Name</th>
        </tr>
                </thead>
                <tbody>
                    {outputServices.map((service: OutputService) => <OutputServiceRow key={service.name} service={service} onAction={onAction} />)}
                    <tr>
                        <td><button onClick={handleAddClick}>Add</button></td>
                        </tr>
                </tbody>
    </table>
};

const OutputServicesPanel = () => {
    let data = useDataContext();
    let [ services, setServices] = useState<Array<OutputService>>(data.outputServices.items);
    let [ action, setAction ] = useState<Action>(Action.List);
    let [ actionService, setActionService ] = useState<OutputService | null>(null);

    const onAction = (action: Action, target: OutputService) => {
        if (action === Action.Add) {
            setAction(Action.Add);
            setActionService(target);
        } else if (action === Action.Edit) {
            setAction(Action.Edit);
            setActionService(target);
        } else if (action === Action.Delete) {
            data.removeOutputService(target);
            data.saveData();
            setServices([...data.outputServices]);
            setAction(Action.List);
            setActionService(null);
        }
    };

    const handleClose = (event: Event) => {
        setAction(Action.List);
    };

    const handleCancel = (service: OutputService) => {
        setAction(Action.List);
    };

    const handleEditConfirm = (service: OutputService) => {
        if (!actionService) return;
                if (!data.replaceOutputService(actionService, service)) {
            throw new Error("Error replacing output service when editing service " + actionService.name + ".");
        }
        data.saveData();
        setAction(Action.List);
        setServices([...data.outputServices]);
    };

    const handleNewServiceConfirm = (service: OutputService) => {
        data.addOutputService(service);
        data.saveData();
        setServices([...data.outputServices]);
        setAction(Action.List);
    };

    if (action === Action.List) {
        return <OutputServicesList outputServices={services} onAction={onAction} />
    } else if (action === Action.Add) {
        return <Modal visible onClose={handleClose}>
            {actionService ? <OutputServiceSettings onCancel={handleCancel} onConfirm = {handleNewServiceConfirm} originalService={actionService} /> : <> </>}
        </Modal>
    } else if (action === Action.Edit) {
        return <Modal visible onClose={handleClose}>
            {actionService ? <OutputServiceSettings editing onCancel={handleCancel} onConfirm = {handleEditConfirm} originalService={actionService} /> : <> </>}
        </Modal>
    } else {
        return <p>Deleting</p>;
    }
};

export default OutputServicesPanel;