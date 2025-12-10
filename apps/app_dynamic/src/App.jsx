import 'bootstrap/dist/css/bootstrap.min.css';

import { createGraphQLClient } from '@hrbolek/uoisfrontend-dynamic/';
import { useEffect, useState } from 'react';

const client = createGraphQLClient({
    endpoint: "/api/gql",
});

export const App = () => {
    const [sdl, setSdl] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        client
            .sdl()
            .then((data) => {
                if (cancelled) return;
                // data bude nejspíš { _service: { sdl: string } }
                setSdl(data?._service?.sdl ?? data);
                setLoading(false);
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return <div>Loading SDL…</div>;
    }

    if (error) {
        return <div>Error: {String(error.message ?? error)}</div>;
    }

    return (
        <div>
            <h1>Hello world changed</h1>
            <pre style={{ whiteSpace: "pre-wrap" }}>
                {sdl}
            </pre>
        </div>
    );
};