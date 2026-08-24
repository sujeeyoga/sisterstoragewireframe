import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Address {
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
}

interface ShippingZoneRule {
  id: string;
  zone_id: string;
  rule_type: 'country' | 'province' | 'postal_code_pattern' | 'city';
  rule_value: string;
}

interface ShippingZoneRate {
  id: string;
  zone_id: string;
  method_name: string;
  rate_type: 'flat_rate' | 'free_threshold';
  rate_amount: number;
  free_threshold: number | null;
  enabled: boolean;
  display_order: number;
}

interface ShippingZone {
  id: string;
  name: string;
  description: string | null;
  priority: number;
  enabled: boolean;
  rules: ShippingZoneRule[];
  rates: ShippingZoneRate[];
}

interface StaticShippingResult {
  success: true;
  debug?: Record<string, unknown>;
  zone: { id: string; name: string; description: string | null } | null;
  matchedRule: { rule_type: string; rule_value: string } | null;

  rates: Array<{
    id: string;
    method_name: string;
    rate_amount: number;
    original_rate_amount?: number;
    is_free: boolean;
    free_threshold: number | null;
    display_order: number;
  }>;
  appliedRate: {
    id: string;
    method_name: string;
    rate_amount: number;
    original_rate_amount?: number;
    is_free: boolean;
    free_threshold: number | null;
    display_order: number;
  };
  fallback_used: boolean;
  rate_source: string;
  source: string;
}

const normalizePostalCode = (postalCode: string): string => {
  return postalCode.toUpperCase().replace(/\s+/g, '');
};

const matchesPostalPattern = (postalCode: string, pattern: string): boolean => {
  const normalized = normalizePostalCode(postalCode);
  const normalizedPattern = normalizePostalCode(pattern);
  const regexPattern = normalizedPattern.replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(normalized);
};

const GTA_CITIES = new Set([
  'toronto', 'north york', 'scarborough', 'etobicoke', 'york', 'east york',
  'vaughan', 'woodbridge', 'concord', 'maple', 'thornhill', 'kleinburg',
  'richmond hill', 'markham', 'unionville', 'stouffville', 'whitchurch-stouffville',
  'mississauga', 'brampton', 'bolton', 'oakville', 'georgetown',
  'burlington', 'milton', 'pickering', 'ajax', 'whitby', 'oshawa',
  'aurora', 'newmarket', 'king city', 'caledon', 'halton hills', 'hamilton',
  'etobicoke north', 'downsview', 'willowdale', 'agincourt'
]);

// Forward Sortation Area prefixes (first 3 chars) covered by GTA local delivery.
const GTA_FSA_PREFIXES = new Set([
  // Durham
  'L1B', 'L1C', 'L1E', 'L1G', 'L1H', 'L1J', 'L1K', 'L1L', 'L1M', 'L1N', 'L1P',
  'L1R', 'L1S', 'L1T', 'L1V', 'L1W', 'L1X', 'L1Y', 'L1Z',
  // York Region (Markham, Richmond Hill, Vaughan, Aurora, Newmarket, Stouffville)
  'L3P', 'L3R', 'L3S', 'L3T', 'L3X', 'L3Y', 'L3Z',
  'L4A', 'L4B', 'L4C', 'L4E', 'L4G', 'L4H', 'L4J', 'L4K', 'L4L', 'L4S',
  'L6A', 'L6B', 'L6C', 'L6E', 'L6G',
  // Peel (Mississauga, Brampton, Caledon)
  'L4T', 'L4V', 'L4W', 'L4X', 'L4Y', 'L4Z',
  'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5J', 'L5K', 'L5L', 'L5M',
  'L5N', 'L5P', 'L5R', 'L5S', 'L5T', 'L5V', 'L5W',
  'L6P', 'L6R', 'L6S', 'L6T', 'L6V', 'L6W', 'L6X', 'L6Y', 'L6Z', 'L7A', 'L7C',
  // Halton (Oakville, Burlington, Milton, Halton Hills)
  'L6H', 'L6J', 'L6K', 'L6L', 'L6M', 'L7G', 'L7L', 'L7M', 'L7N', 'L7P',
  'L7R', 'L7S', 'L7T', 'L9T',
  // King / Bolton / Kleinburg area
  'L7B', 'L7E', 'L0J',
]);

const COUNTRY_ALIASES: Record<string, string> = {
  'CA': 'CA', 'CAN': 'CA', 'CANADA': 'CA',
  'US': 'US', 'USA': 'US', 'U.S.': 'US', 'U.S.A.': 'US',
  'UNITED STATES': 'US', 'UNITED STATES OF AMERICA': 'US',
};

const PROVINCE_ALIASES: Record<string, string> = {
  'ON': 'ON', 'ONT': 'ON', 'ONTARIO': 'ON',
  'QC': 'QC', 'QUEBEC': 'QC', 'QUÉBEC': 'QC',
  'BC': 'BC', 'BRITISH COLUMBIA': 'BC',
  'AB': 'AB', 'ALBERTA': 'AB',
  'MB': 'MB', 'MANITOBA': 'MB',
  'SK': 'SK', 'SASKATCHEWAN': 'SK',
  'NS': 'NS', 'NOVA SCOTIA': 'NS',
  'NB': 'NB', 'NEW BRUNSWICK': 'NB',
  'NL': 'NL', 'NEWFOUNDLAND AND LABRADOR': 'NL', 'NEWFOUNDLAND': 'NL',
  'PE': 'PE', 'PRINCE EDWARD ISLAND': 'PE',
  'YT': 'YT', 'YUKON': 'YT',
  'NT': 'NT', 'NORTHWEST TERRITORIES': 'NT',
  'NU': 'NU', 'NUNAVUT': 'NU',
};

const normalizeCountry = (value?: string): string => {
  const raw = (value || '').toUpperCase().replace(/\s+/g, ' ').trim();
  return COUNTRY_ALIASES[raw] || raw;
};

const normalizeProvince = (value?: string): string => {
  const raw = (value || '').toUpperCase().replace(/\s+/g, ' ').trim();
  return PROVINCE_ALIASES[raw] || raw;
};

const isGTAAddress = (address: Address): boolean => {
  const country = normalizeCountry(address.country);
  const province = normalizeProvince(address.province);
  const city = address.city?.toLowerCase().trim().replace(/\s+/g, ' ') || '';
  const postal = address.postalCode ? normalizePostalCode(address.postalCode) : '';
  const fsa = postal.slice(0, 3);

  // Toronto proper is always M*, which is unambiguous even with a missing province.
  if (country && country !== 'CA') return false;
  if (/^M\d[A-Z]/.test(postal)) return true;
  if (province && province !== 'ON') return false;

  if (GTA_FSA_PREFIXES.has(fsa)) return true;
  if (city && GTA_CITIES.has(city)) return true;

  return false;
};


const buildShippingDebug = (
  rawAddress: any,
  address: Address,
  subtotal: number,
  decision: {
    path: 'database' | 'static_fallback' | 'no_match_fallback';
    zone_name?: string | null;
    rule_type?: string | null;
    rule_value?: string | null;
    rate_source?: string;
    applied_rate?: any;
  }
) => {
  const postal = address.postalCode ? normalizePostalCode(address.postalCode) : '';
  const fsa = postal.slice(0, 3);
  const rate = decision.applied_rate;
  return {
    raw_address: {
      country: rawAddress?.country ?? null,
      province: rawAddress?.province ?? null,
      city: rawAddress?.city ?? null,
      postalCode: rawAddress?.postalCode ?? null,
    },
    normalized_address: {
      country: normalizeCountry(address.country),
      province: normalizeProvince(address.province),
      city: address.city || null,
      postalCode: postal || null,
    },
    fsa: fsa || null,
    gta_fsa_match: fsa ? GTA_FSA_PREFIXES.has(fsa) : false,
    toronto_m_postal: /^M\d[A-Z]/.test(postal),
    is_gta: isGTAAddress(address),
    decision_path: decision.path,
    zone_name: decision.zone_name ?? null,
    rule_type: decision.rule_type ?? null,
    rule_value: decision.rule_value ?? null,
    rate_source: decision.rate_source ?? decision.path,
    subtotal,
    free_threshold: rate?.free_threshold ?? null,
    rate_before_threshold: rate?.original_rate_amount ?? rate?.rate_amount ?? null,
    final_rate: rate?.rate_amount ?? null,
  };
};

const logShippingDebug = (debug: ReturnType<typeof buildShippingDebug>) => {
  console.log('🚚 SHIPPING_DECISION', JSON.stringify(debug));
};

const calculateStaticShippingBase = (address: Address, subtotal: number = 0): StaticShippingResult => {

  const country = normalizeCountry(address.country);
  const province = normalizeProvince(address.province);

  const postal = address.postalCode ? normalizePostalCode(address.postalCode) : '';

  if (isGTAAddress(address)) {
    const isFree = subtotal >= 60;
    const rate = {
      id: 'static_gta_local_delivery',
      method_name: 'GTA Local Delivery',
      rate_amount: isFree ? 0 : 11.5,
      original_rate_amount: 11.5,
      is_free: isFree,
      free_threshold: 60,
      display_order: 1,
    };

    return {
      success: true,
      zone: {
        id: 'static_toronto_gta',
        name: 'Toronto & GTA',
        description: 'Toronto and Greater Toronto Area delivery zone',
      },
      matchedRule: {
        rule_type: /^M\d[A-Z]/.test(postal) || GTA_FSA_PREFIXES.has(postal.slice(0, 3)) ? 'postal_code_pattern' : 'city',
        rule_value: /^M\d[A-Z]/.test(postal)
          ? 'M*'
          : GTA_FSA_PREFIXES.has(postal.slice(0, 3))
            ? `${postal.slice(0, 3)}*`
            : address.city || 'GTA',
      },

      rates: [rate],
      appliedRate: rate,
      fallback_used: false,
      rate_source: 'static_fallback',
      source: 'static_fallback',
    };
  }

  if (country === 'US') {
    const rate = {
      id: 'static_us_standard',
      method_name: 'US Standard Shipping',
      rate_amount: 30,
      original_rate_amount: 30,
      is_free: false,
      free_threshold: null,
      display_order: 1,
    };

    return {
      success: true,
      zone: { id: 'static_united_states', name: 'United States', description: 'Flat-rate shipping to the United States' },
      matchedRule: { rule_type: 'country', rule_value: 'US' },
      rates: [rate],
      appliedRate: rate,
      fallback_used: false,
      rate_source: 'static_fallback',
      source: 'static_fallback',
    };
  }

  const rate = {
    id: 'static_canada_standard',
    method_name: 'Canada Standard Shipping',
    rate_amount: 15,
    original_rate_amount: 15,
    is_free: false,
    free_threshold: null,
    display_order: 1,
  };

  return {
    success: true,
    zone: country === 'CA'
      ? { id: 'static_canada_wide', name: 'Canada-Wide', description: 'Standard shipping across Canada outside GTA-specific matches' }
      : null,
    matchedRule: country === 'CA'
      ? { rule_type: province ? 'province' : 'country', rule_value: province || 'CA' }
      : null,
    rates: [rate],
    appliedRate: rate,
    fallback_used: country !== 'CA',
    rate_source: 'static_fallback',
    source: 'static_fallback',
  };
};

const calculateStaticShipping = (address: Address, subtotal: number = 0, rawAddress: any = address): StaticShippingResult => {
  const result = calculateStaticShippingBase(address, subtotal);
  const debug = buildShippingDebug(rawAddress, address, subtotal, {
    path: 'static_fallback',
    zone_name: result.zone?.name ?? null,
    rule_type: result.matchedRule?.rule_type ?? null,
    rule_value: result.matchedRule?.rule_value ?? null,
    rate_source: 'static_fallback',
    applied_rate: result.appliedRate,
  });
  logShippingDebug(debug);
  return { ...result, debug } as StaticShippingResult;
};


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
 * Extracts country codes from zone rules for pre-validation
 */
const getZoneCountries = (zone: ShippingZone): string[] => {
  return zone.rules
    .filter(r => r.rule_type === 'country')
    .map(r => r.rule_value.toUpperCase().trim());
};

const matchesRule = (address: Address, rule: ShippingZoneRule): boolean => {
  const normalizedValue = rule.rule_value.toUpperCase().trim();
  
  switch (rule.rule_type) {
    case 'postal_code_pattern':
      // Handle wildcard pattern for catch-all
      if (rule.rule_value === '*') return true;
      return address.postalCode 
        ? matchesPostalPattern(address.postalCode, rule.rule_value)
        : false;
    case 'city':
      // Normalize city names: remove extra spaces, handle case
      const normalizedCity = address.city?.toUpperCase().trim().replace(/\s+/g, ' ');
      const normalizedRuleCity = normalizedValue.replace(/\s+/g, ' ');
      return normalizedCity === normalizedRuleCity;
    case 'province':
      return address.province?.toUpperCase().trim() === normalizedValue;
    case 'country':
      // Handle wildcard for catch-all fallback zone
      if (rule.rule_value === '*') return true;
      return address.country?.toUpperCase().trim() === normalizedValue;
    default:
      return false;
  }
};

const matchAddressToZone = (
  address: Address, 
  zones: ShippingZone[]
): { zone: ShippingZone; matchedRule: ShippingZoneRule } | null => {
  let bestMatch: { zone: ShippingZone; matchedRule: ShippingZoneRule; priority: number } | null = null;
  
  for (const zone of zones) {
    if (!zone.enabled || !zone.rules || zone.rules.length === 0) {
      continue;
    }
    
    // CRITICAL: Country pre-validation to prevent cross-border city name collisions
    const zoneCountries = getZoneCountries(zone);
    if (zoneCountries.length > 0 && !zoneCountries.includes('*')) {
      const addressCountry = address.country?.toUpperCase().trim();
      
      if (!addressCountry || !zoneCountries.includes(addressCountry)) {
        console.log(`🚫 Zone "${zone.name}" rejected - country mismatch:`, {
          zoneCountries,
          addressCountry,
          address: {
            city: address.city,
            province: address.province,
            postalCode: address.postalCode
          }
        });
        continue;
      }
      
      console.log(`✅ Zone "${zone.name}" country validated:`, {
        country: addressCountry,
        zoneCountries
      });
    }
    
    // Find the best matching rule for this zone
    let bestRuleMatch: { rule: ShippingZoneRule; priority: number } | null = null;
    const hasNonCountryRules = zone.rules.some(r => r.rule_type !== 'country');
    
    for (const rule of zone.rules) {
      if (matchesRule(address, rule)) {
        const rulePriority = getRulePriority(rule.rule_type);
        
        // Track the best rule match for this zone
        if (!bestRuleMatch || rulePriority > bestRuleMatch.priority) {
          bestRuleMatch = { rule, priority: rulePriority };
        }
      }
    }
    
    // If zone has non-country rules but only matched on country, skip it
    if (bestRuleMatch && hasNonCountryRules && bestRuleMatch.rule.rule_type === 'country') {
      console.log(`⚠️ Zone "${zone.name}" skipped - country-only match when specific rules exist`);
      continue;
    }
    
    // Update best overall match if this zone is better
    if (bestRuleMatch) {
      const totalPriority = zone.priority + bestRuleMatch.priority;
      
      if (!bestMatch || totalPriority > bestMatch.priority) {
        bestMatch = { 
          zone, 
          matchedRule: bestRuleMatch.rule, 
          priority: totalPriority 
        };
        console.log(`✅ New best match: "${zone.name}" (rule: ${bestRuleMatch.rule.rule_type}, priority: ${totalPriority})`);
      }
    }
  }
  
  return bestMatch ? { zone: bestMatch.zone, matchedRule: bestMatch.matchedRule } : null;
};

/**
 * Calls ChitChats API to get real-time US shipping rates
 */
const getChitChatsRates = async (address: Address, supabase: any, packageInfo: any = {}): Promise<any> => {
  try {
    console.log('Fetching ChitChats rates for address:', address);
    
    const { data, error } = await supabase.functions.invoke('chitchats-shipping', {
      body: {
        action: 'get_rates',
        to_country: address.country || 'US',
        to_state: address.province,
        to_city: address.city,
        to_postal_code: address.postalCode || '',
        weight: packageInfo.weight || 500, // default 500g
        length: packageInfo.length || 25,
        width: packageInfo.width || 20,
        height: packageInfo.height || 10,
        package_value: packageInfo.value || 50,
      }
    });

    if (error) {
      console.error('ChitChats API error:', error);
      return null;
    }

    console.log('ChitChats rates response:', data);
    return data;
  } catch (error) {
    console.error('Error calling ChitChats API:', error);
    return null;
  }
};

/**
 * Transforms ChitChats rates to our rate format
 */
const transformChitChatsRates = (chitchatsData: any, subtotal: number): any[] => {
  // ChitChats returns: { success: true, data: { shipment: { rates: [...] } } }
  const rates = chitchatsData?.data?.shipment?.rates || [];

  if (!Array.isArray(rates) || rates.length === 0) {
    console.log('No rates in ChitChats response');
    return [];
  }

  console.log(`Processing ${rates.length} ChitChats rates`);

  return rates
    .map((rate: any, index: number) => {
      const postageFee = parseFloat(rate.postage_fee || '0');
      const tariffFee = parseFloat(rate.tariff_fee || '0');
      const name = rate.postage_description || rate.postage_type || 'Shipping';

      console.log(`ChitChats rate: ${name} - postage $${postageFee.toFixed(2)} + duties $${tariffFee.toFixed(2)}`);

      return {
        id: `chitchats_${rate.postage_type || index}`,
        method_name: name,
        rate_amount: parseFloat(postageFee.toFixed(2)), // Only postage, not duties
        is_free: false,
        free_threshold: null,
        display_order: index + 1,
        carrier: rate.postage_carrier_type,
        service_code: rate.postage_type,
        delivery_estimate: rate.delivery_time_description,
        tariff_fee: parseFloat(tariffFee.toFixed(2)),
        postage_fee: parseFloat(postageFee.toFixed(2)),
        duties_included: false,
      };
    })
    .sort((a, b) => a.rate_amount - b.rate_amount); // Sort by postage cost
};


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let address: Address | undefined;
  let rawAddress: any;
  let subtotal = 0;


  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const requestBody = await req.json();
    const { address: requestAddress, subtotal: requestSubtotal, items = [] } = requestBody;
    address = requestAddress;
    subtotal = Number(requestSubtotal) || 0;

    // Validate required inputs
    if (!address || typeof address !== 'object') {
      console.error('Invalid address:', address);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Address is required and must be an object' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!address.country) {
      console.error('Missing country in address:', address);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Country is required in shipping address' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Normalize country/province so full names ("Canada", "Ontario") match the same
    // rules as ISO codes — otherwise GTA addresses fall through to Canada-wide rates.
    rawAddress = { ...address };
    address = {
      ...address,
      country: normalizeCountry(address.country),
      province: normalizeProvince(address.province),
      city: address.city ? String(address.city).replace(/\s+/g, ' ').trim() : address.city,
    };

    console.log('Calculating shipping for address:', address, 'subtotal:', subtotal, 'items:', items.length);




    // Fetch packaging profiles from store settings
    const { data: packagingProfilesData } = await supabase
      .from('store_settings')
      .select('setting_value')
      .eq('setting_key', 'packaging_profiles')
      .maybeSingle();

    const packagingProfiles = packagingProfilesData?.setting_value || {
      small: { length_in: 16, width_in: 12, height_in: 4, empty_weight_g: 200 },
      large: { length_in: 16, width_in: 12, height_in: 12, empty_weight_g: 450 },
    };

    // Calculate package info from cart items
    let totalProductWeight = 0;
    let totalValue = 0;
    let has4RodBox = false;

    if (items && items.length > 0) {
      // Fetch product details for weight calculation
      const productIds = items.map((item: any) => item.id);
      
      const { data: products, error: productsError } = await supabase
        .from('woocommerce_products')
        .select('id, weight, price, name')
        .in('id', productIds);

      if (!productsError && products) {
        console.log('Fetched product weights:', products);
        
        items.forEach((item: any) => {
          const product = products.find(p => p.id === item.id);
          if (product) {
            // Weight is in grams, multiply by quantity
            const itemWeight = (product.weight || 500) * (item.quantity || 1);
            totalProductWeight += itemWeight;
            
            // Check if order contains 4-rod boxes (typically larger)
            if (product.name?.toLowerCase().includes('4-rod') || 
                product.name?.toLowerCase().includes('large') ||
                product.weight > 600) {
              has4RodBox = true;
            }
            
            // Calculate total value for customs
            totalValue += (product.price || 50) * (item.quantity || 1);
          }
        });
      }
    }

    // Select packaging profile: large if has 4-rod or total weight > 3kg, else small
    const selectedProfile = (has4RodBox || totalProductWeight > 3000) 
      ? packagingProfiles.large 
      : packagingProfiles.small;

    // Convert inches to cm and add empty box weight
    const packageInfo = {
      weight: totalProductWeight + selectedProfile.empty_weight_g,
      length: Math.round(selectedProfile.length_in * 2.54), // inches to cm
      width: Math.round(selectedProfile.width_in * 2.54),
      height: Math.round(selectedProfile.height_in * 2.54),
      value: totalValue || 50,
    };

    console.log('Selected packaging profile:', has4RodBox ? 'large' : 'small', packageInfo);

    // Fetch all zones with rules and rates
    const { data: zonesData, error: zonesError } = await supabase
      .from('shipping_zones')
      .select('*')
      .eq('enabled', true)
      .order('priority', { ascending: false });

    if (zonesError) throw zonesError;

    const { data: rulesData, error: rulesError } = await supabase
      .from('shipping_zone_rules')
      .select('*');

    if (rulesError) throw rulesError;

    const { data: ratesData, error: ratesError } = await supabase
      .from('shipping_zone_rates')
      .select('*')
      .eq('enabled', true)
      .order('display_order', { ascending: true });

    if (ratesError) throw ratesError;

    // Combine data
    const zones: ShippingZone[] = zonesData.map(zone => ({
      ...zone,
      rules: rulesData.filter(rule => rule.zone_id === zone.id),
      rates: ratesData.filter(rate => rate.zone_id === zone.id),
    }));

    // Match address to zone
    const matchResult = matchAddressToZone(address, zones);

    // Log unmatched addresses for monitoring
    if (!matchResult) {
      console.log('⚠️ No zone matched for address:', {
        city: address.city,
        province: address.province,
        country: address.country,
        postalCode: address.postalCode,
      });
    }

    if (matchResult) {
      const { zone: matchedZone, matchedRule } = matchResult;
      
      let applicableRates = [];
      let rateSource = 'database';

      // Detect zone types
      const isUSZone = address.country?.toUpperCase() === 'US' || 
                       matchedRule.rule_value?.toUpperCase() === 'US';
      const isUKZone = address.country?.toUpperCase() === 'GB' || 
                       address.country?.toUpperCase() === 'UK' ||
                       matchedRule.rule_value?.toUpperCase() === 'GB';
      const isCADomestic = address.country?.toUpperCase() === 'CA' && 
                           matchedRule.rule_value?.toUpperCase() !== 'US' &&
                           matchedRule.rule_value?.toUpperCase() !== 'GB';

      // For Canadian domestic orders, use database flat rates directly
      if (isCADomestic) {
        console.log('🇨🇦 Canadian domestic order - using database flat rates');
        applicableRates = matchedZone.rates
          .filter(r => r.enabled)
          .map(rate => {
            const isFree = rate.free_threshold && subtotal >= rate.free_threshold;
            return {
              id: rate.id,
              method_name: rate.method_name,
              rate_amount: isFree ? 0 : rate.rate_amount,
              is_free: isFree,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order,
            };
          });
        rateSource = 'database';
      }
      // For UK zones, try to get real-time ChitChats rates
      // US zones now use database rates only (flat $30)
      else if (isUKZone) {
        const zoneLabel = 'UK';
        console.log(`${zoneLabel} zone detected, fetching ChitChats rates with package info:`, packageInfo);
        const chitchatsData = await getChitChatsRates(address, supabase, packageInfo);
        
        if (chitchatsData?.success) {
          applicableRates = transformChitChatsRates(chitchatsData, subtotal);
          rateSource = 'chitchats';
          console.log(`Using ChitChats rates for ${zoneLabel}:`, applicableRates);
        }
      } else if (isUSZone) {
        console.log('US zone detected - using database flat rate');
      }

      // Fall back to database rates if API calls failed (only applies to UK now)
      if (applicableRates.length === 0) {
        if (isUSZone) {
          // US: Use database rates (flat $30)
          console.log('Using database rates for US zone');
          applicableRates = matchedZone.rates
            .filter(r => r.enabled)
            .map(rate => ({
              id: rate.id,
              method_name: rate.method_name,
              rate_amount: rate.rate_amount,
              is_free: false,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order,
            }));
          rateSource = 'database';
        } else if (isUKZone) {
          // UK fallback: Use database rates if ChitChats fails
          console.log('⚠️ ChitChats API failed for UK - using database rates');
          applicableRates = matchedZone.rates.map(rate => ({
            id: rate.id,
            method_name: rate.method_name,
            rate_amount: rate.rate_amount,
            is_free: false,
            free_threshold: rate.free_threshold,
            display_order: rate.display_order,
          }));
          rateSource = 'database';
        } else {
          // Other zones: use database rates with free threshold logic
          console.log('Using database rates for zone:', matchedZone.name);
          
          applicableRates = matchedZone.rates.map(rate => {
            const isFree = 
              rate.free_threshold !== null && 
          subtotal >= rate.free_threshold;
            
            return {
              id: rate.id,
              method_name: rate.method_name,
              rate_amount: isFree ? 0 : rate.rate_amount,
              is_free: isFree,
              free_threshold: rate.free_threshold,
              display_order: rate.display_order,
            };
          });
          rateSource = 'database';
        }
      }

      console.log('Matched zone:', matchedZone.name, 'rates:', applicableRates, 'source:', rateSource);

      // All zones now use only their database-configured free shipping thresholds
      console.log(`Using zone rates as configured in database for: ${matchedZone.name}`);

      const dbDebug = buildShippingDebug(rawAddress, address, subtotal, {
        path: 'database',
        zone_name: matchedZone.name,
        rule_type: matchedRule.rule_type,
        rule_value: matchedRule.rule_value,
        rate_source: rateSource,
        applied_rate: applicableRates[0] || null,
      });
      logShippingDebug(dbDebug);

      return new Response(
        JSON.stringify({
          success: true,
          debug: dbDebug,
          zone: {
            id: matchedZone.id,
            name: matchedZone.name,
            description: matchedZone.description,
          },
          matchedRule: {
            rule_type: matchedRule.rule_type,
            rule_value: matchedRule.rule_value,
          },
          rates: applicableRates,
          appliedRate: applicableRates[0] || null,
          fallback_used: false,
          rate_source: rateSource,
          source: rateSource,
        }),

        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // No zone matched, use fallback
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('shipping_fallback_settings')
      .select('*')
      .eq('enabled', true)
      .limit(1)
      .single();

    if (fallbackError && fallbackError.code !== 'PGRST116') throw fallbackError;

    const fallbackRate = fallbackData?.fallback_rate || 9.99;
    const fallbackMethodName = fallbackData?.fallback_method_name || 'Standard Shipping';

    console.log('⚠️ Using fallback settings (no database zones matched):', {
      rate: fallbackRate,
      method: fallbackMethodName,
      address: {
        city: address.city,
        province: address.province,
        country: address.country,
        postalCode: address.postalCode,
      }
    });

    const noMatchDebug = buildShippingDebug(rawAddress, address, subtotal, {
      path: 'no_match_fallback',
      rate_source: 'fallback_settings',
      applied_rate: { rate_amount: fallbackRate, original_rate_amount: fallbackRate, free_threshold: null },
    });
    logShippingDebug(noMatchDebug);

    return new Response(
      JSON.stringify({
        success: true,
        debug: noMatchDebug,
        zone: null,
        matchedRule: null,

        rates: [
          {
            id: 'fallback',
            method_name: fallbackMethodName,
            rate_amount: fallbackRate,
            is_free: false,
            display_order: 0,
          },
        ],
        appliedRate: {
          id: 'fallback',
          method_name: fallbackMethodName,
          rate_amount: fallbackRate,
          is_free: false,
          display_order: 0,
        },
        fallback_used: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    // PGRST205 / PGRST202 / 42P01 all mean "the shipping tables do not exist yet".
    // That is the expected state until the shipping-rate migration is applied, so we
    // treat it as an informational switch to the in-code rates rather than an outage.
    const code = error?.code || '';
    const notMigrated =
      code === 'PGRST205' ||
      code === 'PGRST202' ||
      code === '42P01' ||
      /Could not find the table 'public\.shipping_/.test(error?.message || '');

    if (notMigrated) {
      console.log('ℹ️ SHIPPING_SOURCE=code_fallback — shipping tables not migrated yet:', error?.message);
    } else {
      console.error('🔴 SHIPPING_DB_ERROR — database reachable but shipping lookup failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code,
      });
    }

    if (address?.country) {
      const staticResult = calculateStaticShipping(address, subtotal, rawAddress ?? address);
      return new Response(
        JSON.stringify({
          ...staticResult,
          db_available: false,
          db_status: notMigrated ? 'not_migrated' : 'error',
          db_error: error?.message || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }

      );
    }


    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to calculate shipping',
        errorType: error.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: error.message?.includes('required') ? 400 : 500 
      }
    );
  }
});
