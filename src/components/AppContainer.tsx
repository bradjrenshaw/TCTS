import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProfilePanel from "./ProfilePanel";
import ProfileView from "./ProfileView";
import OutputServicesPanel from "./OutputServicesPanel";
import Profile from "../Profile";
import TabManagerContext from "../contexts/TabManagerContext";
import UniqueItemList from "../UniqueItemList";
import { useDataContext } from "../contexts/DataContext";
import DataManager from "../DataManager";
import UniqueItemListEvent from "../events/UniqueItemListEvent";

const AppContainer = () => {
    let data: DataManager = useDataContext();
    let [profileTabs, setProfileTabs] = useState<Array<Profile>>([]);
    let [profiles, setProfiles] = useState<Array<Profile>>([...data.profiles]);
    let [tabManager, setTabManager] = useState<UniqueItemList<Profile>>(
        new UniqueItemList(profileTabs, false)
    );

        const handleProfilesChange = (event: UniqueItemListEvent<Profile>) => {
            setProfiles([...data.profiles]);
                                };

                                const handleProfilesRemove = (event: UniqueItemListEvent<Profile>) => {
                                    //Ensure that a tab is removed when a profile is deleted
                                    //todo: make sure a profile also disconnects
                                    const profile = event.items[0];
                                    tabManager.remove(profile);
                                };

                                const handleProfilesReplace = (event: UniqueItemListEvent<Profile>) => {
                                    const [oldItem, newItem ] = event.items;
                                    tabManager.replace(oldItem, newItem);
                                };

                                const handleTabManagerChange = (event: UniqueItemListEvent<Profile>) => {
                                    setProfileTabs([...tabManager]);
                                };

        useEffect(() => {
            //Typescript is being overly restrictive here
            tabManager.addEventListener("change", handleTabManagerChange as EventListener);
            data.profiles.addEventListener("change", handleProfilesChange as EventListener);
            data.profiles.addEventListener("replace", handleProfilesReplace as EventListener);
            data.profiles.addEventListener("remove", handleProfilesRemove as EventListener);

            return () => {
                tabManager.removeEventListener("change", handleTabManagerChange as EventListener);
                data.profiles.removeEventListener("change", handleProfilesChange as EventListener);
                data.profiles.removeEventListener("remove", handleProfilesRemove as EventListener);
                data.profiles.removeEventListener("replace", handleProfilesReplace as EventListener);
            }
        });

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
                    <ProfilePanel profiles={profiles} />
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
