import { useState } from 'react'
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared';
import { LoadingSpinner, ErrorHandler, ButtonWithDialog, SimpleCardCapsule, AsyncClickHandler } from '@hrbolek/uoisfrontend-shared';
import { RequestInsertAsyncAction } from './Queries/RequestInsertAsyncAction';
import { RequestMediumEditableContent } from './RequestMediumEditableContent';

export const InsertRequestButton = ({ 
    request, 
    confirmationDialog=true, 
    onAdd = (newRequest) => null, 
    dialogTitle="Nový požadavek",
    className='btn btn-outline-primary form-control',
    children, 
    ...props 
}) => {
    // const { fetch, error, loading } = useAsyncAction(RequestInsertAsyncAction, {...request}, { deferred: true });
    // const [state, setState] = useState({
    //     name: "Nový požadavek",
    //     name_en: "New request",
    //     ...request,
    // })
    // const onConfirmCreate = async () => {
    //     const id = crypto.randomUUID()
    //     const newRequest = await fetch({...state, id});
    //     onAdd(newRequest);
    // };
    // const onChange = (e) => {
    //     const name = e.target.id
    //     const value = e.target.value
    //     const newState = {
    //         ...state,
    //         [name]: value
    //     }
    //     setState(prev => newState)
    // }
    return (
        <AsyncClickHandler
            asyncAction={RequestInsertAsyncAction}
            defaultParams={request}
            loadingMsg='Vytvářím nový požadavek'
            onClick={onAdd}
        >
            <ButtonWithDialog
                dialogTitle={dialogTitle}
                buttonLabel={children}
                className={className}
                {...props}
                params={request}
            >
                <RequestMediumEditableContent state={request} />
            </ButtonWithDialog>                
        </AsyncClickHandler>
        // <>

        //     {loading && <LoadingSpinner text='Vytvářím' />}
        //     {error && <ErrorHandler errors={error} />}
        //     {!confirmationDialog && <span {...props} onClick={onClick}>{children}</span>}
        //     {confirmationDialog &&
        //         <ButtonWithDialog
        //             dialogTitle={dialogTitle}
        //             buttonLabel={children}
        //             className={className}
        //             {...props}
        //             onClick={onConfirmCreate}
        //         >
        //             <SimpleCardCapsule title={"Název požadavku"}>
        //                 <input id="name" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={state.name} />
        //             </SimpleCardCapsule>
        //             <SimpleCardCapsule title={"Anglický název"}>
        //                 <input id="name_en" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={state.name_en} />
        //             </SimpleCardCapsule>
        //         </ButtonWithDialog>
        //     }
        // </>
    );
};
