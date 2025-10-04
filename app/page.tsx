'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Palette, Circle as CircleIcon, Sparkles, Layers, Type } from 'lucide-react';

export default function CirclePNG() {
  const [size, setSize] = useState(300);
  const [fillColor, setFillColor] = useState('#ff6b6b');
  const [opacity, setOpacity] = useState(100);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(0);
  const [shadowColor, setShadowColor] = useState('#00000080');
  
  const [useGradient, setUseGradient] = useState(false);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientColor1, setGradientColor1] = useState('#ff6b6b');
  const [gradientColor2, setGradientColor2] = useState('#4dabf7');
  const [gradientAngle, setGradientAngle] = useState(45);
  
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState('YOUR TEXT');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState<'300' | '400' | '700'>('700');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom' | 'curved'>('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textOffsetY, setTextOffsetY] = useState(0);
  const [textOffsetX, setTextOffsetX] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawCircle();
  }, [size, fillColor, opacity, borderWidth, borderColor, shadowBlur, shadowX, shadowY, shadowColor, 
      useGradient, gradientType, gradientColor1, gradientColor2, gradientAngle,
      showText, text, textColor, fontSize, fontFamily, fontWeight, textPosition, letterSpacing, textOffsetY, textOffsetX]);

  const drawCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxShadowOffset = Math.max(Math.abs(shadowX), Math.abs(shadowY));
    const canvasSize = size + shadowBlur * 2 + borderWidth * 2 + maxShadowOffset * 2 + 100;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = size / 2;

    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowX;
    ctx.shadowOffsetY = shadowY;
    ctx.shadowColor = shadowColor;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    if (useGradient) {
      let gradient;
      if (gradientType === 'linear') {
        const angleRad = (gradientAngle * Math.PI) / 180;
        const x1 = centerX - radius * Math.cos(angleRad);
        const y1 = centerY - radius * Math.sin(angleRad);
        const x2 = centerX + radius * Math.cos(angleRad);
        const y2 = centerY + radius * Math.sin(angleRad);
        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      } else {
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      }
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = fillColor;
    }
    
    ctx.globalAlpha = opacity / 100;
    ctx.fill();
    ctx.globalAlpha = 1;

    if (borderWidth > 0) {
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
    }

    if (showText && text) {
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = textColor;
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (textPosition === 'curved') {
        drawCurvedText(ctx, text, centerX + textOffsetX, centerY, radius - fontSize / 2, letterSpacing);
      } else {
        let yPos = centerY;
        if (textPosition === 'top') {
          yPos = centerY - radius / 2;
        } else if (textPosition === 'bottom') {
          yPos = centerY + radius / 2;
        }
        yPos += textOffsetY;
        const xPos = centerX + textOffsetX;
        ctx.fillText(text, xPos, yPos);
      }
    }
  };

  const drawCurvedText = (ctx: CanvasRenderingContext2D, text: string, centerX: number, centerY: number, radius: number, spacing: number) => {
    const angleDecrement = (Math.PI * 2) / text.length;
    const startAngle = -Math.PI / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    
    for (let i = 0; i < text.length; i++) {
      const angle = startAngle + angleDecrement * i + (spacing * i * Math.PI / 180);
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -radius);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    
    ctx.restore();
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = Date.now();
      a.download = `circle-png-${size}px-${timestamp}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const fonts = [
    'Arial',
    'Futura',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Palatino'
  ];

  const presetColors = [
    { name: 'Red', color: '#ff6b6b' },
    { name: 'Blue', color: '#4dabf7' },
    { name: 'Green', color: '#51cf66' },
    { name: 'Yellow', color: '#ffd43b' },
    { name: 'Purple', color: '#9775fa' },
    { name: 'Orange', color: '#ff922b' },
    { name: 'Pink', color: '#ff6b9d' },
    { name: 'Teal', color: '#20c997' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#ffffff' },
    { name: 'Gray', color: '#868e96' },
  ];

  const presetCircles = [
    { 
      name: 'Solid Red', 
      fill: '#ff6b6b', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#ff6b6b',
      gradColor2: '#4dabf7',
      gradAngle: 45
    },
    { 
      name: 'Blue Gradient', 
      fill: '#4dabf7', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: true,
      gradType: 'linear' as const,
      gradColor1: '#4dabf7',
      gradColor2: '#1971c2',
      gradAngle: 135
    },
    { 
      name: 'Sunset Radial', 
      fill: '#ff6b6b', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: true,
      gradType: 'radial' as const,
      gradColor1: '#ffd43b',
      gradColor2: '#ff6b6b',
      gradAngle: 0
    },
    { 
      name: 'Green Ring', 
      fill: '#ffffff00', 
      border: 8, 
      borderColor: '#51cf66', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#51cf66',
      gradColor2: '#2f9e44',
      gradAngle: 45
    },
    { 
      name: 'Drop Shadow', 
      fill: '#9775fa', 
      border: 0, 
      borderColor: '#000', 
      shadow: 15,
      shadowX: 5,
      shadowY: 5,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#9775fa',
      gradColor2: '#6741d9',
      gradAngle: 45
    },
    { 
      name: 'Glow Effect', 
      fill: '#ffd43b', 
      border: 0, 
      borderColor: '#000', 
      shadow: 25,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#ffd43b',
      gradColor2: '#fab005',
      gradAngle: 45
    },
    { 
      name: 'Ocean Gradient', 
      fill: '#20c997', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: true,
      gradType: 'linear' as const,
      gradColor1: '#20c997',
      gradColor2: '#4dabf7',
      gradAngle: 90
    },
    { 
      name: 'Transparent', 
      fill: '#ff6b6b', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 50,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#ff6b6b',
      gradColor2: '#fa5252',
      gradAngle: 45
    },
    { 
      name: 'Neon Pink', 
      fill: '#ff6b9d', 
      border: 3, 
      borderColor: '#ff6b9d', 
      shadow: 20,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#ff6b9d',
      gradColor2: '#f783ac',
      gradAngle: 45
    },
    { 
      name: 'Fire Radial', 
      fill: '#ff922b', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: true,
      gradType: 'radial' as const,
      gradColor1: '#ffd43b',
      gradColor2: '#ff922b',
      gradAngle: 0
    },
    { 
      name: 'Purple Fade', 
      fill: '#9775fa', 
      border: 0, 
      borderColor: '#000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 80,
      gradient: true,
      gradType: 'linear' as const,
      gradColor1: '#9775fa',
      gradColor2: '#6741d9',
      gradAngle: 180
    },
    { 
      name: 'Black Outline', 
      fill: '#ffffff00', 
      border: 6, 
      borderColor: '#000000', 
      shadow: 0,
      shadowX: 0,
      shadowY: 0,
      opacity: 100,
      gradient: false,
      gradType: 'linear' as const,
      gradColor1: '#000000',
      gradColor2: '#495057',
      gradAngle: 45
    },
  ];

  const loadPreset = (preset: typeof presetCircles[0]) => {
    setFillColor(preset.fill);
    setBorderWidth(preset.border);
    setBorderColor(preset.borderColor);
    setShadowBlur(preset.shadow);
    setShadowX(preset.shadowX);
    setShadowY(preset.shadowY);
    setOpacity(preset.opacity);
    setUseGradient(preset.gradient);
    setGradientType(preset.gradType);
    setGradientColor1(preset.gradColor1);
    setGradientColor2(preset.gradColor2);
    setGradientAngle(preset.gradAngle);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-rose-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Circle PNG Generator with Text",
            "description": "Create circle PNG images with text, gradients, shadows, and transparent backgrounds",
            "url": "https://circlepng.com",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Circle PNG Generator with Text
          </h1>
          <p className="text-xl text-orange-100 mb-6">
            Create custom circle PNG images with text, gradients, shadows, and transparent backgrounds
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-center space-x-8 text-sm font-medium">
            <a href="#generator" className="text-gray-700 hover:text-orange-600 transition-colors">Generator</a>
            <a href="#presets" className="text-gray-700 hover:text-orange-600 transition-colors">Presets</a>
            <a href="#guide" className="text-gray-700 hover:text-orange-600 transition-colors">How to Use</a>
            <a href="#faq" className="text-gray-700 hover:text-orange-600 transition-colors">FAQ</a>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div id="generator" className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-600" />
            Custom Circle PNG Generator
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-orange-600" />
                  Circle Design
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {size}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="500"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      aria-label="Adjust circle PNG size in pixels"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="useGradient"
                        checked={useGradient}
                        onChange={(e) => setUseGradient(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <label htmlFor="useGradient" className="text-sm font-medium text-gray-700">
                        Use Gradient Fill
                      </label>
                    </div>

                    {useGradient ? (
                      <div className="space-y-4 pl-7">
                        <div className="flex gap-3">
                          <button
                            onClick={() => setGradientType('linear')}
                            className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                              gradientType === 'linear'
                                ? 'border-orange-600 bg-orange-50 text-orange-900'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            Linear
                          </button>
                          <button
                            onClick={() => setGradientType('radial')}
                            className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                              gradientType === 'radial'
                                ? 'border-orange-600 bg-orange-50 text-orange-900'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            Radial
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="color"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            className="h-10 w-full rounded cursor-pointer"
                            aria-label="Select first gradient color for circle PNG"
                          />
                          <input
                            type="color"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            className="h-10 w-full rounded cursor-pointer"
                            aria-label="Select second gradient color for circle PNG"
                          />
                        </div>

                        {gradientType === 'linear' && (
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Angle: {gradientAngle}°
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={gradientAngle}
                              onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              aria-label="Adjust gradient angle for linear gradient circle PNG"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                            className="h-12 w-20 rounded cursor-pointer"
                            aria-label="Select solid fill color for circle PNG"
                          />
                          <input
                            type="text"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                            placeholder="#ff6b6b"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {presetColors.map((preset) => (
                            <button
                              key={preset.color}
                              onClick={() => setFillColor(preset.color)}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-orange-500 transition-colors"
                              style={{ backgroundColor: preset.color }}
                              title={`${preset.name} circle PNG`}
                              aria-label={`Select ${preset.name.toLowerCase()} color for circle PNG`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opacity: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      aria-label="Adjust transparency opacity for circle PNG"
                    />
                    <p className="text-xs text-gray-500 mt-1">Create transparent circle PNG images</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border: {borderWidth}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={borderWidth}
                      onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      aria-label="Adjust border width for circle PNG outline"
                    />
                    {borderWidth > 0 && (
                      <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer mt-2"
                        aria-label="Select border color for circle PNG outline"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shadow Blur: {shadowBlur}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={shadowBlur}
                      onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      aria-label="Adjust drop shadow blur for circle PNG"
                    />
                    {shadowBlur > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">X: {shadowX}px</label>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            value={shadowX}
                            onChange={(e) => setShadowX(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            aria-label="Adjust horizontal shadow position for circle PNG"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Y: {shadowY}px</label>
                          <input
                            type="range"
                            min="-30"
                            max="30"
                            value={shadowY}
                            onChange={(e) => setShadowY(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            aria-label="Adjust vertical shadow position for circle PNG"
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Position drop shadow on your circle PNG</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="showText"
                    checked={showText}
                    onChange={(e) => setShowText(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <label htmlFor="showText" className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Type className="w-5 h-5 text-orange-600" />
                    Add Text
                  </label>
                </div>

                {showText && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Content
                      </label>
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                        placeholder="Enter your text"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Family
                        </label>
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Weight
                        </label>
                        <select
                          value={fontWeight}
                          onChange={(e) => setFontWeight(e.target.value as any)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        >
                          <option value="300">Light</option>
                          <option value="400">Normal</option>
                          <option value="700">Bold</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size: {fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-12 w-20 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Position
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['top', 'center', 'bottom', 'curved'] as const).map((pos) => (
                          <button
                            key={pos}
                            onClick={() => setTextPosition(pos)}
                            className={`px-4 py-2 rounded-lg border-2 capitalize transition-colors ${
                              textPosition === pos
                                ? 'border-orange-600 bg-orange-50 text-orange-900'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    {textPosition === 'curved' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Letter Spacing: {letterSpacing}
                        </label>
                        <input
                          type="range"
                          min="-5"
                          max="20"
                          value={letterSpacing}
                          onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}

                    {textPosition !== 'curved' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vertical Offset: {textOffsetY}px
                          </label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={textOffsetY}
                            onChange={(e) => setTextOffsetY(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horizontal Offset: {textOffsetX}px
                          </label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={textOffsetX}
                            onChange={(e) => setTextOffsetX(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:h-fit">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CircleIcon className="w-5 h-5 text-orange-600" />
                Preview & Download
              </h3>

              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[500px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>

              <button
                onClick={downloadPNG}
                className="w-full mt-6 bg-gradient-to-r from-orange-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                aria-label="Download custom circle PNG with transparent background"
              >
                <Download className="w-5 h-5" />
                Download Circle PNG
              </button>

              <p className="text-sm text-gray-500 text-center mt-3">
                Transparent background • Free forever
              </p>
            </div>
          </div>
        </div>

        <div id="presets" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Circle PNG Presets</h2>
          <p className="text-gray-700 mb-6">Click any preset to load it into the generator, then customize and download your circle PNG.</p>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {presetCircles.map((preset) => (
              <button
                key={preset.name}
                onClick={() => loadPreset(preset)}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors"
                aria-label={`Load ${preset.name.toLowerCase()} circle PNG preset`}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100">
                  <div
                    className="w-16 h-16 rounded-full"
                    style={{
                      backgroundColor: preset.gradient ? 'transparent' : preset.fill,
                      background: preset.gradient 
                        ? preset.gradType === 'linear'
                          ? `linear-gradient(${preset.gradAngle}deg, ${preset.gradColor1}, ${preset.gradColor2})`
                          : `radial-gradient(circle, ${preset.gradColor1}, ${preset.gradColor2})`
                        : undefined,
                      opacity: preset.opacity / 100,
                      border: preset.border > 0 ? `${preset.border}px solid ${preset.borderColor}` : 'none',
                      boxShadow: preset.shadow > 0 ? `${preset.shadowX}px ${preset.shadowY}px ${preset.shadow}px rgba(0,0,0,0.3)` : 'none'
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div id="guide" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <article className="max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Create Circle PNG Images with Gradients, Shadows, and Text
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              Creating professional circle PNG images with transparent backgrounds, gradient fills, drop shadows, and custom text is now effortless with our free generator. Whether you need solid color circles, gradient circles, transparent circles, or circles with positioned shadows and curved text, this tool provides complete creative control with instant downloads.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Creating Gradient Circle PNG Images
            </h3>

            <p className="text-gray-700 leading-relaxed mb-4">
              Gradient circles add depth and visual interest to your designs. Check the "Use Gradient Fill" option to access gradient controls. Choose between linear gradients (directional color transitions) or radial gradients (center-to-edge color transitions). Select two colors and adjust the angle for linear gradients to create stunning effects.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Linear gradients work perfectly for modern UI elements, buttons, and badges. Radial gradients create depth effects ideal for logos, icons, and decorative elements. Combine gradient circles with transparency for even more creative possibilities.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Adding Drop Shadows to Circle PNG Files
            </h3>

            <p className="text-gray-700 leading-relaxed mb-4">
              Drop shadows make your circles appear elevated and three-dimensional. Adjust the shadow blur to control the softness of the shadow. Use the Shadow X and Shadow Y sliders to position the shadow, creating the illusion of light coming from different directions. Positive X values push shadows right, positive Y values push shadows down.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              For a glow effect, set both X and Y to 0 with high blur. For realistic drop shadows, use small positive values for both X and Y (like 5px each) with moderate blur. The shadow creates depth without requiring additional image layers or editing software.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Creating Transparent Circle PNG Images
            </h3>

            <p className="text-gray-700 leading-relaxed mb-4">
              The opacity slider controls transparency from 0% (fully transparent) to 100% (fully opaque). Transparent circles work beautifully for overlay effects, watermarks, and layered designs. All circles maintain transparent backgrounds outside the circle shape regardless of the opacity setting.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Combine transparency with gradients for sophisticated effects. A semi-transparent gradient circle creates subtle, elegant design elements perfect for modern web design, app interfaces, and presentation graphics.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Adding Custom Text to Circle PNG Images
            </h3>

            <p className="text-gray-700 leading-relaxed mb-4">
              Enable text with the "Add Text" checkbox. Enter your text, choose from 11 fonts including Arial, Futura, and Helvetica, adjust size (12-120px), weight (light/normal/bold), and color. Position text at top, center, bottom, or use curved mode to wrap text around the circle edge.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Use horizontal and vertical offset sliders for pixel-perfect text positioning. Curved text is ideal for badges, seals, and logos. Adjust letter spacing to control the arc spread. Combine text with gradients and shadows for professional badge designs.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Common Uses for Circle PNG Images
            </h3>

            <div className="space-y-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Profile Pictures and Avatars</h4>
                <p className="text-gray-700 text-sm">Create circular frames for social media profiles. Most platforms display profile pictures in circles, making circle PNG files the perfect format. Add text for personalized badges.</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Website Design Elements</h4>
                <p className="text-gray-700 text-sm">Use circle PNG images for buttons, icons, badges, decorative elements, and navigation indicators. Transparent backgrounds ensure perfect integration with any site design.</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Logo Design and Branding</h4>
                <p className="text-gray-700 text-sm">Gradient circle PNG files work excellently as logo backgrounds, brand badges, and corporate seals. Add curved text for professional business logos and emblems.</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">App UI and Mobile Design</h4>
                <p className="text-gray-700 text-sm">Create notification dots, status indicators, circular buttons, and menu elements. Drop shadows add depth to flat designs. Text circles work as app icons.</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Social Media Graphics</h4>
                <p className="text-gray-700 text-sm">Design attention-grabbing story highlights, profile badges, and post graphics. Gradient circles with text create eye-catching social media content.</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Presentation Graphics</h4>
                <p className="text-gray-700 text-sm">PowerPoint and Keynote presentations benefit from clean circle graphics. Use circles to highlight key points, create diagrams, or add visual interest with gradients and shadows.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Why Use PNG Format for Circles?
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              PNG (Portable Network Graphics) is the ideal format for circle images because it supports transparency. Unlike JPG, which always has a rectangular background, PNG allows the area outside the circle to be fully transparent. This means your circle will blend perfectly with any background - dark, light, colorful, or even another image.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Additionally, PNG uses lossless compression, meaning your circle edges remain crisp and smooth without the compression artifacts that JPG creates. For graphics, logos, and UI elements, PNG quality is superior to JPG, especially for solid colors and sharp edges like circles.
            </p>

            <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Circle PNG Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">How do I create gradient circle PNG images?</p>
                <p className="text-gray-700">Check the "Use Gradient Fill" option in the generator. Choose between linear or radial gradients, select two colors, and adjust the angle for linear gradients. Download your custom gradient circle PNG instantly with transparent background.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Can I add drop shadows to circle PNG files?</p>
                <p className="text-gray-700">Yes. Use the Shadow Blur slider to control shadow intensity. Adjust Shadow X and Shadow Y to position the shadow in any direction. Create realistic drop shadows or glowing effects for your circle PNG images.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">How do I make transparent circle PNG images?</p>
                <p className="text-gray-700">Use the Opacity slider to adjust transparency from 0-100%. All circles have transparent backgrounds outside the circle shape. Combine with gradients for advanced transparency effects in your circle PNG downloads.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">How do I add text to circle PNG images?</p>
                <p className="text-gray-700">Check "Add Text" to enable text controls. Enter your text, choose font (11 options including Futura), size, color, and position. Use curved mode to wrap text around the circle edge. Adjust X/Y offsets for precise positioning.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Can I make curved text around a circle?</p>
                <p className="text-gray-700">Yes. Select "Curved" as text position. Text wraps around the circle edge. Adjust letter spacing to control the curve. Perfect for badges, seals, and circular logos with text.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Are these circle PNG images free for commercial use?</p>
                <p className="text-gray-700">Yes. All generated circle PNG files are completely free for personal and commercial projects. No attribution required. Use them in logos, websites, apps, or any design work.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">What is the difference between linear and radial gradients?</p>
                <p className="text-gray-700">Linear gradients transition colors in a straight line at an angle you specify. Radial gradients transition from the center outward in a circular pattern. Both create professional gradient circle PNG images.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Can I create circle PNG images with outlines only?</p>
                <p className="text-gray-700">Yes. Set the Border Width slider to your desired thickness and reduce opacity to 0% for a transparent fill. This creates perfect circle outline PNG images with transparent centers.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">What size circle PNG should I create?</p>
                <p className="text-gray-700">For icons: 64-128px. For profile pictures: 400-500px. For logos: 300-500px. Always create larger than needed - you can scale down without quality loss in PNG format.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Do I need design software to create circle PNG files?</p>
                <p className="text-gray-700">No. This generator creates professional circle PNG images directly in your browser. No Photoshop, Illustrator, or other software required. Instant downloads with transparent backgrounds.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Can I create neon or glow circle PNG effects?</p>
                <p className="text-gray-700">Yes. Set Shadow Blur high (20-30px) with Shadow X and Y at 0. Match shadow color to fill color. This creates glowing neon circle PNG images perfect for modern designs.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Why use this generator instead of stock circle PNG sites?</p>
                <p className="text-gray-700">Instant customization. Create exactly the circle PNG you need - size, color, gradient, shadow, text, transparency - in 30 seconds. No searching, no signup, no waiting. Complete creative control over every aspect.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">How do I position text precisely on circles?</p>
                <p className="text-gray-700">Use vertical and horizontal offset sliders for pixel-perfect text positioning. Works with top, center, and bottom text positions. Offsets range from -100px to +100px for complete control over text placement on your circle PNG.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">What fonts are available for circle PNG text?</p>
                <p className="text-gray-700">Choose from 11 web-safe fonts: Arial, Futura, Helvetica, Times New Roman, Georgia, Verdana, Courier New, Comic Sans MS, Impact, Trebuchet MS, and Palatino. All render perfectly in PNG downloads.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold text-gray-900 mb-2">Does the PNG have a transparent background?</p>
                <p className="text-gray-700">Yes, all downloaded circles have transparent backgrounds (alpha channel). The area outside the circle is completely transparent, allowing the circle to blend with any background in your designs.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Tips for Perfect Circle PNGs
            </h2>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-4">
              <p className="font-semibold text-orange-900 mb-2">Start larger than you need</p>
              <p className="text-gray-700">Always create circles at the maximum size you might need. It is easy to scale down without losing quality, but scaling up makes edges fuzzy. Generate at 500px if you are unsure about final usage.</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-4">
              <p className="font-semibold text-orange-900 mb-2">Use hex codes for brand colors</p>
              <p className="text-gray-700">If you are matching brand colors, use the exact hex code from your brand guidelines. Type it into the color field for perfect color matching across all your brand materials and circle PNG graphics.</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-4">
              <p className="font-semibold text-orange-900 mb-2">Test on different backgrounds</p>
              <p className="text-gray-700">Before finalizing, place your circle on light and dark backgrounds to ensure it looks good everywhere. Light circles need enough contrast to show on light backgrounds. Test shadow visibility on various backgrounds.</p>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 mb-4">
              <p className="font-semibold text-orange-900 mb-2">Combine features for unique effects</p>
              <p className="text-gray-700">Mix gradients with transparency for subtle overlays. Add shadows to gradient circles for depth. Combine curved text with radial gradients for professional badges. Experiment with feature combinations for unique circle PNG designs.</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Conclusion
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              Creating professional circle PNG images with gradients, drop shadows, custom text, and transparent backgrounds no longer requires expensive design software or hours of work. This free generator provides instant results with complete creative control over every aspect of your circle design.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Whether you need simple solid circles, sophisticated gradient circles, transparent circle PNG files with positioned shadows, or professional badges with curved text, the generator above handles it all. Download unlimited circle PNG images for any project - web design, app development, branding, presentations, social media, and more.
            </p>
          </article>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Circle PNG Generator</h2>
          <p className="text-gray-400 mb-6">Free Circle PNG with Text • Gradients • Shadows • Transparent Backgrounds</p>
          
          <div className="border-t border-gray-800 pt-6 text-xs text-gray-500">
            <p>© 2025 CirclePNG.com - Free circle PNG images with text for personal and commercial use.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}