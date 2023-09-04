import { useState } from "react";
import Profile from "../Profile";
import ProfileSettings from "./ProfileSettings";
import { useDataContext } from "../contexts/DataContext";
import Modal from "./Modal";
import ChatServiceConnectDisconnectButton from "./ChatServiceConnectDisconnectButton";
import DataManager from "../DataManager";

enum Action {
    List,
    Add,
    Edit,
    Delete,
}

const ProfileRow = ({
    profile,
    onAction,
}: {
    profile: Profile;
    onAction: any;
}) => {
    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onAction(Action.Delete, profile);
    };
    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onAction(Action.Edit, profile);
    };
    return (
        <tr>
            <td>{profile.name}</td>
            <td>
                <button onClick={handleEditClick}>Edit</button>
            </td>
            <td>
                <ChatServiceConnectDisconnectButton
                    service={profile.chatService}
                />
            </td>
            <td>
                <button onClick={handleDeleteClick}>Delete</button>
            </td>
        </tr>
    );
};

const ProfileList = ({
    profiles,
    onAction,
}: {
    profiles: Array<Profile>;
    onAction: any;
}) => {
    let dataManager: DataManager = useDataContext();
    let onAddClick = () => {
        let profile: Profile = new Profile(dataManager);
        onAction(Action.Add, profile);
    };
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>name</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((p: Profile) => (
                        <ProfileRow
                            profile={p}
                            key={p.name}
                            onAction={onAction}
                        />
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <button onClick={onAddClick}>Add</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const ProfilePanel = ({profiles}: {profiles: Array<Profile>}) => {
    let data: DataManager = useDataContext();
    let [action, setAction] = useState(Action.List);
    let [actionProfile, setActionProfile] = useState<Profile | null>(null);

    const handleNewProfileSave = (profile: Profile) => {
        data.addProfile(profile);
        data.saveData();
        setAction(Action.List);
    };

    const handleEditProfileSave = (profile: Profile) => {
        if (!actionProfile) return;
        data.replaceProfile(actionProfile, profile);
        data.saveData();
        setAction(Action.List);
    };

    const onAction = (action: Action, target: Profile) => {
        if (action === Action.Add) {
            setAction(Action.Add);
            setActionProfile(target);
        } else if (action === Action.Edit) {
            setAction(Action.Edit);
            setActionProfile(target);
        } else if (action === Action.Delete) {
            data.removeProfile(target);
            data.saveData();
            setActionProfile(null);
            setAction(Action.List);
        }
    };

    const handleCancel = (event: Event) => {
        setAction(Action.List);
    };

    if (action === Action.List) {
        return (
            <div>
                <ProfileList profiles={profiles} onAction={onAction} />
            </div>
        );
    } else if (action === Action.Add) {
        return (
            <Modal visible onClose={handleCancel}>
                {actionProfile ? (
                    <ProfileSettings
                        originalProfile={actionProfile}
                        onConfirm={handleNewProfileSave}
                        onCancel={handleCancel}
                    />
                ) : (
                    <></>
                )}
            </Modal>
        );
    } else if (action === Action.Edit) {
        return (
            <Modal visible onClose={handleCancel}>
                {actionProfile ? (
                    <ProfileSettings
                        editing
                        originalProfile={actionProfile}
                        onConfirm={handleEditProfileSave}
                        onCancel={handleCancel}
                    />
                ) : (
                    <></>
                )}
            </Modal>
        );
    } else {
        return <p>Deleting</p>;
    }
};

export default ProfilePanel;
