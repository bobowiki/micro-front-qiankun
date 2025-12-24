import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Demo from './pages/demo';

import './App.css';

const App = (props) => {
  const { basePath = '' } = props;
  const router = createBrowserRouter([{ path: '/', element: <Demo /> }], {
    basename: `${basePath}/${__SOURCE_PREFIX__}`,
  });
  return <RouterProvider router={router} />;
};

export default App;
