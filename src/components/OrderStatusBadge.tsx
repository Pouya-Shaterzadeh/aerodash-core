import { Badge } from "@/components/ui/badge";

type OrderStatus = 'pending' | 'in-transit' | 'delivered' | 'cancelled';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' },
    'in-transit': { label: 'In Transit', className: 'bg-primary/10 text-primary hover:bg-primary/20' },
    delivered: { label: 'Delivered', className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' },
    cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive hover:bg-destructive/20' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};
