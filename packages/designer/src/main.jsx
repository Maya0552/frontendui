import React, { useState } from "react";
import QueryReadDesigner from "./QueryReadDesigner.jsx";
import introspection from "./introspectionresult.json";

export default function Page() {
    const [queryString, setQueryString] = useState("");

    return (
        <div>
            <QueryReadDesigner
                introspection={introspection}
                initialRootField="" // třeba "user"
                onChange={({ queryString }) => setQueryString(queryString)}
            />

            <div style={{ marginTop: 16 }}>
                <h3>Preview consumer component</h3>
                {/* sem dosadíš komponentu, kterou designer “krmí” query */}
                <YourComponent query={queryString} />
            </div>
        </div>
    );
}
