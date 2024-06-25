import React, { forwardRef } from 'react';

interface CustomCardProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'solid';
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  // Add other props as needed
}

const sizeClasses = {
  sm: 'p-2 text-sm',
  md: 'p-4 text-base',
  lg: 'p-6 text-lg',
};

const variantClasses = {
  outline: 'border border-gray-300',
  solid: 'bg-gray-200',
  none: '',
};

const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>((props, ref) => {
  const { size = 'md', variant = 'none', className, children, style, ...rest } = props;
  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];

  // Tailwind classes for common Card styling, adjust as necessary
  const baseClass = `rounded-lg ${sizeClass} ${variantClass} ${className}`;

  return <div ref={ref} style={style} className={baseClass} {...rest}>{children}</div>;
});

CustomCard.displayName = 'CustomCard';

export default CustomCard;
