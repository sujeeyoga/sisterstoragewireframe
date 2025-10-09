import { useState, useEffect } from 'react';
import { useStallionShipping } from '@/hooks/useStallionShipping';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, Truck, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShippingManager = () => {
  const { loading, getRates, createShipment, getPostageTypes } = useStallionShipping();
  const { toast } = useToast();
  const [postageTypes, setPostageTypes] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [selectedRate, setSelectedRate] = useState<string>('');
  
  const [fromAddress, setFromAddress] = useState({
    name: '',
    street1: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'CA',
    phone: '',
    email: '',
  });

  const [toAddress, setToAddress] = useState({
    name: '',
    street1: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'CA',
    phone: '',
    email: '',
  });

  const [packageInfo, setPackageInfo] = useState({
    weight: 1,
    length: 10,
    width: 10,
    height: 10,
  });

  useEffect(() => {
    loadPostageTypes();
  }, []);

  const loadPostageTypes = async () => {
    try {
      const types = await getPostageTypes();
      setPostageTypes(types.postage_types || []);
    } catch (error) {
      console.error('Failed to load postage types:', error);
    }
  };

  const handleGetRates = async () => {
    try {
      const result = await getRates({
        from: fromAddress,
        to: toAddress,
        packages: [{
          weight: packageInfo.weight,
          length: packageInfo.length,
          width: packageInfo.width,
          height: packageInfo.height,
          units: 'metric',
        }],
      });

      setRates(result.rates || []);
      toast({
        title: 'Success',
        description: `Found ${result.rates?.length || 0} shipping rates`,
      });
    } catch (error) {
      console.error('Failed to get rates:', error);
    }
  };

  const handleCreateShipment = async () => {
    if (!selectedRate) {
      toast({
        title: 'Error',
        description: 'Please select a shipping rate',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await createShipment({
        from: fromAddress,
        to: toAddress,
        packages: [{
          weight: packageInfo.weight,
          length: packageInfo.length,
          width: packageInfo.width,
          height: packageInfo.height,
          units: 'metric',
        }],
        postage_type: selectedRate,
      });

      console.log('Shipment created:', result);
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Shipping Manager</h2>
        <p className="text-muted-foreground">Create and manage Stallion Express shipments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* From Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              From Address
            </CardTitle>
            <CardDescription>Sender information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={fromAddress.name}
                onChange={(e) => setFromAddress({ ...fromAddress, name: e.target.value })}
                placeholder="Company or Person Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={fromAddress.street1}
                onChange={(e) => setFromAddress({ ...fromAddress, street1: e.target.value })}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={fromAddress.city}
                  onChange={(e) => setFromAddress({ ...fromAddress, city: e.target.value })}
                  placeholder="Toronto"
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={fromAddress.province}
                  onChange={(e) => setFromAddress({ ...fromAddress, province: e.target.value })}
                  placeholder="ON"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={fromAddress.postal_code}
                  onChange={(e) => setFromAddress({ ...fromAddress, postal_code: e.target.value })}
                  placeholder="M5V 3A8"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={fromAddress.country}
                  onChange={(e) => setFromAddress({ ...fromAddress, country: e.target.value })}
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={fromAddress.phone}
                  onChange={(e) => setFromAddress({ ...fromAddress, phone: e.target.value })}
                  placeholder="555-1234"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={fromAddress.email}
                  onChange={(e) => setFromAddress({ ...fromAddress, email: e.target.value })}
                  placeholder="sender@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* To Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              To Address
            </CardTitle>
            <CardDescription>Recipient information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={toAddress.name}
                onChange={(e) => setToAddress({ ...toAddress, name: e.target.value })}
                placeholder="Recipient Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={toAddress.street1}
                onChange={(e) => setToAddress({ ...toAddress, street1: e.target.value })}
                placeholder="456 Elm St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={toAddress.city}
                  onChange={(e) => setToAddress({ ...toAddress, city: e.target.value })}
                  placeholder="Vancouver"
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={toAddress.province}
                  onChange={(e) => setToAddress({ ...toAddress, province: e.target.value })}
                  placeholder="BC"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={toAddress.postal_code}
                  onChange={(e) => setToAddress({ ...toAddress, postal_code: e.target.value })}
                  placeholder="V6B 1A1"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={toAddress.country}
                  onChange={(e) => setToAddress({ ...toAddress, country: e.target.value })}
                  placeholder="CA"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={toAddress.phone}
                  onChange={(e) => setToAddress({ ...toAddress, phone: e.target.value })}
                  placeholder="555-5678"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={toAddress.email}
                  onChange={(e) => setToAddress({ ...toAddress, email: e.target.value })}
                  placeholder="recipient@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Info */}
      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>Dimensions in centimeters, weight in kilograms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                value={packageInfo.weight}
                onChange={(e) => setPackageInfo({ ...packageInfo, weight: parseFloat(e.target.value) })}
                step="0.1"
                min="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label>Length (cm)</Label>
              <Input
                type="number"
                value={packageInfo.length}
                onChange={(e) => setPackageInfo({ ...packageInfo, length: parseFloat(e.target.value) })}
                step="1"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Width (cm)</Label>
              <Input
                type="number"
                value={packageInfo.width}
                onChange={(e) => setPackageInfo({ ...packageInfo, width: parseFloat(e.target.value) })}
                step="1"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                value={packageInfo.height}
                onChange={(e) => setPackageInfo({ ...packageInfo, height: parseFloat(e.target.value) })}
                step="1"
                min="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button onClick={handleGetRates} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Rates...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Get Rates
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rates Display */}
      {rates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Shipping Rates</CardTitle>
            <CardDescription>Select a rate to create shipment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Shipping Rate</Label>
              <Select value={selectedRate} onValueChange={setSelectedRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shipping option" />
                </SelectTrigger>
                <SelectContent>
                  {rates.map((rate: any) => (
                    <SelectItem key={rate.postage_type} value={rate.postage_type}>
                      {rate.name} - ${rate.total_cost} ({rate.delivery_days} days)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateShipment} disabled={loading || !selectedRate} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Shipment...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Create Shipment
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingManager;
