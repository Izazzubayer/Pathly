import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PlaceStatus } from '@/types';

const statusConfig: Record<PlaceStatus | 'on-route' | 'detour' | 'optional', { label: string; className: string }> = {
  'on-route': {
    label: 'On the way',
    className: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20',
  },
  'detour': {
    label: 'Small detour',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  'optional': {
    label: 'Optional',
    className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
  },
  'anchor': {
    label: 'Must visit',
    className: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20',
  },
};

interface StatusBadgeProps {
  status: PlaceStatus | 'on-route' | 'detour' | 'optional';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }
  
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

