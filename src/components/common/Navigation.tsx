import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import { handleLogout } from "../../features/common/authAPI";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from "../../store/store";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = (path: string) =>
    location.pathname === path ? 'contained' : 'text';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isAuthenticated = useSelector((state: RootState)=>state.auth.isAuthenticated);
  // console.log(isAuthenticated);
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FitTrack
        </Typography>
        {isAuthenticated ? 
          (
            <Button component={Link} to="/dashboard" variant={isActive('/')}>
              DashBoard
            </Button>
          ): (
            <>
              <Button component={Link} to="/login" variant={isActive('/login')}>
                Login
              </Button>
              <Button component={Link} to="/register" variant={isActive('/register')}>
                Register
              </Button>
            </>
          )
        }
        <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={()=>{handleLogout(dispatch,navigate)}}>Logout</MenuItem>
      </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation