import { StatusType, STATUS_CONFIG } from '@/data/mockData';

interface StatusDotProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function StatusDot({ status, size = 'md', showLabel = false }: StatusDotProps) {
  const config = STATUS_CONFIG[status];
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-block rounded-full flex-shrink-0 ${sizes[size]} ${status === 'urgent' ? 'pulse-urgent' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
      )}
    </span>
  );
}
