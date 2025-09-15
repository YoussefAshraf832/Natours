import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Footer from './Footer';
import Header from './Header';

function AppLayout() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/');

  useEffect(
    function () {
      if (pathSegments[1] === 'overview') {
        document.title = 'Natours | All Tours';
      }
    },
    [pathSegments],
  );
  // if (pathSegments[1] === 'overview') {
  //   useEffect(
  //     function () {
  //       document.title = 'Natours | Tours';
  //     },
  //     [pathSegments],
  //   );
  // }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default AppLayout;
