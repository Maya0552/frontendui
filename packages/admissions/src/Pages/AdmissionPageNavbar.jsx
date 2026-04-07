import { MyNavbar } from "@hrbolek/uoisfrontend-shared";

const TitleNavButton = ({ admission, segment, label }) => {
    const urlbase = (segment) => `/admissions/admission/${segment}/${admission?.id}`;
    return (
        <Nav.Link as={"span"}>
            <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
        </Nav.Link>
    );
};

export const AdmissionPageNavbar = ({ admission }) => {
    return (
        <MyNavbar onSearchChange={null} showmeURL={"/admissions/admission/view/"}>
            {/* <ul className="navbar-nav d-flex justify-content-center w-100">
                <TitleNavButton admission={admission} segment="granting" label="Garance" />
                <TitleNavButton admission={admission} segment="learning" label="Výuka" />
                <TitleNavButton admission={admission} segment="events" label="Rozvrh" />
                <TitleNavButton admission={admission} segment="roles" label="Role" />
                <TitleNavButton admission={admission} segment="admissions" label="Skupiny" />
                <TitleNavButton admission={admission} segment="projects" label="Projekty" />
                <TitleNavButton admission={admission} segment="publications" label="Výsledky" />
                <TitleNavButton admission={admission} segment="requests" label="Požadavky" />
            </ul>
            <ul className="navbar-nav d-flex justify-content-center w-100">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Výuka
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <TitleNavButton admission={admission} segment="events" label="Rozvrh" />
                        <TitleNavButton admission={admission} segment="granting" label="Garance" />
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Jine</a>
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Tvůrčí činnost
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <TitleNavButton admission={admission} segment="projects" label="Projekty" />
                        <TitleNavButton admission={admission} segment="publications" label="Výsledky" />
                        <TitleNavButton admission={admission} segment="requests" label="Požadavky" />
                    </div>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Administrativa
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <TitleNavButton admission={admission} segment="requests" label="Požadavky" />
                    </div>
                </li>
            </ul> */}
        </MyNavbar>
    );
};