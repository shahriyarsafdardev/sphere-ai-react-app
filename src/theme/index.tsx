import { useMemo, ReactNode } from 'react';
// material
import { CssBaseline } from '@material-ui/core';
import {
  createTheme,
  ThemeOptions,
  ThemeProvider,
  StyledEngineProvider
} from '@material-ui/core/styles';
// hooks
//
import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

type ThemeConfigProps = {
  children: ReactNode;
};

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const THEMEDIRECTION = 'ltr';
  const ISLIGHT = true;

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: ISLIGHT ? { ...palette.light, mode: 'light' } : { ...palette.dark, mode: 'dark' },
      shape,
      typography,
      breakpoints,
      direction: THEMEDIRECTION,
      shadows: ISLIGHT ? shadows.light : shadows.dark,
      customShadows: ISLIGHT ? customShadows.light : customShadows.dark
    }),
    [ISLIGHT, THEMEDIRECTION]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
