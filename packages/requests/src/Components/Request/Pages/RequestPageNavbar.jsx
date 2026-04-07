import Nav from 'react-bootstrap/Nav'
import { ProxyLink, MyNavbar, useHash } from '@hrbolek/uoisfrontend-shared';

/**
 * A navigation button component that generates a URL based on the request's ID and a specific segment.
 * The button uses a `ProxyLink` to navigate while preserving hash and query parameters.
 *
 * ### Features:
 * - Dynamically constructs the URL with a hash fragment pointing to the specified segment.
 * - Displays a label for the navigation link.
 * - Integrates seamlessly with `ProxyLink` for enhanced navigation.
 *
 * @component
 * @param {Object} props - The properties for the TitleNavButton component.
 * @param {Object} props.request - The request object containing details about the request.
 * @param {string|number} props.request.id - The unique identifier for the request.
 * @param {string} props.segment - The segment to append as a hash fragment in the URL.
 * @param {string} props.label - The text to display as the label for the navigation button.
 *
 * @returns {JSX.Element} A styled navigation button linking to the constructed URL.
 *
 * @example
 * // Example 1: Basic usage with a request and segment
 * const request = { id: 123 };
 * const segment = "details";
 * const label = "View Details";
 *
 * <TitleNavButton request={request} segment={segment} label={label} />
 * // Resulting URL: `/ug/request/view/123#details`
 *
 * @example
 * // Example 2: Different segment and label
 * <TitleNavButton request={{ id: 456 }} segment="settings" label="Request Settings" />
 * // Resulting URL: `/ug/request/view/456#settings`
 */
const TitleNavButton = ({ request, segment, label, ...props }) => {
    // const urlbase = (segment) => `/requests/request/${segment}/${request?.id}`;
    const urlbase = (segment) => `/requests/request/view/${request?.id}#${segment}`;
    return (
        <Nav.Link as={"span"} {...props}>
            <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
        </Nav.Link>
    );
};


export const RequestPageNavbar = ({ request, onSearchChange }) => {
    const [currentHash, setHash] = useHash(); // Use the custom hook to manage hash

    const segments = [
        { segment: 'history', label: 'Historie'},
        // { segment: 'permissions', label: 'Práva' },
        { segment: 'roles', label: 'Role' },
        // { segment: 'library', label: 'Knihovna' },
        { segment: 'graph', label: 'Stavy' },
    ]
    return (
        <div className='screen-only'>
        <MyNavbar onSearchChange={onSearchChange} >
            {request && segments.map(({ segment, label }) => (
                <Nav.Item key={segment} >
                    <TitleNavButton
                        request={request}
                        segment={segment}
                        label={label}
                        className={segment===currentHash?"active":""} aria-current={segment===currentHash?"page":undefined}
                    />
                </Nav.Item>
            ))}
      </MyNavbar>
      </div>
    );
};