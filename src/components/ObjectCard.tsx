import { ObjectItem, STATUS_CONFIG } from '@/data/mockData';
import StatusDot from './StatusDot';
import Icon from '@/components/ui/icon';

interface ObjectCardProps {
  obj: ObjectItem;
  onClick: () => void;
}

export default function ObjectCard({ obj, onClick }: ObjectCardProps) {
  const config = STATUS_CONFIG[obj.status];

  const yandexNavUrl = `https://yandex.ru/navi/?rtext=~${obj.lat},${obj.lng}&rtt=auto`;
  const yandexMapUrl = `https://yandex.ru/maps/?pt=${obj.lng},${obj.lat}&z=16&l=map`;

  return (
    <div
      className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 ${config.bg}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">{obj.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{obj.organization}</p>
        </div>
        <StatusDot status={obj.status} size="md" />
      </div>

      <div className="flex items-center gap-1.5 mb-2 group" onClick={e => e.stopPropagation()}>
        <Icon name="MapPin" size={12} className="text-muted-foreground flex-shrink-0" />
        <div className="flex gap-1 min-w-0">
          <a
            href={yandexNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate"
            title="Яндекс Навигатор"
          >
            {obj.address}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <Icon name="User" size={12} className="text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground truncate">{obj.contact}</span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {obj.systems.slice(0, 3).map(sys => (
          <span key={sys} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-md">
            {sys}
          </span>
        ))}
        {obj.systems.length > 3 && (
          <span className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-xs rounded-md">
            +{obj.systems.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <StatusDot status={obj.status} size="sm" showLabel />
        </div>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <a
            href={yandexNavUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-secondary hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Маршрут в Навигаторе"
          >
            <Icon name="Navigation" size={12} />
          </a>
          <a
            href={yandexMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-secondary hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Открыть на карте"
          >
            <Icon name="Map" size={12} />
          </a>
        </div>
      </div>

      {obj.tasks.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs font-medium text-muted-foreground">
            {obj.tasks.length} {obj.tasks.length === 1 ? 'задача' : obj.tasks.length < 5 ? 'задачи' : 'задач'}
          </span>
        </div>
      )}
    </div>
  );
}
