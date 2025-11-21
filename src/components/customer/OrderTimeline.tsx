import { CheckCircle2, Circle, Truck, Package as PackageIcon } from 'lucide-react';

interface OrderTimelineProps {
  status: string;
  fulfillmentStatus: string;
  fulfilledAt?: string | null;
  createdAt: string;
}

export const OrderTimeline = ({ status, fulfillmentStatus, fulfilledAt, createdAt }: OrderTimelineProps) => {
  const steps = [
    {
      label: 'Order Placed',
      completed: true,
      date: new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      icon: PackageIcon,
    },
    {
      label: 'Processing',
      completed: status !== 'pending',
      date: status !== 'pending' ? 'In progress' : null,
      icon: PackageIcon,
    },
    {
      label: 'Shipped',
      completed: fulfillmentStatus === 'fulfilled',
      date: fulfilledAt ? new Date(fulfilledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
      icon: Truck,
    },
    {
      label: 'Delivered',
      completed: status === 'completed',
      date: status === 'completed' ? 'Complete' : null,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const Icon = step.completed ? CheckCircle2 : Circle;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                  steps[index + 1].completed ? 'bg-brand-pink' : 'bg-gray-200'
                }`} />
              )}

              {/* Icon */}
              <div className={`relative z-10 rounded-full p-2 ${
                step.completed 
                  ? 'bg-brand-pink text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <p className={`mt-2 text-sm font-medium text-center ${
                step.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </p>

              {/* Date */}
              {step.date && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.date}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
