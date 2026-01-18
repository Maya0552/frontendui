import { useState } from "react"
import { useMemo } from "react"

import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { TextArea } from "../../../../_template/src/Base/FormControls/TextArea"
import { EntityLookup } from "../../../../_template/src/Base/FormControls/EntityLookup"
import { SearchAsyncAction as SearchUserAsyncAction } from "../../../../_template/src/UserGQLModel/Queries/SearchAsyncAction"
import { SearchAsyncAction as SearchGroupAsyncAction } from "../../../../_template/src/GroupGQLModel/Queries/SearchAsyncAction"
import { Link, SimpleCardCapsule } from "../../../../_template/src/Base/Components"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { ReadAsyncAction as ReadGroupAsyncAction } from "../../../../_template/src/GroupGQLModel"
import { useEffect } from "react"
import { reduceToFirstEntity, selectItemById, useGQLClient } from "../../../../dynamic/src/Store"
import { extendAsyncGraphQLAction } from "../../../../dynamic/src/Core/extendAsyncGraphQLAction"
import { ReadAsyncAction as ReadUserAsyncAction } from "../../../../_template/src/UserGQLModel/Queries"
import { FormFieldQueryDataRenderer } from "./FormFieldQueryDataRenderer";

const RendererFactory = (Component, defaultProps = {}) => ({
    digital_submission_field,
    fieldDef,
    onChange,
    mode,
    ...props
}) => (
    <Component className="form-control"
        value={digital_submission_field?.value ?? ""}
        onChange={onChange}
        placeholder={fieldDef?.description ?? ""}
        {...props}
        {...defaultProps}
    />
)

const FormFieldInputRenderer = RendererFactory(Input, {
    className: "form-control"
})

const FormFieldInputNumberRenderer = RendererFactory(Input, {
    className: "form-control", type: "number"
})



const FormFieldTextAreaRenderer = RendererFactory(TextArea, {
    className: "form-control"
})


const FormFieldItemRendererPrint = ({
    digital_submission_field,
    fieldDef,
    onChange,
    mode,
    item,
    ...props
}) => {
    return (<>

        {/* <Attribute label={fieldDef?.label ?? ""}><Link item={item}/></Attribute> */}
        <strong>{fieldDef?.label}</strong> <Link item={item} />
        {/* {item && <b><Link item={item}/></b>} <small>({digital_submission_field?.value})</small>< br/> */}
        {/* |{JSON.stringify(item)}| */}
    </>)
}


export const FormFieldEntityRenderer = ({
    digital_submission_field,
    fieldDef,
    onChange,
    mode,
    ReadAsyncAction: ReadGroupAsyncAction_ = ReadGroupAsyncAction,
    SearchAsyncAction: SearchGroupAsyncAction_ = SearchGroupAsyncAction,
    FormFieldRendererPrint: FormFieldGroupRendererPrint_ = FormFieldItemRendererPrint,
    ...props
}) => {
    const [selected, setSelected] = useState(null)
    const handleSelect = (item) => {
        console.log("GroupRenderer.handleSelect", item)
        setSelected(item)
        return { clear: true }
    }

    const ReadFieldData = useMemo(() => {
        return extendAsyncGraphQLAction(ReadGroupAsyncAction_, reduceToFirstEntity)
    }, [])

    const { entity, run, loading, error } = useAsyncThunkAction(ReadFieldData, { id: "" }, { deferred: true })
    useEffect(() => {

        if (digital_submission_field?.value) {
            run({ id: digital_submission_field?.value }).then(
                (data) => {
                    setSelected(prev => data ?? prev)
                    return data
                }
            )
        }
        return
    }, [digital_submission_field?.value])

    return (<>

        <EntityLookup
            className="form-control"
            {...props}
            id="id"
            asyncAction={SearchGroupAsyncAction_}
            value={selected ?? ""}
            onChange={onChange}
            onSelect={handleSelect}
        />
        <FormFieldGroupRendererPrint_
            digital_submission_field={digital_submission_field}
            fieldDef={fieldDef}
            onChange={onChange}
            mode={mode}
            item={selected}
        />

    </>)
}


const FormFieldGroupRenderer = ({ ...props }) => (
    <FormFieldEntityRenderer
        ReadAsyncAction={ReadGroupAsyncAction}
        SearchAsyncAction={SearchGroupAsyncAction}
        {...props}
    />
)

const FormFieldUserRenderer = ({ ...props }) => (
    <FormFieldEntityRenderer
        ReadAsyncAction={ReadUserAsyncAction}
        SearchAsyncAction={SearchUserAsyncAction}
        {...props}
    />
)



const DefaultRenderer = FormFieldInputRenderer

export const formFieldRegister = {
    "ed227dc5-17da-4bb6-be49-b065c50c9bf7": {
        label: "Jednořádkový text",
        value: "ed227dc5-17da-4bb6-be49-b065c50c9bf7",
        Component: FormFieldInputRenderer,
        evaluator: (value) => value
    },
    "181e3eb0-4c4a-4e78-b588-37668356539c": {
        label: "Celé číslo",
        value: "181e3eb0-4c4a-4e78-b588-37668356539c",
        Component: FormFieldInputNumberRenderer,
        evaluator: (value) => Int(value)
    },
    "a84ee99c-6536-4cf4-a063-e63af0f8908f": {
        label: "Víceřádkový text",
        value: "a84ee99c-6536-4cf4-a063-e63af0f8908f",
        Component: FormFieldTextAreaRenderer,
        evaluator: (value) => value
    },
    "0c3d2f37-cd06-48b2-b325-2c407189e210": {
        label: "Skupina",
        value: "0c3d2f37-cd06-48b2-b325-2c407189e210",
        Component: FormFieldGroupRenderer,
        evaluator: (value) => value
    },
    "179c3977-cb7f-4188-ac14-d4cf54a2bbd8": {
        label: "Osoba",
        value: "179c3977-cb7f-4188-ac14-d4cf54a2bbd8",
        Component: FormFieldUserRenderer,
        evaluator: (value) => value
    },
    "fa2baf40-babc-4593-890f-d49bb9731322": {
        label: "Dotaz na data",
        value: "fa2baf40-babc-4593-890f-d49bb9731322",
        Component: FormFieldQueryDataRenderer,
        evaluator: (value) => value
    }
}

const FormFieldComponentSelector = (fieldId) =>
    formFieldRegister?.[fieldId]?.Component ?? DefaultRenderer

export const FormFieldRenderer = ({
    digital_submission_field,
    fieldDef,
    onChange,
    mode
}) => {
    // const Renderer = useMemo(() => FormFieldComponentSelector(fieldDef?.fieldId), [fieldDef?.fieldId])
    const Renderer = FormFieldComponentSelector(fieldDef?.typeId)
    return (<>
        {/* <br/>|{JSON.stringify(fieldDef)}| */}
        <Renderer
            digital_submission_field={digital_submission_field}
            onChange={onChange}
            fieldDef={fieldDef}
            mode={mode}
        />
    </>)
}