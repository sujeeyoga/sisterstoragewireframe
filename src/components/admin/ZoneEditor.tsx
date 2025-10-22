import { useState, useEffect } from 'react';
import { useShippingZones } from '@/hooks/useShippingZones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface ZoneEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zoneId?: string | null;
}

export const ZoneEditor = ({ open, onOpenChange, zoneId }: ZoneEditorProps) => {
  const { zones, createZone, isCreating } = useShippingZones();
  const [step, setStep] = useState(1);
  
  // Zone details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('200');

  // Rules
  const [rules, setRules] = useState<Array<{ rule_type: string; rule_value: string }>>([]);
  const [newRuleType, setNewRuleType] = useState('country');
  const [newRuleValue, setNewRuleValue] = useState('');

  // Rates
  const [rates, setRates] = useState<
    Array<{
      method_name: string;
      rate_type: string;
      rate_amount: string;
      free_threshold?: string;
    }>
  >([]);
  const [newRate, setNewRate] = useState({
    method_name: '',
    rate_type: 'flat_rate',
    rate_amount: '',
    free_threshold: '',
  });

  useEffect(() => {
    if (zoneId && zones) {
      const zone = zones.find((z) => z.id === zoneId);
      if (zone) {
        setName(zone.name);
        setDescription(zone.description || '');
        setPriority(zone.priority.toString());
        setRules(zone.rules.map((r) => ({ rule_type: r.rule_type, rule_value: r.rule_value })));
        setRates(
          zone.rates.map((r) => ({
            method_name: r.method_name,
            rate_type: r.rate_type,
            rate_amount: r.rate_amount.toString(),
            free_threshold: r.free_threshold?.toString() || '',
          }))
        );
      }
    }
  }, [zoneId, zones]);

  const resetForm = () => {
    setStep(1);
    setName('');
    setDescription('');
    setPriority('200');
    setRules([]);
    setRates([]);
    setNewRuleType('country');
    setNewRuleValue('');
    setNewRate({
      method_name: '',
      rate_type: 'flat_rate',
      rate_amount: '',
      free_threshold: '',
    });
  };

  const handleAddRule = () => {
    if (newRuleValue.trim()) {
      setRules([...rules, { rule_type: newRuleType, rule_value: newRuleValue.trim() }]);
      setNewRuleValue('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleAddRate = () => {
    if (newRate.method_name.trim() && newRate.rate_amount) {
      setRates([...rates, { ...newRate }]);
      setNewRate({
        method_name: '',
        rate_type: 'flat_rate',
        rate_amount: '',
        free_threshold: '',
      });
    }
  };

  const handleRemoveRate = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    createZone({
      name,
      description,
      priority: parseInt(priority),
      rules,
      rates: rates.map((rate, index) => ({
        method_name: rate.method_name,
        rate_type: rate.rate_type,
        rate_amount: parseFloat(rate.rate_amount),
        free_threshold: rate.free_threshold ? parseFloat(rate.free_threshold) : undefined,
        display_order: index,
      })),
    });
    resetForm();
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return rules.length > 0;
    if (step === 3) return rates.length > 0;
    return true;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {zoneId ? 'Edit' : 'Create'} Shipping Zone - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Zone Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ontario, Quebec, USA"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher priority zones are matched first (200 = province, 300 = city)
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Geographic Rules *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Add rules to define which addresses match this zone
                </p>

                <div className="flex gap-2 mb-3">
                  <Select value={newRuleType} onValueChange={setNewRuleType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="province">Province</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="postal_code_pattern">Postal Code Pattern</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    value={newRuleValue}
                    onChange={(e) => setNewRuleValue(e.target.value)}
                    placeholder={
                      newRuleType === 'postal_code_pattern'
                        ? 'e.g., M* or M4C*'
                        : 'e.g., CA, ON, Toronto'
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                  />

                  <Button onClick={handleAddRule} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {rules.map((rule, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {rule.rule_type}: {rule.rule_value}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveRule(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Shipping Methods *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Add shipping rate options for this zone
                </p>

                <div className="space-y-3 mb-3">
                  <Input
                    value={newRate.method_name}
                    onChange={(e) => setNewRate({ ...newRate, method_name: e.target.value })}
                    placeholder="Method name (e.g., Standard Shipping)"
                  />

                  <div className="flex gap-2">
                    <Select
                      value={newRate.rate_type}
                      onValueChange={(value) => setNewRate({ ...newRate, rate_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flat_rate">Flat Rate</SelectItem>
                        <SelectItem value="free_threshold">Free Over Threshold</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      step="0.01"
                      value={newRate.rate_amount}
                      onChange={(e) => setNewRate({ ...newRate, rate_amount: e.target.value })}
                      placeholder="Rate amount"
                    />

                    {newRate.rate_type === 'free_threshold' && (
                      <Input
                        type="number"
                        step="0.01"
                        value={newRate.free_threshold}
                        onChange={(e) =>
                          setNewRate({ ...newRate, free_threshold: e.target.value })
                        }
                        placeholder="Free over $"
                      />
                    )}

                    <Button onClick={handleAddRate} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{rate.method_name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${rate.rate_amount}
                          {rate.rate_type === 'free_threshold' &&
                            rate.free_threshold &&
                            ` (Free over $${rate.free_threshold})`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRate(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={!canProceed() || isCreating}>
              {isCreating ? 'Creating...' : 'Create Zone'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
