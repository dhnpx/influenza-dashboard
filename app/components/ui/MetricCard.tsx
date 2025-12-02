interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
  progress?: number; // 0-100 for progress bar
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue',
  progress,
}: MetricCardProps) {
  const colorClasses = {
    blue: {
      icon: 'bg-blue-100 text-blue-600',
      trend: 'text-blue-600',
      progress: 'bg-blue-600',
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      trend: 'text-green-600',
      progress: 'bg-green-600',
    },
    orange: {
      icon: 'bg-orange-100 text-orange-600',
      trend: 'text-orange-600',
      progress: 'bg-orange-600',
    },
    red: {
      icon: 'bg-red-100 text-red-600',
      trend: 'text-red-600',
      progress: 'bg-red-600',
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      trend: 'text-purple-600',
      progress: 'bg-purple-600',
    },
    gray: {
      icon: 'bg-gray-100 text-gray-600',
      trend: 'text-gray-600',
      progress: 'bg-gray-600',
    },
  };

  const trendIcon = trend ? (
    trend.direction === 'up' ? (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : trend.direction === 'down' ? (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
  ) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}

          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.direction === 'up' ? 'text-red-600' :
              trend.direction === 'down' ? 'text-green-600' :
              'text-gray-600'
            }`}>
              {trendIcon}
              <span className="font-medium">
                {Math.abs(trend.value).toFixed(1)}%
              </span>
              <span className="text-gray-500 text-xs">vs last week</span>
            </div>
          )}

          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Capacity</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorClasses[color].progress} transition-all duration-300`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {icon && (
                  <div className={`flex-shrink-0 p-1 rounded-full ${colorClasses[color].icon}`}>
          <div className="w-6 h-6 flex items-center justify-center">
            {icon}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
