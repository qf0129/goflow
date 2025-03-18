import { useState, useRef, useEffect } from 'react';

export default (initState: any) => {
    const stateRef = useRef(null as any);
    const [state, setState] = useState(initState);

    useEffect(() => {
        stateRef.current && stateRef.current(state);
    }, [state]);

    return [
        state,
        (newState: typeof initState): Promise<typeof initState> =>
            new Promise(rel => { stateRef.current = rel; setState(newState) })
    ];
}
