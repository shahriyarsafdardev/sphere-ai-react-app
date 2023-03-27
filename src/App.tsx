import { useEffect } from 'react';

// event tracker

import SegmentScript from 'components/SegmentScript';
import { createBrowserHistory as createHistory } from 'history';
import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
import useAuth from './hooks/useAuth';
// components
// import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import ThemeLocalization from './components/ThemeLocalization';

require('dotenv').config({ path: '../.env' });

// ----------------------------------------------------------------------

declare global {
  interface Window {
    analytics: any;
    strum: Function;
  }
}

export default function App() {
  const { isInitialized } = useAuth();

  const history = createHistory();

  useEffect(() => {
    history.listen((action: any) => {
      if (action !== 'REPLACE') {
        window.strum('routeChange', window.location.href);
      }
    });
  }, [history]);

  return (
    <ThemeConfig>
      <ThemeLocalization>
        <RtlLayout>
          <NotistackProvider>
            <ScrollToTop />
            <SegmentScript />
            {isInitialized ? <Router /> : <LoadingScreen />}
          </NotistackProvider>
        </RtlLayout>
      </ThemeLocalization>
    </ThemeConfig>
  );
}
