import { useState, useMemo, useCallback } from 'react'

import { CreateDelayer } from './CreateDelayer'

/**
 * shared module.
 * @module shared/components
 */

/**
 * A controlled text input component with debounced onChange handling.
 * 
 * @param {Function} onChange - Callback to handle input changes.
 * @param {string} [type="text"] - Input type (e.g., "text", "password").
 * @param {string} value - The input's current value.
 * @param {Object} props - Additional props passed to the input element.
 * @returns {JSX.Element} A debounced text input field.
 */
export const TextInput = ({ onChange, type = "text", value, ...props }) => {
    const [localValue, setLocalValue] = useState(value);
    const delayer = useCallback(CreateDelayer(), []); // Initialize delayer once

    // Handle local input value change
    const localOnChange = useCallback(
        (e) => {
            const newValue = e.target.value;
            setLocalValue(newValue); // Update local state
            if (onChange) {
                delayer(() => onChange(newValue)); // Debounced onChange
            }
        },
        [onChange, delayer]
    );

    // Handle blur event to ensure the latest value is sent to onChange
    const onBlur = useCallback(
        (e) => {
            const newValue = e.target.value;
            if (newValue !== localValue) {
                onChange?.(newValue); // Ensure onChange is called if value changes
            }
        },
        [onChange, localValue]
    );

    return (
        <input
            className="form-control"
            {...props}
            type={type}
            value={localValue}
            onChange={localOnChange}
            onBlur={onBlur}
        />
    );
};