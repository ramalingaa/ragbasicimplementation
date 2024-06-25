import React from 'react';
import './MenuItem.scss';
import { IconType } from 'react-icons';

interface MenuItemProps {
  icon?: IconType;
  title?: string;
  action?: () => void;
  isActive?: () => boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  title = '',
  action = () => {},
  isActive = () => false,
}) => {
  return (
    <button
      className={`menu-item ${isActive() ? 'is-active' : ''}`}
      onClick={action}
      title={title}
    >
      {Icon && <Icon />}
    </button>
  );
};

export default MenuItem;
