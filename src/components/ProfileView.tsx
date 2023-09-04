import { useState } from "react";
import Profile from "../Profile";
import Modal from "./Modal";
import ProfileSettings from "./ProfileSettings";
import DataManager from "../DataManager";
import { useDataContext } from "../contexts/DataContext";

enum Action {
    View,
    Settings
};

const ProfileView = ({ profile}: { profile: Profile}) => {
    let data: DataManager = useDataContext();
    let [ action, setAction ] = useState<Action>(Action.View);

    const handleProfileCancel = () => {
        setAction(Action.View);
    };

    const handleProfileSave = (replacement: Profile) => {
        const changeProfile = async () => {
            let reconnect: boolean = false;
            if (profile.chatService) {
                if (profile.chatService.isConnected()) {
                    await profile.chatService.disconnect();
                    reconnect = true;
                }
            }
            data.profiles.replace(profile, replacement);
            if (replacement.chatService && reconnect) {
                await replacement.chatService.connect();
            }
            setAction(Action.View);
        };
        changeProfile();
    };
    
    const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAction(Action.Settings);
    };

    if (action === Action.View) {
    return (
        <>
            <h1>{profile.name}</h1>
            <button onClick={handleSettingsClick}>Settings</button>
        </>
    );
    } else if (action === Action.Settings) {
        return <Modal visible onClose={handleProfileCancel}>
<ProfileSettings editing originalProfile={profile} onCancel={handleProfileCancel} onConfirm={handleProfileSave} />
</Modal>
    }
};

export default ProfileView;
