import { Input, Label, Select, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { useEffect, useMemo, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { CQCol, CQRow } from "../../CQ";
import { makeFilterChangeHandler, NumberFilter, NumberIntervalFilter, StrFilter } from "../../RequestTypeGQLModel/Components/RequestTypeFilter";


export const RequestFilter = ({onChange=(newFilter)=> null}) => {
    const [filter, setFilter] = useState({})
    const onChange_ = makeFilterChangeHandler(setFilter, (newFilter) => {
        console.log("RequestTypeFilter.onChange", JSON.stringify(newFilter));
        onChange(newFilter); // předáme rodiči
    });
    return (<>
        <SimpleCardCapsule title="Typ požadavku" className="mb-3">
            <StrFilter onChange={onChange_} filter={{fullname: {}}} />
            <NumberFilter onChange={onChange_} filter={{id: {}}} />
            <NumberIntervalFilter onChange={onChange_} filter={{initial_form_id: {}}} />
        </SimpleCardCapsule>
    </>)
}