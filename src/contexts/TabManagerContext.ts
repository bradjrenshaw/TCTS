import { createContext } from "react";
import Profile from "../Profile";
import UniqueItemList from "../UniqueItemList";

export default createContext<UniqueItemList<Profile>>(
    {} as UniqueItemList<Profile>,
);
