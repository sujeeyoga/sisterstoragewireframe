import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ShippingMetadata {
  zone_name?: string;
  zone_description?: string;
  matched_rule?: {
    type: string;
    value: string;
  };
  rate_method?: string;
  is_free?: boolean;
  free_threshold?: number;
  original_rate?: number;
  applied_rate?: number;
  reason?: string;
  source?: string;
}

interface ShippingReasonBadgeProps {
  metadata?: ShippingMetadata | null;
  charged?: number;
  className?: string;
}

export function ShippingReasonBadge({ metadata, charged = 0, className = "" }: ShippingReasonBadgeProps) {
  if (!metadata) {
    return (
      <Badge variant="outline" className={className}>
        No shipping data
      </Badge>
    );
  }

  const isFree = metadata.is_free || charged === 0;
  const thresholdMet = metadata.free_threshold && metadata.free_threshold > 0;

  // Determine reason and styling
  let label = "";
  let variant: "default" | "secondary" | "outline" = "outline";
  let emoji = "";
  let description = "";

  if (isFree) {
    if (thresholdMet) {
      label = `Free - Over $${metadata.free_threshold}`;
      variant = "default";
      emoji = "🎉";
      description = `Free shipping earned by meeting the $${metadata.free_threshold} threshold!`;
    } else if (metadata.zone_name?.toLowerCase().includes("toronto") || 
               metadata.zone_name?.toLowerCase().includes("gta")) {
      label = `Free - ${metadata.zone_name}`;
      variant = "default";
      emoji = "🚚";
      description = `Free local delivery to ${metadata.zone_name}`;
    } else {
      label = "Free Shipping";
      variant = "default";
      emoji = "🎉";
      description = metadata.zone_description || "Free shipping applied";
    }
  } else {
    if (metadata.zone_name) {
      label = `$${(charged || 0).toFixed(2)} - ${metadata.zone_name}`;
      variant = "secondary";
      emoji = "💰";
      if (thresholdMet) {
        description = `Below $${metadata.free_threshold} threshold. ${metadata.rate_method || "Standard shipping"}`;
      } else {
        description = metadata.rate_method || "Standard shipping rate";
      }
    } else {
      label = `$${(charged || 0).toFixed(2)} - Standard`;
      variant = "secondary";
      emoji = "💰";
      description = "Standard shipping rate applied";
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className={`gap-1 ${className}`}>
            <span>{emoji}</span>
            <span>{label}</span>
            <Info className="h-3 w-3 ml-1 opacity-70" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{description}</p>
            {metadata.matched_rule && (
              <p className="text-xs text-muted-foreground">
                Matched by {metadata.matched_rule.type.replace(/_/g, " ")}: {metadata.matched_rule.value}
              </p>
            )}
            {metadata.original_rate && metadata.original_rate !== charged && (
              <p className="text-xs text-muted-foreground">
                Original rate: ${(metadata.original_rate || 0).toFixed(2)}
              </p>
            )}
            {metadata.source && (
              <p className="text-xs text-muted-foreground">
                Source: {metadata.source === "stallion" ? "Stallion API" : 
                         metadata.source === "chitchats" ? "ChitChats API" : "Database"}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
