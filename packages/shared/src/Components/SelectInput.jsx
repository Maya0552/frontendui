import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

/**
 * shared module.
 * @module shared/components
 */


/**
 * A `SelectInput` component that fetches options asynchronously and displays them in a dropdown.
 * Automatically detects the key in `json.data` and uses its value.
 *
 * @param {Object} props - The properties for the SelectInput component.
 * @param {function} props.FetchAsyncAction - The async action to fetch data for the dropdown.
 * @param {number} [props.skip=0] - The number of records to skip during fetch.
 * @param {number} [props.limit=100] - The maximum number of records to fetch.
 * @param {Object|null} [props.where=null] - The optional filter to apply during fetch.
 * @param {function} props.onChange - The callback function invoked when the dropdown value changes.
 * @param {Object} props.selectProps - Additional props to pass to the `<select>` element.
 *
 * @returns {JSX.Element} A dropdown `<select>` element with fetched options.
 */
export const SelectInput = ({
    FetchAsyncAction,
    skip = 0,
    limit = 100,
    where = null,
    onChange,
    ...selectProps
}) => {
    const [results, setResults] = useState([]); // State to store fetched options
    const dispatch = useDispatch();

    const handleChange = (event) => {
        event.preventDefault();
        const value = event.target.value;

        if (onChange) {
            onChange(value);
        } else {
            console.error("Missing onChange handler (SelectInput)");
        }
    };

    // Fetch data when component mounts or dependencies change
    useEffect(() => {
        const fetchData = async () => {
            try {
                const json = await dispatch(FetchAsyncAction({ skip, limit, where }));
                const data = json?.data;

                if (data && typeof data === "object" && Object.keys(data).length === 1) {
                    const key = Object.keys(data)[0]; // Get the single key in `json.data`
                    setResults(data[key]); // Use the value of the key as the results
                } else {
                    console.warn("Expected `json.data` to have exactly one key.");
                }
            } catch (error) {
                console.error("Error fetching data in SelectInput:", error);
            }
        };

        fetchData();
    }, [FetchAsyncAction, dispatch, skip, limit, where]);

    return (
        <select className="form-select" onChange={handleChange} {...selectProps}>
            {results.map((item) => (
                <option key={item.id} value={item.id}>
                    {item?.fullname || item?.name || "???Chyba???"}
                </option>
            ))}
        </select>
    );
};
