import { useState } from 'react'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { AsyncClickHandler, ButtonWithDialog, ErrorHandler, Input, LoadingSpinner, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { FormInsertAsyncAction } from "./Queries/FormInsertAsyncAction"
import { FormMediumEditableContent } from './FormMediumEditableContent';


export const CreateFormButton = ({ children, form, onDone = (state) => null, ...props }) => {
    // console.log(`UpdateStateButton.state`, state)
    const handleClick = (newForm) => {
        // console.log(`UpdateStateButton.state`, state)
        onDone(newForm)
    }
    return (
        <AsyncClickHandler
            asyncAction={FormInsertAsyncAction}
            defaultParams={form}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Vytvořit formulář" {...props} params={form}>
                <FormMediumEditableContent form={form} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};




export const FormCreateButtonDialog = ({onCreate=()=>null, ...props}) => {
    const state = useAsyncAction(FormInsertAsyncAction, {}, {deferred: true})
    const { fetch, loading, error, dispatchResult } = state
    // console.log("RequestCategoryCreateButton got state", state)
    const [{form_id, section_id, part_id, item_id}] = useState({
        form_id: crypto.randomUUID(),
        section_id: crypto.randomUUID(),
        part_id: crypto.randomUUID(),
        item_id: crypto.randomUUID()
    })
    const [inputValues, setInputValues] = useState({
        name: "Nový vzor",
        name_en: "New template",
        id: form_id,
        sections: [
            {
                id: section_id,
                formId: form_id,
                name: "sekce",
                parts: [
                    {
                        id: part_id,
                        sectionId: section_id,
                        name: "část",
                        items: [
                            {
                                id: item_id,
                                partId: part_id,
                                name: "položka",
                                typeId: "9bdb9476-afb6-11ed-9bd8-0242ac110002"
                            }
                        ]
                    }
                ]
            }
        ]
    }) 

    const onChange = (e) => {
        const name = e.target.id
        const value = e.target.value
        setInputValues(prev => ({...prev, [name]: value}))
    }

    const onConfirmCreate = async() => {
        const gotForm = await fetch({...inputValues})
        // const gotForm = fetchResult?.data?.result
        console.log("new template form", gotForm)
        onCreate(gotForm)
    }

    return (<>
        {/* {"error " + error?JSON.stringify(error):""}< br/> */}
        {/* {"error keys " + error?JSON.stringify(Object.keys(error)):""}< br/> */}
        {/* {JSON.stringify(dispatchResult)} <br /> */}
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text='Ukládám' />}

        <ButtonWithDialog
            dialogTitle="Vzorový formulář"
            buttonLabel='Vytvořit vzorový formulář'
            className='btn btn-outline-primary form-control'
            {...props}
            onClick={onConfirmCreate}
        >
            <SimpleCardCapsule title={"Název formuláře"}>
                <input id="name" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={inputValues.name} />
            </SimpleCardCapsule>
            <SimpleCardCapsule title={"Anglický název"}>
                <input id="name_en" className='form-control' onChange={onChange} onBlur={onChange} defaultValue={inputValues.name_en} />
            </SimpleCardCapsule>
        </ButtonWithDialog>
    </>)
}

