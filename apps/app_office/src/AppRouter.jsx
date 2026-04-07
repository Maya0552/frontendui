import {
    createBrowserRouter,
    Outlet,
    RouterProvider,
} from "react-router-dom";
import { NavigationHistoryLinks, NavigationHistoryProvider } from '../../../packages/_template/src/Base/Helpers/NavigationHistoryProvider';

import { BaseRouterSegments } from "../../../packages/_template/src/Base/Pages/RouterSegment";

import { GroupRouterSegments } from "../../../packages/_template/src/GroupGQLModel/Pages/RouterSegment";
import { RoleTypeRouterSegments } from "../../../packages/_template/src/RoleTypeGQLModel/Pages";
import { UserRouterSegments } from "../../../packages/_template/src/UserGQLModel/Pages/RouterSegment";
import { GroupTypeRouterSegments } from "../../../packages/_template/src/GroupTypeGQLModel/Pages/RouterSegment";
import { RoleRouterSegments } from "../../../packages/_template/src/RoleGQLModel/Pages";
import { AppNavbar } from "./AppNavbar";
import { DigitalFormGQLModelRouterSegments } from "../../../packages/office/src/DigitalFormGQLModel/Pages";
import { SubmissionRouterSegments } from "../../../packages/office/src/DigitalSubmission/Pages/RouterSegment";
import { StateMachineRouterSegments } from "../../../packages/_template/src/StateMachineGQLModel/Pages/RouterSegment";
import { RequestTypeRouterSegments } from "../../../packages/office/src/RequestTypeGQLModel/Pages/RouterSegment";
import { RequestRouterSegments } from "../../../packages/office/src/RequestGQLModel/Pages/RouterSegment";


const AppLayout = () => (
    
    <NavigationHistoryProvider>
        <AppNavbar />
        <div className="screen-only" >
            <NavigationHistoryLinks />
        </div>
        <Outlet />
    </NavigationHistoryProvider>
);

const Routes = [
    {
        path: "/",          // root
        element: <AppLayout />,
        children: [
            ...BaseRouterSegments,
            ...GroupRouterSegments,
            ...RoleTypeRouterSegments,
            ...UserRouterSegments,
            ...GroupTypeRouterSegments,
            ...RoleRouterSegments,
            ...StateMachineRouterSegments,

            ...DigitalFormGQLModelRouterSegments,
            ...SubmissionRouterSegments,
            ...RequestTypeRouterSegments,
            ...RequestRouterSegments
        ],
    },
];

// console.log("Routes", Routes)
// console.log("Routes", GroupRouterSegments)

const router = createBrowserRouter(Routes);

export const AppRouter = () => <RouterProvider router={router} />;
