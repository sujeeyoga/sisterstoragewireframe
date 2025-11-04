import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://sisterstorage.ca');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Layout>
      <Helmet>
        <title>QR Code Generator - Sister Storage</title>
        <meta name="description" content="Generate custom QR codes for your website or business" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">QR Code Generator</h1>
            </div>
            <p className="text-muted-foreground text-lg">Create custom QR codes instantly</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Controls */}
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  URL or Text
                </Label>
                <Input
                  id="url"
                  type="text"
                  placeholder="Enter URL or text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">
                  Size: {size}px
                </Label>
                <Slider
                  id="size"
                  min={128}
                  max={512}
                  step={32}
                  value={[size]}
                  onValueChange={(values) => setSize(values[0])}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fgColor">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fgColor"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={downloadQRCode} 
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </Card>

            {/* Right side - Preview */}
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-center">Preview</h3>
              </div>
              <div 
                className="p-8 rounded-2xl shadow-lg"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  id="qr-code-svg"
                  value={url || 'https://sisterstorage.ca'}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan to test your QR code
              </p>
            </Card>
          </div>

          {/* Quick presets */}
          <Card className="p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Quick Presets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  setFgColor('#6366f1');
                  setBgColor('#ffffff');
                }}
              >
                Brand
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFgColor('#059669');
                  setBgColor('#f0fdf4');
                }}
              >
                Green
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default QRCodeGenerator;
