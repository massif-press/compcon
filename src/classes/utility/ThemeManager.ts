import localForage from 'localforage';
import theme from '@/ui/theme';
import * as themes from '@/ui/style/themes';

const getThemePreload = () => {
  // Preload theme
  const ls = localForage
    .getItem('user.config')
    .then((res) => JSON.parse(res as string)) as any;
  let activeTheme = null;

  if (ls && ls.theme) {
    activeTheme = themes[ls.theme];
  }

  if (!activeTheme) {
    activeTheme = themes.gms;
  }

  theme.theme.dark = activeTheme.type === 'dark';
  theme.dark = activeTheme.type === 'dark';

  theme.theme.themes.dark = activeTheme.colors;
  theme.theme.themes.light = activeTheme.colors;

  return theme;
};

const SetTheme = (t: string, vuetify: any) => {
  const theme = themes[t] ? themes[t] : themes['gms'];
  const isDark = theme.type === 'dark';

  if (isDark) {
    vuetify.theme.themes.dark = theme.colors;
    vuetify.theme.dark = true;
  } else {
    vuetify.theme.themes.light = theme.colors;
    vuetify.theme.dark = false;
  }
};

export { getThemePreload, SetTheme };
