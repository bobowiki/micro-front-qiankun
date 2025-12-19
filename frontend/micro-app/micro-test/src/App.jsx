import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Demo from "./pages/demo";
import { lazy, Suspense } from "react";

import "./App.css";

const Demo = lazy(() => import("./pages/demo"));

const App = (props) => {
  const { basePath = "" } = props;
  const router = createBrowserRouter(
    [
      {
        path: "/test",
        element: (
          <Suspense fallback={<div>加载中...</div>}>
            <Demo />
          </Suspense>
        ),
      },
    ],
    {
      basename: basePath + "/" + __SOURCE_PREFIX__,
    }
  );
  return <RouterProvider router={router} />;
};

export default App;
