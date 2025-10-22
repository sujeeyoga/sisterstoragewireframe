export interface ShippingZone {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  enabled: boolean;
  rules: ShippingZoneRule[];
  rates: ShippingZoneRate[];
}

export interface ShippingZoneRule {
  id: string;
  zone_id: string;
  rule_type: 'country' | 'province' | 'postal_code_pattern' | 'city';
  rule_value: string;
}

export interface ShippingZoneRate {
  id: string;
  zone_id: string;
  method_name: string;
  rate_type: 'flat_rate' | 'free_threshold';
  rate_amount: number;
  free_threshold: number | null;
  enabled: boolean;
  display_order: number;
}

export interface Address {
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}

export interface ApplicableRate {
  id: string;
  method_name: string;
  rate_amount: number;
  is_free: boolean;
  display_order: number;
}

/**
 * Normalizes postal code for pattern matching
 */
const normalizePostalCode = (postalCode: string): string => {
  return postalCode.toUpperCase().replace(/\s+/g, '');
};

/**
 * Checks if a postal code matches a pattern (supports wildcards)
 * Pattern examples: "M*", "M4C*", "M4C1*"
 */
const matchesPostalPattern = (postalCode: string, pattern: string): boolean => {
  const normalized = normalizePostalCode(postalCode);
  const normalizedPattern = normalizePostalCode(pattern);
  
  // Convert pattern to regex (replace * with .*)
  const regexPattern = normalizedPattern.replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`);
  
  return regex.test(normalized);
};

/**
 * Calculates the priority score for a rule match
 * Higher priority = more specific match
 */
const getRulePriority = (ruleType: string): number => {
  const priorities = {
    postal_code_pattern: 400,
    city: 300,
    province: 200,
    country: 100,
  };
  return priorities[ruleType as keyof typeof priorities] || 0;
};

/**
 * Checks if an address matches a specific rule
 */
const matchesRule = (address: Address, rule: ShippingZoneRule): boolean => {
  const normalizedValue = rule.rule_value.toUpperCase().trim();
  
  switch (rule.rule_type) {
    case 'postal_code_pattern':
      return address.postalCode 
        ? matchesPostalPattern(address.postalCode, rule.rule_value)
        : false;
    
    case 'city':
      return address.city?.toUpperCase().trim() === normalizedValue;
    
    case 'province':
      return address.province?.toUpperCase().trim() === normalizedValue;
    
    case 'country':
      return address.country?.toUpperCase().trim() === normalizedValue;
    
    default:
      return false;
  }
};

/**
 * Matches an address to the most specific shipping zone
 * Returns the matched zone or null if no match found
 */
export const matchAddressToZone = (
  address: Address,
  zones: ShippingZone[]
): ShippingZone | null => {
  let bestMatch: { zone: ShippingZone; priority: number } | null = null;
  
  for (const zone of zones) {
    if (!zone.enabled || !zone.rules || zone.rules.length === 0) {
      continue;
    }
    
    // Check if any rule matches
    for (const rule of zone.rules) {
      if (matchesRule(address, rule)) {
        const rulePriority = getRulePriority(rule.rule_type);
        const totalPriority = zone.priority + rulePriority;
        
        if (!bestMatch || totalPriority > bestMatch.priority) {
          bestMatch = { zone, priority: totalPriority };
        }
        
        // Stop checking other rules for this zone once we have a match
        break;
      }
    }
  }
  
  return bestMatch?.zone || null;
};

/**
 * Gets applicable rates for a zone based on order subtotal
 * Handles free shipping thresholds
 */
export const getApplicableRates = (
  zone: ShippingZone,
  orderSubtotal: number
): ApplicableRate[] => {
  if (!zone.rates || zone.rates.length === 0) {
    return [];
  }
  
  return zone.rates
    .filter(rate => rate.enabled)
    .map(rate => {
      const isFree = 
        rate.rate_type === 'free_threshold' && 
        rate.free_threshold !== null && 
        orderSubtotal >= rate.free_threshold;
      
      return {
        id: rate.id,
        method_name: rate.method_name,
        rate_amount: isFree ? 0 : rate.rate_amount,
        is_free: isFree,
        display_order: rate.display_order,
      };
    })
    .sort((a, b) => a.display_order - b.display_order);
};

/**
 * Calculates the best (cheapest) rate from available options
 */
export const calculateBestRate = (rates: ApplicableRate[]): ApplicableRate | null => {
  if (rates.length === 0) return null;
  
  // Sort by price (free shipping first, then lowest price)
  const sorted = [...rates].sort((a, b) => {
    if (a.is_free && !b.is_free) return -1;
    if (!a.is_free && b.is_free) return 1;
    return a.rate_amount - b.rate_amount;
  });
  
  return sorted[0];
};
