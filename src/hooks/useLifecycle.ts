import { useEffect, useState } from "react";

type LifecycleFunction = () => void;

const useLifecycle = (
    onMount: LifecycleFunction,
    onDismount: LifecycleFunction | undefined = undefined,
) => {
    let [guard, setGuard] = useState(false);
    useEffect(() => {
        if (guard) return;
        onMount();
        setGuard(true);
        return onDismount;
    }, [guard, onDismount, onMount]);
};

export default useLifecycle;
