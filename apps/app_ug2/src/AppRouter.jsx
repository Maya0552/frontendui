
import { ProgramPage, ProgramRouterSegment, SubjectRouterSegment } from "@hrbolek/uoisfrontend-zp";
import {
      createBrowserRouter,
      RouterProvider
} from "react-router-dom";
  
// import { UserRouterSegment } from "@hrbolek/uoisfrontend-ug2";

export const Routes = [
    // UserRouterSegment
    {
        path: "/hello/:id",
        element: <ProgramPage />
    },
    ProgramRouterSegment,
    SubjectRouterSegment,
    
]

// const router = createBrowserRouter(Routes, {basename: "/ug"});
const router = createBrowserRouter(Routes);
// const router = createProxyBrowseRouter(Routes, {basename: "/ug"});

export const AppRouter = () => <RouterProvider router={router} />

