import { useEffect, useState } from 'react';
const useRefreshTrigger = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        setRefreshTrigger(Date.now());
    }, []);

    return refreshTrigger;
};

export default useRefreshTrigger;