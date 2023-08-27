import Profile from "../Profile";

const ProfileTab = ({ profile }: { profile: Profile }) => {
    return (
        <div>
            <h1>{profile.name}</h1>
            <button>Settings</button>
        </div>
    );
};

export default ProfileTab;
