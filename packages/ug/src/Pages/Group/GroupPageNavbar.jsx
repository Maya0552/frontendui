import Nav from 'react-bootstrap/Nav'
import { ProxyLink, MyNavbar, useHash } from '@hrbolek/uoisfrontend-shared';

const TitleNavButton = ({ group, segment, label, ...props }) => {
    const urlbase = (segment) => `/ug/group/view/${group?.id}#${segment}`;
    return (
        <Nav.Link as={"span"} {...props}>
            <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
        </Nav.Link>
    );
};


export const GroupPageNavbar = ({ group, onSearchChange }) => {
    const [currentHash, setHash] = useHash(); // Use the custom hook to manage hash

    const segments = [
        { segment: 'granting', label: 'Garance' },
        { segment: 'learning', label: 'Výuka' },
        { segment: 'events', label: 'Rozvrh' },
        { segment: 'roles', label: 'Role' },
        { segment: 'groups', label: 'Skupiny' },
        { segment: 'memberships', label: 'Příslušnost'},
        { segment: 'projects', label: 'Projekty' },
        { segment: 'publications', label: 'Výsledky' },
        { segment: 'requests', label: 'Požadavky' },
    ]
    return (
        <MyNavbar onSearchChange={onSearchChange} >
            {segments.map(({ segment, label }) => (
                <Nav.Item key={segment} >
                    <TitleNavButton
                        group={group}
                        segment={segment}
                        label={label}
                        className={segment===currentHash?"active":""} aria-current={segment===currentHash?"page":undefined}
                    />
                </Nav.Item>
            ))}
      </MyNavbar>
    );
};
