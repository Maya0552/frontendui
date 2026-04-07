import { useEffect, useState } from 'react'
import { Dialog } from './Dialog';
import { ChildWrapper } from '../ComponentManagement';

/**
 * ButtonWithDialog Component
 *
 * A reusable button component that opens a dialog when clicked. The dialog
 * allows gathering data and confirms the action with a callback on confirmation.
 * Supports controlled data changes through child components.
 *
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {string} [props.buttonLabel="Provést"] - The label displayed on the button.
 * @param {string} [props.dialogTitle="Potvrďte akci"] - The title displayed on the dialog.
 * @param {string} [props.oklabel="Ok"] - The label for the confirmation button in the dialog.
 * @param {string} [props.cancellabel="Zrušit"] - The label for the cancel button in the dialog.
 * @param {Function} props.onClick - Callback function executed on dialog confirmation. 
 *    Receives the updated state of the form data from the dialog.
 *    @param {Object} state - The current state object collected from the dialog's child components.
 * @param {Object} [props.params={}] - Initial state for tracking input changes from dialog children.
 * @param {React.ReactNode} props.children - Content inside the dialog for gathering data.
 * @param {Object} props - Additional props passed to the button element.
 *
 * @example
 * // Basic Usage Example
 * const Example = () => {
 *     const handleConfirm = () => alert("Action confirmed!");
 *
 *     return (
 *         <ButtonWithDialog
 *             buttonLabel="Open Dialog"
 *             dialogTitle="Are you sure?"
 *             oklabel="Confirm"
 *             cancellabel="Cancel"
 *             onClick={handleConfirm}
 *         >
 *             <p>Please confirm your action.</p>
 *         </ButtonWithDialog>
 *     );
 * };
 *
 * @example
 * // RequestTransitionButton Example
 * export const RequestTransitionButton = ({ request, transition, ...props }) => {
 *     const [mutationParams, setMutationParams] = useState({
 *         id: request.id,
 *         lastchange: request.lastchange,
 *         history_message: "",
 *         transition_id: transition.id,
 *     });
 *
 *     useEffect(() => {
 *         setMutationParams((prev) => ({
 *             ...prev,
 *             lastchange: request.lastchange,
 *             transition_id: transition.id,
 *         }));
 *     }, [request, transition]);
 *
 *     const onChange = (e) => {
 *         const { id, value } = e.target;
 *         setMutationParams((prev) => ({ ...prev, [id]: value }));
 *     };
 *
 *     const { fetch } = useAsyncAction(
 *         RequestUseTransitionAsyncAction,
 *         mutationParams,
 *         { deferred: true }
 *     );
 *
 *     const handleConfirm = () => fetch(mutationParams);
 *
 *     return (
 *         <ButtonWithDialog
 *             buttonLabel={`${transition?.name} (${transition?.target?.name})`}
 *             dialogTitle="Confirm Action"
 *             onClick={handleConfirm}
 *             {...props}
 *         >
 *             <input
 *                 id="history_message"
 *                 className="form-control"
 *                 defaultValue=""
 *                 onChange={onChange}
 *                 onBlur={onChange}
 *             />
 *         </ButtonWithDialog>
 *     );
 * };
 *
 * @example
 * // Encapsulation with AsyncClickHandler
 * const asyncAction = (params) => mockApiCall(params);
 *
 * const Example = () => {
 *     return (
 *         <AsyncClickHandler
 *             asyncAction={asyncAction}
 *             defaultParams={{ id: 1 }}
 *             loadingMsg="Processing..."
 *             onClick={(result) => console.log("Action completed:", result)}
 *         >
 *             <ButtonWithDialog
 *                 buttonLabel="Perform Action"
 *                 dialogTitle="Confirm Your Action"
 *                 oklabel="Submit"
 *                 cancellabel="Cancel"
 *                 params={{ id: 1, value: "Initial Value" }}
 *             >
 *                 <input id="value" className="form-control" placeholder="Enter Value" />
 *             </ButtonWithDialog>
 *         </AsyncClickHandler>
 *     );
 * };
 *
 * export default Example;
 *
 * @returns {JSX.Element} A button that opens a dialog with customizable content.
 */
export const ButtonWithDialog = ({
    buttonLabel = "Provést",
    dialogTitle = "Potvrďte akci",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    onClick,
    injectId=true,
    params = {},
    children,
    ...props
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [state, setState] = useState({});

    const handleButtonClick = (e) => {
        // e.stopPropagation()
        // e.nativeEvent.stopImmediatePropagation()
        setShowDialog(true); // Show the dialog when the button is clicked
    };

    const handleDialogOk = () => {
        const updatedState = {...params, ...state}
        if (injectId) updatedState.id = updatedState.id?updatedState.id:crypto.randomUUID()
        if (onClick) onClick(updatedState); // Pass the state to the callback
        setShowDialog(false); // Close the dialog
    };

    const handleDialogCancel = () => {
        setShowDialog(false); // Close the dialog without executing the callback
    };

    const onChildChange = (e) => {
        // console.log("ButtonWithDialog.onChildChange", state, e)
        const { id, value } = e.target;
        // setFirstRender(false)
        // console.log("ButtonWithDialog.onChildChange", state, id, value)
        setState((prev) => {
            // console.log("ButtonWithDialog.onChildChange", prev, e)
            console.log("ButtonWithDialog.onChildChange", state, id, value)
            if (!prev) return {[id]: value}
            return {
                ...prev,
                [id]: value
            }
        });
    };

    return (<>
        <span {...props} onClick={handleButtonClick}>
            {buttonLabel}
        </span>
        
        {showDialog && <Dialog
            title={dialogTitle}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onOk={handleDialogOk}
            onCancel={handleDialogCancel}
        >
            <ChildWrapper 
                onChange={onChildChange} 
                onBlur={onChildChange}
            >
                {children}
            </ChildWrapper>
        </Dialog>}
    </>);
};
