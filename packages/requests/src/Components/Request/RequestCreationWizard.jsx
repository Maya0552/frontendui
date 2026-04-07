import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared'
import { ErrorHandler, FormBody, Input, LoadingSpinner, Select } from '@hrbolek/uoisfrontend-shared'
import { RequestCategoryOptions } from '../RequestCategory/RequestCategoryOptions'
import { RequestTypeOptions } from '../RequestType/RequestTypeOptions'
import { RequestInsertAsyncAction } from './Queries/RequestInsertAsyncAction'

/**
 * Component to manage request creation workflow.
 *
 * @function RequestCreationWizard
 * @param {Object} props - The properties for the `RequestCreationWizard` component.
 * @param {Object} props.request - The initial request object.
 *
 * @returns {JSX.Element} The `RequestWizardSteps` component.
 */
export const RequestCreationWizard = ({ request }) => {
    const [_request, setRequest] = useState({ category_id: "47c9d6a8-e2fa-478d-a876-593463e95370", ...request });
    const { fetch, loading, error } = useAsyncAction(RequestInsertAsyncAction, {}, { deferred: true });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const value = e?.target?.value;
        if (value) setRequest(value);
    };

    const handleCreate = async () => {
        console.log("handle create", _request);
        if (!_request.__typename) {
            const newRequest = await fetch(_request);
            setRequest(newRequest);
            navigate(`/requests/request/view/${newRequest.id}#graph`);
        } else {
            navigate(`/requests/request/view/${_request.id}#graph`);
        }
    };

    return (<>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        <RequestWizardSteps
            initialStep={request?.__typename ? 1 : 0}
            request={_request}
            onChange={handleChange}
            onCreate={handleCreate}
        />
    
    </>);
};

/**
 * Component to manage the wizard steps and render appropriate content based on the current step.
 *
 * @function RequestWizardSteps
 * @param {Object} props - The properties for the `RequestWizardSteps` component.
 * @param {number} props.initialStep - The initial step index.
 * @param {Object} props.request - The current request object.
 * @param {Function} props.onChange - Callback for handling input changes.
 * @param {Function} props.onCreate - Callback to create the final request.
 *
 * @returns {JSX.Element} The wizard step for the current index.
 */
const RequestWizardSteps = ({ initialStep, request, onChange, onCreate }) => {
    const [wizardStep, setWizardStep] = useState(initialStep);

    const handleStepChange = (stepChange) => setWizardStep((prev) => prev + stepChange);

    switch (wizardStep) {
        case 0:
            return (
                <RequestTypeSelectionStep request={request} onChange={onChange}>
                    <span className="btn btn-lg btn-outline-success" onClick={() => handleStepChange(1)}>
                        Další krok
                    </span>
                </RequestTypeSelectionStep>
            );
        case 1:
            return (
                <RequestNamingStep request={request} onChange={onChange}>
                    {!request?.__typename && (
                        <span className="btn btn-lg btn-outline-success" onClick={() => handleStepChange(-1)}>
                            Předcházející krok
                        </span>
                    )}
                    <span className="btn btn-lg btn-outline-success" onClick={() => handleStepChange(1)}>
                        Další krok
                    </span>
                </RequestNamingStep>
            );
        default:
            return (
                <RequestSummaryStep request={request} onChange={onChange}>
                    <span className="btn btn-lg btn-outline-success" onClick={() => handleStepChange(-1)}>
                        Předcházející krok
                    </span>
                    <span className="btn btn-lg btn-outline-success" onClick={onCreate}>
                        Vytvořit
                    </span>
                </RequestSummaryStep>
            );
    }
};

/**
 * Step 0: Select Request Type and Category.
 *
 * @function RequestTypeSelectionStep
 * @param {Object} props - The properties for the step.
 * @param {Object} props.request - The current request object.
 * @param {Function} props.onChange - Callback for handling input changes.
 * @param {React.ReactNode} props.children - Buttons or additional elements for navigation.
 *
 * @returns {JSX.Element} The rendered step.
 */
export const RequestTypeSelectionStep = ({ request, onChange, children }) => {
    const [shouldFetch, setShouldFetch] = useState(0);

    const handleChange = (e) => {
        const value = e?.target?.value;
        const shouldFetch = request.category_id !== value.category_id;
        if (shouldFetch) {
            setShouldFetch((prev) => prev + 1);
        }
        onChange(e);
    };

    return (
        <FormBody id="request" defaultValue={request} label="Vytvoření požadavku [krok 1]" onChange={handleChange} onBlur={handleChange}>
            <p>Vyberte kategorii a typ</p>
            <Select id="category_id" label="Kategorie požadavků" className="form-control">
                <RequestCategoryOptions />
            </Select>
            <Select id="request_type_id" label="Typ požadavku" className="form-control">
                <RequestTypeOptions params={{ where: { category_id: { _eq: request.category_id } } }} shouldFetch={shouldFetch} />
            </Select>
            {children}
        </FormBody>
    );
};

/**
 * Step 1: Name the Request.
 *
 * @function RequestNamingStep
 * @param {Object} props - The properties for the step.
 * @param {Object} props.request - The current request object.
 * @param {Function} props.onChange - Callback for handling input changes.
 * @param {React.ReactNode} props.children - Buttons or additional elements for navigation.
 *
 * @returns {JSX.Element} The rendered step.
 */
export const RequestNamingStep = ({ request, onChange, children }) => {
    return (
        <FormBody id="request" defaultValue={request} label="Vytvoření požadavku [krok 2]" onChange={onChange} onBlur={onChange}>
            <p>Pojmenujte požadavek</p>
            <Input id="name" label="Název" className="form-control" defaultValue={request.name || "Název"} />
            <Input id="name_en" label="Anglický název" className="form-control" defaultValue={request.name_en || request.nameEn || "Název"} />
            {children}
        </FormBody>
    );
};

/**
 * Step 2: Summary and Finalization.
 *
 * @function RequestSummaryStep
 * @param {Object} props - The properties for the step.
 * @param {Object} props.request - The current request object.
 * @param {Function} props.onChange - Callback for handling input changes.
 * @param {React.ReactNode} props.children - Buttons or additional elements for navigation.
 *
 * @returns {JSX.Element} The rendered step.
 */
export const RequestSummaryStep = ({ request, onChange, children }) => {
    return (
        <FormBody id="request" defaultValue={request} label="Vytvoření požadavku [krok 3]" onChange={onChange} onBlur={onChange}>
            <p>Rekapitulace</p>
            <Select disabled id="request_type_id" label="Typ požadavku" className="form-control">
                <RequestTypeOptions params={{ where: { category_id: { _eq: request.category_id } } }} />
            </Select>
            <Input disabled id="name" label="Název" className="form-control" defaultValue={request.name || "Název"} />
            <Input disabled id="name_en" label="Anglický název" className="form-control" defaultValue={request.name_en || request.nameEn || "Název"} />
            {children}
        </FormBody>
    );
};
