import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

function useActive(currentPath:string, path:string): string {
    return currentPath === path? "ant-menu-item-selected" : ""
}

function Navigation() {
  const location = useLocation()
  const isActive = (path: string) =>
    location.pathname === path ? 'contained' : 'text';

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FitTrack
        </Typography>
        <Button component={Link} to="/" variant={isActive('/')}>
          Main
        </Button>
        <Button component={Link} to="/shop" variant={isActive('/shop')}>
          Shop
        </Button>
        <Button component={Link} to="/login" variant={isActive('/login')}>
          SignIn
        </Button>
        <Button component={Link} to="/register" variant={isActive('/register')}>
          SignUp
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation