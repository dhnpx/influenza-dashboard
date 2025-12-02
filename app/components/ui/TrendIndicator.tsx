interface TrendIndicatorProps {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function TrendIndicator({
  value,
  direction,
  label = 'vs last week',
  size = 'md',
  showIcon = true,
}: TrendIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const colorClass =
    direction === 'up'
      ? 'text-red-600'
      : direction === 'down'
      ? 'text-green-600'
      : 'text-gray-600';

  const icon =
    direction === 'up' ? (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : direction === 'down' ? (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ) : (
      <svg className={iconSizeClasses[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${colorClass}`}>
      {showIcon && icon}
      <span className="font-medium">{Math.abs(value).toFixed(1)}%</span>
      {label && <span className="text-gray-500">{label}</span>}
    </div>
  );
}
