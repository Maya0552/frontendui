import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncGraphQLAction, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared";
import { BoxArrowInLeft, BoxArrowRight, HouseFill, PersonCircle } from "react-bootstrap-icons";

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Dropdown } from "react-bootstrap";
import { ProxyLink } from "./ProxyLink";

/**
 * shared module.
 * @module shared/components
 */


// GraphQL query for fetching the logged-in user
const MeQuery = `
{
    result: me {
        __typename
        isThisMe
        id
        name
        surname
        fullname
        email
        roles {
            id
            group {
                id
                name
            }
            userId
            roletype {
                id
                name
            }
        }
    }
}`;

// Create an async action from the GraphQL query
const MeAsyncAction = createAsyncGraphQLAction(MeQuery);

/**
 * A `LogButton` component that displays login/logout links and the user's profile link.
 *
 * @param {Object} props - The properties for the LogButton component.
 * @param {string} [props.loginURL='/oauth/login2?redirect_uri=/'] - The URL to redirect for login.
 * @param {string} [props.logoutURL='/oauth/logout'] - The URL to redirect for logout.
 * @param {string} [props.showmeURL='/ug/user/view/'] - The base URL for the user's profile view. If null, the profile link is not shown.
 *
 * @returns {JSX.Element} The login/logout button and optional profile link.
 */
export const LogButton = ({
    loginURL = '/oauth/login2?redirect_uri=/',
    logoutURL = '/oauth/logout',
    showmeURL = '/ug/user/view/',
}) => {
    const dispatch = useDispatch();
    const [me, setMe] = useState(null);

    // Fetch the logged-in user's data on component mount
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const jsondata = await dispatch(MeAsyncAction({}));
                const meFresh = jsondata?.data?.result;
                if (meFresh) {
                    setMe(meFresh);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchMe();
    }, [dispatch]);

    if (me) {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                    <PersonCircle size={32} />
                </Dropdown.Toggle>
    
                <Dropdown.Menu align="end">
                    <Dropdown.Item href="/index"><HouseFill size={32} /> Index</Dropdown.Item>
                    <Dropdown.Item href={`/ug/user/view/${me?.id}`}><PersonCircle size={32} /> Profil</Dropdown.Item>
                    <Dropdown.Item href="/logout"><BoxArrowRight size={32}/> Odhlásit</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );        
        // return (
        //     <div className="navbar-nav text-end m-0 p-0">
        //         <a className="nav-link" href={logoutURL}>
        //             {/* <DoorOpen size={32} /> */}
                    
        //             {me.fullname}
        //             <BoxArrowRight size={32} />
        //             <ArrowRightCircleFill size={32} />
        //         </a>
        //         {showmeURL && (
        //             <a className="nav-link" href={`${showmeURL}${me.id}`}>
        //                 {/* <i className="bi bi-person-circle" /> Já */}
        //                 <PersonCircle size={32}/>
        //             </a>
        //         )}
        //     </div>
        // );
    }

    return (
        // <div className="navbar-nav text-end m-0 p-0">
        //     <a className="nav-link" href={loginURL}>
        //         Login
        //     </a>
        // </div>
        <a className="nav-link" href={loginURL}>
            <BoxArrowInLeft size={32} /> Přihlásit
        </a>

    );
};


/**
 * A component that conditionally renders its children based on user permissions.
 * It should disable visualisation if logged user (me) would get uncompleted data.
 *
 * @component
 * @param {Object} props - The props for the PageSentinel component.
 * @param {Function} [props.meCondition=(me => me?.email?.includes("world"))] - 
 *    A function that determines whether the current user (`me`) has permission. 
 *    Receives the user object as an argument and returns a boolean.
 * @param {React.ReactNode} props.children - The content to render if the user meets the condition.
 *
 * @returns {JSX.Element|null} - The rendered component if the condition is met, a message if not,
 *    or null if the user data is not available.
 *
 * @example
 * // Usage example
 * const MyComponent = () => (
 *   <PageSentinel meCondition={(me) => me?.role === "admin"}>
 *     <div>Welcome, Admin!</div>
 *   </PageSentinel>
 * );
 */
export const ComponentSentinel = ({ meCondition = (me => me?.email?.includes("world")), children }) => {
    const items = useSelector(state => state?.items) || {};

    // console.log("PageSentinel items", items)
    // const me = Object.values(items).find(user => user?.__typename === "UserGQLModel" && user?.isThisMe);

    const { me } = useMe()
    // console.log("PageSentinel me", me)

    if (!me) return <div>Nejste přihlášeni</div>;

    const hasPermission = meCondition(me);
    // console.log("PageSentinel hasPermission", hasPermission)
    // if (!hasPermission) return <div>Nemáte oprávnění</div>;
    if (!hasPermission) return null;

    return <>{children}</>;
};

export const useMe = ({refresh=false, AsyncAction=MeAsyncAction}={}) => {
    const dispatch = useDispatch()
    const items = useSelector(state => state?.items) || {};
    const [state, setState] = useState({
        me: Object.values(items).find(user => user?.__typename === "UserGQLModel" && user?.isThisMe),
        error: null,
        loading: true,
        notLogged: null,
    });
    // console.log("useMe", state)

    // console.log("PageSentinel items", items)
    // const me = state.me;

    useEffect(() => {
        
        const fetchMe = async () => {
            try {
                const jsondata = await dispatch(AsyncAction({}));
                const meFresh = jsondata?.data?.result;
                if (meFresh) {
                    setState(state => ({ ...state, me: meFresh, error: null, loading: false}));
                } else {
                    setState(state => ({ ...state, error: "Neočekávaná odpověď od serveru", loading: false}));
                }
            } catch (error) {
                setState(state => ({ ...state, error, loading: false, notLogged: null }));
                console.error("Error fetching user data:", error);
            }
        };
        if (refresh || !state.me) {
            fetchMe();
        } else {
            setState(state => ({ ...state, error: null, loading: false}));
        }
        
    }, [dispatch, AsyncAction]);

    return {...state}
}

/**
 * Determines if the current user has a specified role type in an RBAC object.
 *
 * @param {Object} rbacobject - The RBAC (Role-Based Access Control) object containing role information.
 * @param {string[]} roletypenames - An array of role type names to check against.
 * @returns {boolean} - Returns `true` if the user has any of the specified roles, otherwise `false`.
 * @throws {Error} - Throws an error if the input is invalid.
 */
export const useRbacObject = (rbacobject, roletypenames) => {
    const { me } = useMe();

    // Validate input parameters
    if (!rbacobject || typeof rbacobject !== "object") {
        throw new Error("Invalid input: 'rbacobject' must be a valid object.");
    }
    if (!Array.isArray(roletypenames)) {
        throw new Error("Invalid input: 'roletypenames' must be an array.");
    }

    // Destructure roles with a fallback to an empty array
    const { roles = [] } = rbacobject;

    // Helper function to check if a user has a role
    const userHasRole = role => {
        return role?.userId === me?.id && roletypenames.includes(role?.roletype?.name);
    };

    // Check if the user has any of the specified roles
    return roles.some(userHasRole);
};

const StateReadQuery = `
query StateReadQuery($id: UUID!) {
    stateById(id: $id) {
    __typename
    id
    readers: roletypes(access: READ) {
      __typename
      id
      name
    }
    writers: roletypes(access: WRITE) {
      __typename
      id
      name
    }
  } 
}`

const StateReadAsyncAction = createAsyncGraphQLAction(StateReadQuery)

/**
 * A custom hook to check if the logged-in user has specific roles associated with an entity.
 *
 * This function validates the input parameters, retrieves state information if necessary,
 * and determines if the current user has any of the specified roles.
 *
 * @function
 * @param {Object} entity - The entity object containing role and state information.
 * @param {Object} [entity.state] - The current state of the entity, if available.
 * @param {string|number} [entity.stateId] - The identifier for the entity's state, if applicable.
 * @param {Object} entity.rbacobject - The RBAC object containing role information.
 * @param {Array<string>} [roletypenames] - An array of role type names to check against.
 *
 * @returns {Object} An object containing:
 *  - `userHasRole` {boolean}: Whether the logged-in user has any of the specified roles.
 *
 * @throws {Error} If input validation fails, such as missing or invalid parameters.
 *
 * @example
 * // Example usage:
 * const entity = { stateId: 123, rbacobject: { roles: [{ userId: 1, roletype: { name: 'editor' } }] } };
 * const roletypenames = ['editor', 'admin'];
 *
 * const result = useRoles(entity, roletypenames);
 * console.log(result.userHasRole); // Outputs: true or false based on roles
 */
export const useRoles = (entity, roletypenames) => {
    const { me } = useMe();
    const { state, stateId, rbacobject } = entity;

    // Determine role type names from the state if available
    if (state) {
        roletypenames = state?.writers || [];
    } else if (stateId) {
        const [retrievedState] = useFreshItem({ id: stateId }, StateReadAsyncAction);
        roletypenames = retrievedState?.writers || [];
    }

    // Validate input parameters
    if (!rbacobject || typeof rbacobject !== "object") {
        throw new Error("Invalid input: 'rbacobject' must be a valid object.");
    }

    if (!state && !stateId && !Array.isArray(roletypenames)) {
        throw new Error("Invalid input: 'roletypenames' must be an array or stateId/state must be present.");
    }

    if (roletypenames.length === 0) {
        throw new Error("Invalid input: 'roletypenames' is an empty array.");
    }

    // Extract roles from RBAC object
    const { roles = [] } = rbacobject;

    /**
     * Helper function to check if the current user has a specific role.
     * @param {Object} role - A role object from the RBAC roles list.
     * @param {number|string} role.userId - The user ID associated with the role.
     * @param {Object} role.roletype - The role type object.
     * @param {string} role.roletype.name - The name of the role type.
     * @returns {boolean} `true` if the current user has the role; otherwise, `false`.
     */
    const hasRole = role => {
        return role?.userId === me?.id && roletypenames.includes(role?.roletype?.name);
    };

    // Check if the current user has any of the specified roles
    const userHasRole = roles.some(hasRole);

    return { userHasRole };
};


/**
 * MyNavbar renders the navigation bar for the application.
 *
 * This component displays a responsive navigation bar that includes:
 * - A home button linking to the index page.
 * - A search input field (if provided via `onSearchChange`).
 * - A profile icon that links to the user's profile.
 * - Custom children elements in the center of the navbar.
 *
 * Depending on the user state (loading, error, not logged), it displays appropriate content.
 *
 * @param {Object} props - The component properties.
 * @param {string} [props.loginURL='/oauth/login2?redirect_uri=/'] - URL to redirect for login.
 * @param {string} [props.logoutURL='/oauth/logout'] - URL to perform logout.
 * @param {string} [props.showmeURL='/ug/user/view/'] - Base URL for viewing the user's profile.
 * @param {string} [props.indexURL='/index'] - URL for the home page.
 * @param {function} [props.onSearchChange=null] - Callback function invoked when the search input value changes.
 * @param {React.ReactNode} props.children - Elements to be rendered as part of the navbar content.
 *
 * @returns {JSX.Element} The rendered navigation bar.
 */
export const MyNavbar = ({
    loginURL = '/oauth/login2?redirect_uri=/',
    logoutURL = '/oauth/logout',
    showmeURL = '/ug/user/view/',
    indexURL = '/index',
    onSearchChange = null,
    children
}) => {
    // const dispatch = useDispatch();
    // const [state, setState] = useState({
    //     me: null,
    //     error: null,
    //     loading: true,
    //     notLogged: null,
    // });

    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const state = useMe()

    // if (state.loading) {
    //     return (
    //         <div className="text-center">
    //             <span>Nahrávám...</span>
    //         </div>
    //     );
    // }

    if (state.error) {
        return (
            <div className="text-center">
                <h2>Chyba</h2>
                <span>{state.error?.message || "Došlo k chybě. Zkuste to prosím znovu."}</span>
                <a className="btn btn-lg btn-primary" href={loginURL}>Přihlásit</a>
            </div>
        );
    }

    if (state.notLogged) {
        return (
            <div className="text-center">
                <a className="btn btn-lg btn-primary" href={loginURL}>Přihlásit</a>
            </div>
        );
    }
    //navbar-light bg-light
    return (
        <Navbar bg="light" expand="lg">
            {/* {state?.loading && <div className="text-center">
                <span>Nahrávám...</span>
            </div>} */}
            {/* Navbar Brand or Logo */}
            {/* <Navbar.Collapse id="never">
            <Nav variant="tabs" className="align-items-left">
                <Nav.Item>          
                    <ProxyLink to={indexURL} aria-label="Home">
                        <HouseFill size={32} />
                    </ProxyLink>
                </Nav.Item>
            </Nav>
            </Navbar.Collapse> */}
            {/* <Navbar.Brand as="span">
                    <ProxyLink to={indexURL} aria-label="Home">
                        <HouseFill size={32} />
                    </ProxyLink>
            </Navbar.Brand> */}

            {/* Toggle Button for Collapsing */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            {/* Collapsible Nav Section */}
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav variant="tabs" className="align-items-center w-100 flex-column flex-lg-row">
                    <div className="mb-0">
                        <ProxyLink to={indexURL} aria-label="Home" className="mr-3">
                            <HouseFill size={32} />
                        </ProxyLink>                        
                    </div>                    

                    <div className="mx-auto d-flex align-items-center flex-column flex-lg-row mb-0">
                        {children}
                    </div>                    

                    {/* Search Form and Profile Icon (Right-Aligned in Large Screens) */}
                    <div className="d-flex flex-column flex-lg-row align-items-center ml-lg-auto">
                        {/* Search Form */}
                        {onSearchChange && (
                            <Form className="d-flex align-items-center mb-3 mb-lg-0">
                                <Row>
                                    <Col xs="auto">
                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            onChange={handleSearchChange}
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        )}

                        {/* Profile Icon */}
                        <Nav.Item className="ml-lg-3" style={{ marginLeft: '16px' }}>
                            <ProxyLink to={`${showmeURL}${state?.me?.id}`} aria-label="Profile">
                                <PersonCircle size={32} />
                            </ProxyLink>
                        </Nav.Item>
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>



    );
};

