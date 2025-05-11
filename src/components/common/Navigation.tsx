import { Menu } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { Link, useLocation } from "react-router-dom";

function useActive(currentPath:string, path:string): string {
    return currentPath === path? "ant-menu-item-selected" : ""
}

function Navigation() {
  const location = useLocation()
  const pathName = location.pathname  
  const isHome = useActive(pathName,"/")
  const isShop = useActive(pathName,"/shop")
  const isSignin = useActive(pathName,"/signin")
  const isSignup = useActive(pathName,"/signup")
  return (
    <Menu mode="horizontal" selectable={false}>
        <MenuItem className={isHome}>
            <Link to="/">Main</Link>
        </MenuItem>
        <MenuItem className={isShop}>
            <Link to="/shop">Shop</Link>
        </MenuItem>
        <MenuItem className={isSignin}>
            <Link to="/login">SignIn</Link>
        </MenuItem>
        <MenuItem className={isSignup}>
            <Link to="/register">SignUp</Link>
        </MenuItem>
    </Menu>
  )
}

export default Navigation