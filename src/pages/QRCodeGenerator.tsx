import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateUniqueShortCode, buildShortUrl } from '@/lib/qrCodeUtils';
import { useNavigate } from 'react-router-dom';
import { Copy } from 'lucide-react';

export default function QRCodeGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'static' | 'dynamic'>('static');
  
  // Static QR state
  const [url, setUrl] = useState('https://sisterstorage.ca');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Dynamic QR state
  const [qrName, setQrName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [createdQR, setCreatedQR] = useState<{ shortCode: string; shortUrl: string } | null>(null);

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      return data === true;
    },
  });

  // Create dynamic QR mutation
  const createDynamicQR = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const shortCode = await generateUniqueShortCode();
      const { error } = await supabase.from('qr_codes').insert({
        short_code: shortCode,
        name: qrName,
        destination_url: destinationUrl,
        created_by: user.id,
        is_active: true,
      });

      if (error) throw error;

      return { shortCode, shortUrl: buildShortUrl(shortCode) };
    },
    onSuccess: (data) => {
      setCreatedQR(data);
      toast.success('Dynamic QR code created!');
    },
    onError: (error: Error) => {
      toast.error('Error creating QR code: ' + error.message);
    },
  });

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code') as unknown as SVGSVGElement;
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyShortUrl = () => {
    if (createdQR) {
      navigator.clipboard.writeText(createdQR.shortUrl);
      toast.success('Short URL copied!');
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>QR Code Generator - Sister Storage</title>
        <meta name="description" content="Create custom QR codes for your business" />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">QR Code Generator</h1>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'static' | 'dynamic')} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="static">Static QR Code</TabsTrigger>
            <TabsTrigger value="dynamic" disabled={!isAdmin}>
              Dynamic QR Code {!isAdmin && '(Admin Only)'}
            </TabsTrigger>
          </TabsList>

          {/* Static QR Code Tab */}
          <TabsContent value="static">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">URL or Text</Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://sisterstorage.ca"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Size: {size}px</Label>
                  <Slider
                    value={[size]}
                    onValueChange={(values) => setSize(values[0])}
                    min={128}
                    max={512}
                    step={32}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fgColor">Foreground</Label>
                    <div className="flex gap-2">
                      <Input
                        id="fgColor"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bgColor">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bgColor"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFgColor('#000000');
                        setBgColor('#ffffff');
                      }}
                    >
                      Classic
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFgColor('#ffffff');
                        setBgColor('#000000');
                      }}
                    >
                      Inverted
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFgColor('#DC2626');
                        setBgColor('#FEE2E2');
                      }}
                    >
                      Red
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFgColor('#2563EB');
                        setBgColor('#DBEAFE');
                      }}
                    >
                      Blue
                    </Button>
                  </div>
                </div>

                <Button onClick={downloadQRCode} className="w-full">
                  Download QR Code
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-8 bg-white rounded-lg shadow-lg">
                  <QRCodeSVG
                    id="qr-code"
                    value={url}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="M"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code to test it
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Dynamic QR Code Tab */}
          <TabsContent value="dynamic">
            {createdQR ? (
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-semibold mb-4">QR Code Created Successfully!</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Short URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={createdQR.shortUrl} readOnly />
                        <Button variant="outline" size="icon" onClick={handleCopyShortUrl}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center py-6">
                      <div className="p-8 bg-white rounded-lg shadow-lg">
                        <QRCodeSVG
                          id="dynamic-qr-code"
                          value={createdQR.shortUrl}
                          size={256}
                          level="M"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => {
                          const svg = document.getElementById('dynamic-qr-code') as unknown as SVGSVGElement;
                          if (svg) {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;
                            
                            const svgData = new XMLSerializer().serializeToString(svg);
                            const img = new Image();
                            img.onload = () => {
                              canvas.width = img.width;
                              canvas.height = img.height;
                              ctx.drawImage(img, 0, 0);
                              canvas.toBlob((blob) => {
                                if (!blob) return;
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `qr-${createdQR.shortCode}.png`;
                                link.click();
                                URL.revokeObjectURL(url);
                              });
                            };
                            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                          }
                        }}
                        className="flex-1"
                      >
                        Download QR Code
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/admin/qr-codes')}
                        className="flex-1"
                      >
                        Manage QR Codes
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCreatedQR(null);
                        setQrName('');
                        setDestinationUrl('');
                      }}
                      className="w-full"
                    >
                      Create Another
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="qr-name">QR Code Name</Label>
                    <Input
                      id="qr-name"
                      value={qrName}
                      onChange={(e) => setQrName(e.target.value)}
                      placeholder="e.g., Holiday 2025 Promo"
                    />
                    <p className="text-xs text-muted-foreground">
                      A friendly name to identify this QR code
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination URL</Label>
                    <Input
                      id="destination"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://sisterstorage.ca/shop"
                    />
                    <p className="text-xs text-muted-foreground">
                      Where should this QR code redirect to? You can change this later.
                    </p>
                  </div>

                  <Button 
                    onClick={() => createDynamicQR.mutate()}
                    disabled={!qrName || !destinationUrl || createDynamicQR.isPending}
                    className="w-full"
                  >
                    {createDynamicQR.isPending ? 'Creating...' : 'Create Dynamic QR Code'}
                  </Button>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-semibold">Dynamic QR Benefits</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✅ Change destination URL anytime</li>
                    <li>✅ Track scan analytics</li>
                    <li>✅ Enable/disable campaigns</li>
                    <li>✅ No need to reprint QR codes</li>
                    <li>✅ Perfect for marketing campaigns</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
