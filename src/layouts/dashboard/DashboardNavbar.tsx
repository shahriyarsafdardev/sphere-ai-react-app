import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { Box, Stack, IconButton } from '@material-ui/core';
// hooks
import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
import {
  COLLAPSE_WIDTH,
  CompanyLogo,
  HeadText,
  NavbarRootStyle,
  ToolbarStyle
} from 'layouts/Common';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// components
import { MHidden } from '../../components/@material-extend';
import AccountPopover from './AccountPopover';
// import NotificationsPopover from '../../components/common/NotificationsPopover';
// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardNavbar({ onOpenSidebar }: DashboardNavbarProps) {
  const { isCollapse } = useCollapseDrawer();
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const visibleHeaders: string[] = [];
  useEffect(() => {
    const tab = window.location.href.split('/');
    const section = tab.reverse()[0];

    if (tab.length > 3) {
      if (visibleHeaders.includes(section)) {
        setCurrentTab(section);
      } else {
        setCurrentTab(null);
      }
    }
  }, [window.location.href]);

  let TOP_NAVBAR_WIDTH = '100%';
  if (user?.type! === 'company') {
    TOP_NAVBAR_WIDTH = `calc(100% - ${COLLAPSE_WIDTH}px)`;
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        {user?.type === 'company' && (
          <CompanyLogo>
            <img data-testid="company-logo" src="/static/sphere_with_logo.svg" alt="logo" />
          </CompanyLogo>
        )}
        <NavbarRootStyle
          sx={{
            ...(isCollapse && {
              width: { lg: `${TOP_NAVBAR_WIDTH}` }
            })
          }}
        >
          <ToolbarStyle sx={{ padding: '0 40px 0 0 !important' }}>
            <MHidden width="lgUp">
              <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
                <Icon icon={menu2Fill} />
              </IconButton>
            </MHidden>
            {currentTab && (
              <HeadText
                color="text.primary"
                data-testid={`dashboard-navbar-${currentTab}`}
                variant="h4"
              >
                {currentTab}
              </HeadText>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
              {/* <NotificationsPopover /> */}
              <AccountPopover />
            </Stack>
          </ToolbarStyle>
        </NavbarRootStyle>
      </Box>
    </Box>
  );
}
