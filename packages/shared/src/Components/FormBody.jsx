import React, { useEffect, useState } from 'react'
import { Label } from "./Label";
import { CreateDelayer } from './CreateDelayer';
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared';

/**
 * A flexible React component for managing form inputs, supporting both single-object forms and array-based forms.
 * It also integrates optional asynchronous server updates for handling changes with delayed fetches.
 *
 * `FormBody` dynamically adapts its behavior based on the type of `defaultValue`. 
 * If `defaultValue` is an object, it operates as a single form. If it's an array, it processes a vector of objects 
 * using a single reusable child component. The component also supports server updates using an `asyncAction`.
 *
 * @function FormBody
 * @param {Object} props - The properties for the FormBody component.
 * @param {string} [props.id="form"] - The unique identifier for the form or vector.
 * @param {string} [props.label=""] - Optional label for the form section or card.
 * @param {Object|Array<Object>} [props.defaultValue={}] - The initial state of the form, as an object or array of objects.
 * @param {React.ReactNode} props.children - The child components to be managed. For arrays, only one child is allowed.
 * @param {Function} [props.onChange=(e) => null] - Callback invoked when any child element's value changes.
 * @param {Function} [props.onBlur=(e) => null] - Callback invoked when any child element loses focus.
 * @param {Function|null} [props.asyncAction=null] - Optional async function for server updates triggered on change or blur.
 * @param {Function} [props.transformToQuery=(e) => e.target.value] - Transformation function to shape data for the asyncAction.
 * @param {any} [props.shouldFetch=null] - A condition that triggers server-side fetching if `asyncAction` is set.
 * @param {Object} props.rest - Additional props passed to all child components.
 *
 * @throws {Error} If `asyncAction` is used with an array-based `defaultValue`, or if `shouldFetch` is misconfigured.
 * @throws {Error} If `defaultValue` is neither an object nor an array, or if multiple children are passed for array processing.
 *
 * @returns {JSX.Element} A dynamically managed wrapper for form inputs, adapting based on the type of `defaultValue`.
 *
 * @example
 * // Example usage as a single form with server update:
 * const MyForm = () => {
 *   const handleChange = (e) => console.log("Form updated:", e.target.value);
 *   const defaultValue = { name: "John", email: "john@example.com" };
 * 
 *   return (
 *     <FormBody
 *       defaultValue={defaultValue}
 *       asyncAction={myAsyncAction}
 *       onChange={handleChange}
 *     >
 *       <Input id="name" label="Name" />
 *       <Input id="email" label="Email" />
 *     </FormBody>
 *   );
 * };
 *
 * @example
 * // Example usage as a vector form:
 * const MyVectorForm = () => {
 *   const handleVectorChange = (e) => console.log("Vector updated:", e.target.value);
 *   const defaultValue = [
 *     { id: "item1", name: "Item 1", quantity: 10 },
 *     { id: "item2", name: "Item 2", quantity: 20 },
 *   ];
 *
 *   return (
 *     <FormBody id="items" defaultValue={defaultValue} onChange={handleVectorChange}>
 *       <Input id="name" label="Name" />
 *     </FormBody>
 *   );
 * };
 *
 * @example
 * // Example usage with server-side updates:
 * const ServerForm = () => {
 *   const handleAsyncAction = async (data) => {
 *     console.log("Updating server with:", data);
 *     return await apiCall(data); // Simulated API call
 *   };
 *
 *   const defaultValue = { name: "Jane", age: 30 };
 *
 *   return (
 *     <FormBody
 *       defaultValue={defaultValue}
 *       asyncAction={handleAsyncAction}
 *       shouldFetch={true}
 *       onChange={(e) => console.log("Updated value:", e.target.value)}
 *     >
 *       <Input id="name" label="Name" />
 *       <Input id="age" label="Age" />
 *     </FormBody>
 *   );
 * };
 */
export const FormBody = ({
    id = "form",
    label,
    defaultValue = {},
    children,
    onChange = (e) => null,
    onBlur = (e) => null,
    asyncAction = null, // Optional async action for server updates
    transformToQuery = (e) => e.target.value, // Transformation function for queries
    shouldFetch = null, // Triggers fetch when provided and asyncAction is set    
    ...props
}) => {
    // Ensure `asyncAction` is not used with array-type `defaultValue`
    const isVector = Array.isArray(defaultValue);
    if (isVector && asyncAction) {
        throw new Error("asyncAction cannot be used when defaultValue is an array.");
    }
    
    // Memoized to prevent change completely
    const [_asyncAction] = useState(() => asyncAction)
    let [currentValue, setCurrentValue] = [defaultValue, (newValue)=>null]
    if (_asyncAction) {
        [currentValue, setCurrentValue] = useState(defaultValue)
    }
    defaultValue = currentValue
    // to delay server calls (mutations)
    const [delayer] = useState(() => CreateDelayer())
    const { 
        fetch = async(data)=>data, 
        entity = defaultValue, 
        loading = false, 
        error = null 
    } = (_asyncAction && useAsyncAction(_asyncAction, defaultValue, { deferred: true })) || {};
    // } = {};
    
    // Ensure `shouldFetch` validity
    if (asyncAction && shouldFetch === null) {
        throw new Error("shouldFetch must be provided when asyncAction is set.");
    }
    if (!asyncAction && shouldFetch !== null) {
        throw new Error("shouldFetch must be null when asyncAction is not provided.");
    }    

    // useEffect(()=>{
    //     if (!_asyncAction) return
    //     fetch(defaultValue)
    // },[shouldFetch])

    const handleAllObject = async(e) => {
        const value = e.target.value;
        const name = e.target.id;

        // Update the object state
        const updatedObject = { ...defaultValue, [name]: value };

        // Create a structured event object
        const result = { target: { id, value: updatedObject } };

        
        const writeToServer = async(e) => {
            const newValue = transformToQuery(e)
            if (_asyncAction) console.log("preserver newValue", newValue)
            
            const serverVersion = await fetch(newValue)
            if (serverVersion) setCurrentValue(prev => serverVersion)
            if (_asyncAction) console.log("postserver newValue", serverVersion)
            
            return serverVersion
        }
        const serverResult = await delayer(() => writeToServer(result))
        // console.log("postserver newValue", serverResult)
        if (serverResult) result.target.value = serverResult
        
        return result;
    };

    const handleAllArray = (index, e) => {
        console.log("handleAllArray", e)
        const target = e?.target
        // if (!target) return 
        const value = target.value;
        const name = target.id;

        // Update the array state
        const updatedVector = [...defaultValue];
        updatedVector[index] = { ...updatedVector[index], [name]: value };

        // Create a structured event object
        const result = { target: { id, value: updatedVector } };
        return result;
    };

    const handleChange = (index = null) => async(e) => {
        if (Array.isArray(defaultValue)) {
            const result = handleAllArray(index, e)
            onChange(result);
        } else {
            const {id: name, value} = e.target
            const updatedValueStr = JSON.stringify(value)
            const defaultValueStr = JSON.stringify(defaultValue[name])
            // console.log("formBody.handleChange.updatedValueStr", updatedValueStr)
            // console.log("formBody.handleChange.defaultValueStr", defaultValueStr)
            if (updatedValueStr === defaultValueStr)
                return
            else
                handleAllObject(e).then(onChange)
        }
    };

    const handleBlur = (index = null) => (e) => {
        if (Array.isArray(defaultValue)) {
            const result = handleAllArray(index, e)
            onBlur(result);
        } else {
            const {id: name, value} = e.target
            const updatedValueStr = JSON.stringify(value)
            const defaultValueStr = JSON.stringify(defaultValue[name])
            // console.log("formBody.handleBlur.updatedValueStr", name, value)
            // console.log("formBody.handleBlur.updatedValueStr", updatedValueStr)
            // console.log("formBody.handleBlur.defaultValueStr", defaultValueStr)
            if (updatedValueStr === defaultValueStr)
                return
            else
                handleAllObject(e).then(onBlur)
        }
    };
    const Visualiser = label?Label:"div"
    // Process children for Object (defaultValue is an object)
    if (!Array.isArray(defaultValue)) {
        return (
            <Visualiser title={label}>
                {children &&
                    React.Children.map(children, (child) =>
                        cloneWithHandlers(child, defaultValue, props, handleChange(), handleBlur())
                    )}
            </Visualiser>
        );
    }

    // Process children for Array (defaultValue is an array)
    if (Array.isArray(defaultValue)) {
        let singleChild;

        // Validate that there's only one child for vector processing
        React.Children.forEach(children, (child, index) => {
            if (index > 0) throw new Error("Only one child is allowed for vector processing.");
            if (React.isValidElement(child)) {
                singleChild = child;
            } else {
                throw new Error("Only valid React elements are allowed as children.");
            }
        });

        const childrenArray = defaultValue.map((item, index) =>
        <div key={item.id}>
            {cloneWithHandlers(
                singleChild,
                item,
                props,
                handleChange(index),
                handleBlur(index)
            )}
        </div>
        );

        return <Visualiser title={label}>{childrenArray}</Visualiser>;
    }

    throw new Error("Invalid defaultValue: Must be either an object or an array.");
};


/**
 * Clones a React child element with additional props and handlers, ensuring no critical properties are overwritten.
 *
 * This function validates that no properties from the `props` object conflict with the existing properties in the
 * child's `props`. If a conflict is detected, it throws an error. It also injects updated `defaultValue`, `onChange`,
 * and `onBlur` handlers into the cloned element.
 *
 * @function cloneWithHandlers
 * @param {React.ReactElement} child - The React child element to be cloned.
 * @param {Object} defaultValue - The default values for form elements, keyed by their `id`.
 * @param {Object} props - Additional props to inject into the child element. Must not include conflicting properties.
 * @param {Function} handleChange - The parent form's `onChange` handler to be injected into the child.
 * @param {Function} handleBlur - The parent form's `onBlur` handler to be injected into the child.
 *
 * @throws {Error} If any property in `props` conflicts with an existing property in `child.props`, including `children`.
 *
 * @returns {React.ReactElement|*} The cloned child element with injected props and handlers, or the original child if it is not a valid React element.
 *
 * @example
 * // Example usage within a FormBody component:
 * const handleChange = (e) => console.log(e.target.value);
 * const handleBlur = (e) => console.log("Blurred:", e.target.value);
 * const defaultValue = { username: "JohnDoe" };
 * 
 * const children = (
 *   <Input id="username" label="Username" />
 * );
 * 
 * const clonedChild = cloneWithHandlers(
 *   children,
 *   defaultValue,
 *   { className: "form-control" },
 *   handleChange,
 *   handleBlur
 * );
 *
 * @example
 * // Invalid usage (throws error):
 * const children = (
 *   <Input id="username" label="Username" children={<span>Invalid</span>} />
 * );
 * 
 * const clonedChild = cloneWithHandlers(
 *   children,
 *   defaultValue,
 *   { children: <span>Overwritten</span> }, // Throws error
 *   handleChange,
 *   handleBlur
 * );
 */
const cloneWithHandlers = (child, defaultValue, props, handleChange, handleBlur) => {
    if (!React.isValidElement(child)) {
        return child;
    }

    const { id, defaultValue: childDefaultValue } = child.props;
    const entityValue = defaultValue[id] || childDefaultValue;

    // Check for property overwrites in `props`
    const conflictingKeys = Object.keys(props).filter((key) => key in child.props);
    if (conflictingKeys.length > 0) {
        throw new Error(
            `Invalid usage: The following properties are being overwritten in the cloned element: ${conflictingKeys.join(
                ', '
            )}`
        );
    }

    return React.cloneElement(child, {
        ...child.props, // Original child props
        ...props,       // Props passed to `cloneWithHandlers`
        defaultValue: entityValue, // Updated default value
        ref: child.ref,            // Preserve original ref
        onChange: handleChange,    // Inject parent's onChange handler
        onBlur: handleBlur,        // Inject parent's onBlur handler
    });
};
