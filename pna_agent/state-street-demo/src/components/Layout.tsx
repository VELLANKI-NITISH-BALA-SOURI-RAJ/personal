import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box,
  CssBaseline,
  IconButton,
  Breadcrumbs
} from '@mui/material';
import { 
  Home, 
  Search, 
  Assessment, 
  Description, 
  BarChart, 
  Settings, 
  People,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Outlet, useLocation, Link } from 'react-router-dom';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

export const Layout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Analytics', icon: <Assessment />, path: '/analytics' },
    { text: 'Documents', icon: <Description />, path: '/documents' },
    { text: 'Reports', icon: <BarChart />, path: '/reports' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
    { text: 'Users', icon: <People />, path: '/users' },
  ];

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(x => x);
    
    return [
      <Typography key="root" color="inherit">State Street Core Data</Typography>,
      <Typography key="page" color="inherit">Root Page</Typography>,
      <Typography key="current" color="text.primary">
        {paths.length > 0 ? paths[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Home'}
      </Typography>
    ];
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
          borderBottom: '1px solid #e0e0e0'
        }}
        elevation={0}
      >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', mr: 4 }}>
              STATE STREET
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 0.5, px: 2, borderRadius: 1 }}>
               <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>Data Product</Typography>
               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>GLOBAL PERFORMANCE ANALYTICS</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden',
            borderRight: '1px solid #e0e0e0'
          },
        }}
      >
        <Toolbar variant="dense" /> {/* Spacing for header */}
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname.startsWith(item.path) && item.path !== '/' || (location.pathname === '/' && item.path === '/')}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, overflow: 'auto' }}>
        {/* Sub-header Breadcrumbs */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Breadcrumbs separator="/" aria-label="breadcrumb">
            {getBreadcrumbs()}
          </Breadcrumbs>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
};
