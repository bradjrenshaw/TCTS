//import { useState } from "react";
import Profile from "../Profile";

/*enum Action {
    View,
    Settings
};*/

const ProfileView = ({profile}: {profile: Profile}) => {
    //let [ action, setAction ] = useState<Action>(Action.View);

    return <>
    <h1>{profile.name}</h1>
    <button>Settings</button>
    </>;
};

export default ProfileView;