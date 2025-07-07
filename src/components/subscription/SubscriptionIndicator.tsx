import React from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Star,
  StarBorder,
  AccountCircle,
  Settings,
  Upgrade,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';

interface SubscriptionIndicatorProps {
  variant?: 'chip' | 'icon' | 'text';
  showMenu?: boolean;
  size?: 'small' | 'medium';
}

export const SubscriptionIndicator = ({
  variant = 'chip',
  showMenu = false,
  size = 'medium'
}: SubscriptionIndicatorProps) => {
  const { status } = useSubscription();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpgrade = () => {
    handleMenuClose();
    navigate('/subscription');
  };

  const handleManage = () => {
    handleMenuClose();
    navigate('/subscription');
  };

  const getStatusColor = () => {
    if (status.isActive) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (status.isActive) return <Star />;
    return <StarBorder />;
  };

  const getStatusText = () => {
    if (status.isLoading) return 'Loading...';
    return status.planName;
  };

  if (status.isLoading) {
    return (
      <Box display="flex" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (variant === 'icon') {
    const iconButton = (
      <Tooltip title={`${getStatusText()} Plan`}>
        <IconButton
          size={size}
          onClick={showMenu ? handleMenuOpen : handleManage}
          color={getStatusColor()}
        >
          {getStatusIcon()}
        </IconButton>
      </Tooltip>
    );

    if (!showMenu) {
      return iconButton;
    }

    return (
      <>
        {iconButton}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleManage}>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={getStatusText()} 
              secondary={status.isActive ? 'Active subscription' : 'Free plan'}
            />
          </MenuItem>
          <Divider />
          {!status.isActive && (
            <MenuItem onClick={handleUpgrade}>
              <ListItemIcon>
                <Upgrade fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Upgrade to Pro" />
            </MenuItem>
          )}
          <MenuItem onClick={handleManage}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Manage Subscription" />
          </MenuItem>
        </Menu>
      </>
    );
  }

  if (variant === 'text') {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body2" color="text.secondary">
          {getStatusText()}
        </Typography>
        {getStatusIcon()}
      </Box>
    );
  }

  // Default chip variant
  return (
    <Tooltip title={`${getStatusText()} Plan`}>
      <Chip
        icon={getStatusIcon()}
        label={getStatusText()}
        color={getStatusColor() as any}
        size={size}
        variant={status.isActive ? 'filled' : 'outlined'}
        onClick={showMenu ? handleMenuOpen : handleManage}
        clickable={showMenu || true}
      />
    </Tooltip>
  );
};

// Specialized components for different use cases
export const ProBadge = () => {
  const { status } = useSubscription();
  
  if (!status.isActive) return null;
  
  return (
    <Chip
      icon={<Star />}
      label="PRO"
      color="success"
      size="small"
      variant="filled"
    />
  );
};

export const PlanDisplay = () => {
  const { status } = useSubscription();
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" color="text.secondary">
        Current Plan:
      </Typography>
      <Chip
        label={status.planName}
        color={status.isActive ? 'success' : 'default'}
        size="small"
        variant={status.isActive ? 'filled' : 'outlined'}
      />
    </Box>
  );
};

export const UpgradeButton = ({ 
  size = 'medium' 
}: { size?: 'small' | 'medium' }) => {
  const { status } = useSubscription();
  const navigate = useNavigate();
  
  if (status.isActive) return null;
  
  return (
    <Chip
      icon={<Upgrade />}
      label="Upgrade to Pro"
      color="primary"
      size={size}
      variant="filled"
      onClick={() => navigate('/subscription')}
      clickable
    />
  );
}; 