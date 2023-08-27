import { createContext, useContext } from "react";
import DataManager from "../DataManager";

export let DataContext = createContext<DataManager | null>(null);

export let useDataContext = (): DataManager => {
    let context = useContext<DataManager | null>(DataContext);
    if (!context) {
        throw new Error(
            "Cannot use DataContext outside of a context provider.",
        );
    }
    return context;
};
