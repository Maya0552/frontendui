import {
      createBrowserRouter,
      RouterProvider
} from "react-router-dom";

import { AdmissionPage, ExamPage, StudentPage } from "@hrbolek/uoisfrontend-admissions";
  

export const Routes = [
    {
        path: '/admission/admission/view/:id',
        element: <AdmissionPage />
    },
    {
        path: '/admission/student/view/:id',
        element: <StudentPage />
    },
    {
        path: '/admission/exam/view/:id',
        element: <ExamPage />
    },
    
]

// const router = createBrowserRouter(Routes, {basename: "/ug"});
const router = createBrowserRouter(Routes);
// const router = createProxyBrowseRouter(Routes, {basename: "/ug"});

export const AppRouter = () => <RouterProvider router={router} />

