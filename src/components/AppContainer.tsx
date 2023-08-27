import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProfilePanel from "./ProfilePanel";
import ProfileView from "./ProfileView";
import OutputServicesPanel from "./OutputServicesPanel";
import Profile from "../Profile";
import TabManagerContext from "../contexts/TabManagerContext";
import UniqueItemList from "../UniqueItemList";

const AppContainer = () => {
    let [profileTabs, setProfileTabs] = useState<Array<Profile>>([]);

    let [tabManager, setTabManager] = useState<UniqueItemList<Profile>>(
        new UniqueItemList(profileTabs, false, (profiles: Array<Profile>) => {
            setProfileTabs(profiles);
        }),
    );

    return <>
        <TabManagerContext.Provider value={tabManager}>
            <Tabs>
                <TabList>
                    <Tab>main</Tab>
                    {profileTabs.map((profile: Profile) => (
                        <Tab key={profile.name}>{profile.name}</Tab>
                    ))}
                </TabList>
                <TabPanel>
                    <h1>Profiles</h1>
                    <ProfilePanel />
                    <br />
                    <h1>Output Services</h1>
                    <OutputServicesPanel />
                </TabPanel>
                {profileTabs.map((profile: Profile) => (
                    <TabPanel key={profile.name}>
                        <ProfileView key={profile.name} profile={profile} />
                    </TabPanel>
                ))}
            </Tabs>
        </TabManagerContext.Provider>
    </>
};

export default AppContainer;
