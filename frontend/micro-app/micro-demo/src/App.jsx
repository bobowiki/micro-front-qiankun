import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import Demo from './pages/demo';
import { ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';

const App = (props) => {
  const { basePath = '', actions } = props;
  const [theme, setTheme] = useState({});

  const router = createBrowserRouter([{ path: '/home', element: <Demo /> }], {
    basename: `${basePath}/${__SOURCE_PREFIX__}`,
  });

  useEffect(() => {
    if (!actions) return;
    const off = actions.onGlobalStateChange(({ theme }) => {
      if (theme) {
        setTheme(theme);
      }
    }, true);

    return () => {
      off?.();
    };
  }, [actions]);

  return (
    <ConfigProvider theme={{ token: { ...theme } }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
