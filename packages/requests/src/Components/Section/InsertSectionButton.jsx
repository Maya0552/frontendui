import { useState } from 'react'
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared';
import { LoadingSpinner, ErrorHandler, ButtonWithDialog, SimpleCardCapsule } from '@hrbolek/uoisfrontend-shared';
import { SectionInsertAsyncAction } from './Queries/SectionInsertAsyncAction';

export const InsertSectionButton = ({ 
    params, 
    confirmationDialog=true, 
    onDone = () => null, 
    dialogTitle="Nová sekce",
    className='btn btn-outline-primary form-control',
    children, 
    ...props 
}) => {
    const { fetch, error, loading } = useAsyncAction(SectionInsertAsyncAction, {...params}, { deferred: true });
    const [state, setState] = useState({
        id: crypto.randomUUID(),
        name: "Nová sekce",
        name_en: "New section",
        ...params,
    })
    const onConfirmCreate = async () => {
        await fetch(state);
        onDone(state);
    };
    const onChange = (e) => {
        const name = e.target.id
        const value = e.target.value
        const newState = {
            ...state,
            [name]: value
        }
        setState(prev => newState)
    }
    return (
        <>
            {loading && <LoadingSpinner text='Vytvářím' />}
            {error && <ErrorHandler errors={error} />}
            {!confirmationDialog && <span {...props} onClick={onConfirmCreate}>{children}</span>}
            {confirmationDialog &&
                <ButtonWithDialog
                    dialogTitle={dialogTitle}
                    buttonLabel={children}
                    className={className}
                    {...props}
                    onClick={onConfirmCreate}
                >
                    <SimpleCardCapsule title={"Název sekce"}>
                        <input id="name" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={state.name} />
                    </SimpleCardCapsule>
                    <SimpleCardCapsule title={"Anglický název"}>
                        <input id="name_en" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={state.name_en} />
                    </SimpleCardCapsule>
                </ButtonWithDialog>
            }
        </>
    );
};
