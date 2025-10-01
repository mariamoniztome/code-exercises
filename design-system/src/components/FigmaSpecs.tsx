import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function FigmaSpecs() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, label)}
      className="h-8"
    >
      {copiedValue === label ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2>Figma Design Specifications</h2>
        <p className="text-muted-foreground mt-2">
          Complete specifications for recreating this design system in Figma. All values are ready to copy and paste.
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing & Layout</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette - Light Mode</CardTitle>
              <CardDescription>Primary colors for light theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ColorSpec
                  name="Background"
                  hex="#ffffff"
                  rgb="255, 255, 255"
                  cssVar="--background"
                  copyButton={<CopyButton text="#ffffff" label="bg-light" />}
                />
                <ColorSpec
                  name="Foreground"
                  hex="#252525"
                  rgb="37, 37, 37"
                  cssVar="--foreground"
                  copyButton={<CopyButton text="#252525" label="fg-light" />}
                />
                <ColorSpec
                  name="Primary"
                  hex="#030213"
                  rgb="3, 2, 19"
                  cssVar="--primary"
                  copyButton={<CopyButton text="#030213" label="primary-light" />}
                />
                <ColorSpec
                  name="Primary Foreground"
                  hex="#ffffff"
                  rgb="255, 255, 255"
                  cssVar="--primary-foreground"
                  copyButton={<CopyButton text="#ffffff" label="primary-fg-light" />}
                />
                <ColorSpec
                  name="Secondary"
                  hex="#f3f3f5"
                  rgb="243, 243, 245"
                  cssVar="--secondary"
                  copyButton={<CopyButton text="#f3f3f5" label="secondary-light" />}
                />
                <ColorSpec
                  name="Muted"
                  hex="#ececf0"
                  rgb="236, 236, 240"
                  cssVar="--muted"
                  copyButton={<CopyButton text="#ececf0" label="muted-light" />}
                />
                <ColorSpec
                  name="Muted Foreground"
                  hex="#717182"
                  rgb="113, 113, 130"
                  cssVar="--muted-foreground"
                  copyButton={<CopyButton text="#717182" label="muted-fg-light" />}
                />
                <ColorSpec
                  name="Accent"
                  hex="#e9ebef"
                  rgb="233, 235, 239"
                  cssVar="--accent"
                  copyButton={<CopyButton text="#e9ebef" label="accent-light" />}
                />
                <ColorSpec
                  name="Destructive"
                  hex="#d4183d"
                  rgb="212, 24, 61"
                  cssVar="--destructive"
                  copyButton={<CopyButton text="#d4183d" label="destructive-light" />}
                />
                <ColorSpec
                  name="Border"
                  hex="#e6e6e6"
                  rgb="230, 230, 230"
                  cssVar="--border"
                  usage="rgba(0, 0, 0, 0.1)"
                  copyButton={<CopyButton text="rgba(0, 0, 0, 0.1)" label="border-light" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Palette - Dark Mode</CardTitle>
              <CardDescription>Primary colors for dark theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <ColorSpec
                  name="Background"
                  hex="#252525"
                  rgb="37, 37, 37"
                  cssVar="--background"
                  copyButton={<CopyButton text="#252525" label="bg-dark" />}
                />
                <ColorSpec
                  name="Foreground"
                  hex="#fafafa"
                  rgb="250, 250, 250"
                  cssVar="--foreground"
                  copyButton={<CopyButton text="#fafafa" label="fg-dark" />}
                />
                <ColorSpec
                  name="Primary"
                  hex="#fafafa"
                  rgb="250, 250, 250"
                  cssVar="--primary"
                  copyButton={<CopyButton text="#fafafa" label="primary-dark" />}
                />
                <ColorSpec
                  name="Secondary"
                  hex="#3d3d3d"
                  rgb="61, 61, 61"
                  cssVar="--secondary"
                  copyButton={<CopyButton text="#3d3d3d" label="secondary-dark" />}
                />
                <ColorSpec
                  name="Muted"
                  hex="#3d3d3d"
                  rgb="61, 61, 61"
                  cssVar="--muted"
                  copyButton={<CopyButton text="#3d3d3d" label="muted-dark" />}
                />
                <ColorSpec
                  name="Muted Foreground"
                  hex="#a3a3a3"
                  rgb="163, 163, 163"
                  cssVar="--muted-foreground"
                  copyButton={<CopyButton text="#a3a3a3" label="muted-fg-dark" />}
                />
                <ColorSpec
                  name="Border"
                  hex="#3d3d3d"
                  rgb="61, 61, 61"
                  cssVar="--border"
                  copyButton={<CopyButton text="#3d3d3d" label="border-dark" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chart Colors</CardTitle>
              <CardDescription>Data visualization color palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ColorSpec
                  name="Chart 1"
                  hex="#d97706"
                  rgb="217, 119, 6"
                  cssVar="--chart-1"
                  copyButton={<CopyButton text="#d97706" label="chart-1" />}
                />
                <ColorSpec
                  name="Chart 2"
                  hex="#0891b2"
                  rgb="8, 145, 178"
                  cssVar="--chart-2"
                  copyButton={<CopyButton text="#0891b2" label="chart-2" />}
                />
                <ColorSpec
                  name="Chart 3"
                  hex="#1e3a8a"
                  rgb="30, 58, 138"
                  cssVar="--chart-3"
                  copyButton={<CopyButton text="#1e3a8a" label="chart-3" />}
                />
                <ColorSpec
                  name="Chart 4"
                  hex="#facc15"
                  rgb="250, 204, 21"
                  cssVar="--chart-4"
                  copyButton={<CopyButton text="#facc15" label="chart-4" />}
                />
                <ColorSpec
                  name="Chart 5"
                  hex="#ea580c"
                  rgb="234, 88, 12"
                  cssVar="--chart-5"
                  copyButton={<CopyButton text="#ea580c" label="chart-5" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>Font sizes, weights, and line heights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <TypographySpec
                  element="h1"
                  fontSize="24px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (36px)"
                  usage="Page titles, main headings"
                  copyButton={<CopyButton text="24px / 500 / 1.5" label="h1-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="h2"
                  fontSize="20px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (30px)"
                  usage="Section headings"
                  copyButton={<CopyButton text="20px / 500 / 1.5" label="h2-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="h3"
                  fontSize="18px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (27px)"
                  usage="Subsection headings"
                  copyButton={<CopyButton text="18px / 500 / 1.5" label="h3-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="h4"
                  fontSize="16px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (24px)"
                  usage="Small headings, card titles"
                  copyButton={<CopyButton text="16px / 500 / 1.5" label="h4-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="p (paragraph)"
                  fontSize="16px"
                  fontWeight="400 (Regular)"
                  lineHeight="1.5 (24px)"
                  usage="Body text, descriptions"
                  copyButton={<CopyButton text="16px / 400 / 1.5" label="p-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="label"
                  fontSize="16px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (24px)"
                  usage="Form labels, input labels"
                  copyButton={<CopyButton text="16px / 500 / 1.5" label="label-spec" />}
                />
                <Separator />
                <TypographySpec
                  element="button"
                  fontSize="16px"
                  fontWeight="500 (Medium)"
                  lineHeight="1.5 (24px)"
                  usage="Button text"
                  copyButton={<CopyButton text="16px / 500 / 1.5" label="button-spec" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Font Family</CardTitle>
              <CardDescription>System font stack</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>System UI Font Stack (recommended for Figma)</p>
                <div className="p-4 bg-muted rounded-md flex items-center justify-between">
                  <code className="text-sm">
                    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
                  </code>
                  <CopyButton 
                    text="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                    label="font-stack" 
                  />
                </div>
                <p className="text-muted-foreground mt-4">
                  For Figma: Use Inter, SF Pro, or your preferred sans-serif font
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Spacing & Layout Tab */}
        <TabsContent value="spacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spacing Scale</CardTitle>
              <CardDescription>8-point grid system (base: 4px)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "0.5", px: "2px", usage: "Minimal spacing" },
                  { name: "1", px: "4px", usage: "Tight spacing" },
                  { name: "2", px: "8px", usage: "Extra small spacing" },
                  { name: "3", px: "12px", usage: "Small spacing" },
                  { name: "4", px: "16px", usage: "Base spacing" },
                  { name: "5", px: "20px", usage: "Medium spacing" },
                  { name: "6", px: "24px", usage: "Large spacing" },
                  { name: "8", px: "32px", usage: "Extra large spacing" },
                  { name: "10", px: "40px", usage: "Section spacing" },
                  { name: "12", px: "48px", usage: "Large section spacing" },
                  { name: "16", px: "64px", usage: "Extra large section spacing" },
                  { name: "20", px: "80px", usage: "Page spacing" },
                  { name: "24", px: "96px", usage: "Large page spacing" },
                ].map((space) => (
                  <div key={space.name} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-4 flex-1">
                      <code className="w-12">{space.name}</code>
                      <div className="h-8 bg-primary" style={{ width: space.px }} />
                      <span>{space.px}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{space.usage}</span>
                      <CopyButton text={space.px} label={`spacing-${space.name}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
              <CardDescription>Rounded corner values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <RadiusSpec
                  name="Small (sm)"
                  value="6px"
                  calculation="radius - 4px"
                  copyButton={<CopyButton text="6px" label="radius-sm" />}
                />
                <RadiusSpec
                  name="Medium (md)"
                  value="8px"
                  calculation="radius - 2px"
                  copyButton={<CopyButton text="8px" label="radius-md" />}
                />
                <RadiusSpec
                  name="Large (lg / default)"
                  value="10px"
                  calculation="base radius"
                  copyButton={<CopyButton text="10px" label="radius-lg" />}
                />
                <RadiusSpec
                  name="Extra Large (xl)"
                  value="14px"
                  calculation="radius + 4px"
                  copyButton={<CopyButton text="14px" label="radius-xl" />}
                />
                <RadiusSpec
                  name="Full (circle)"
                  value="9999px"
                  calculation="for circular elements"
                  copyButton={<CopyButton text="9999px" label="radius-full" />}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Container & Layout</CardTitle>
              <CardDescription>Maximum widths and breakpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p>Container Max Width</p>
                    <p className="text-muted-foreground">1280px (default)</p>
                  </div>
                  <CopyButton text="1280px" label="container-width" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p>Container Padding</p>
                    <p className="text-muted-foreground">24px (horizontal)</p>
                  </div>
                  <CopyButton text="24px" label="container-padding" />
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3">Responsive Breakpoints</h4>
                <div className="space-y-2">
                  <BreakpointSpec name="Mobile" value="< 640px" copyButton={<CopyButton text="640px" label="bp-mobile" />} />
                  <BreakpointSpec name="Tablet (sm)" value="≥ 640px" copyButton={<CopyButton text="640px" label="bp-sm" />} />
                  <BreakpointSpec name="Desktop (md)" value="≥ 768px" copyButton={<CopyButton text="768px" label="bp-md" />} />
                  <BreakpointSpec name="Large (lg)" value="≥ 1024px" copyButton={<CopyButton text="1024px" label="bp-lg" />} />
                  <BreakpointSpec name="Extra Large (xl)" value="≥ 1280px" copyButton={<CopyButton text="1280px" label="bp-xl" />} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Specifications</CardTitle>
              <CardDescription>Dimensions, padding, and variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComponentSpec
                name="Button - Small"
                height="32px"
                padding="8px 12px"
                fontSize="16px"
                borderRadius="10px"
              />
              <ComponentSpec
                name="Button - Default"
                height="40px"
                padding="10px 16px"
                fontSize="16px"
                borderRadius="10px"
              />
              <ComponentSpec
                name="Button - Large"
                height="44px"
                padding="12px 24px"
                fontSize="16px"
                borderRadius="10px"
              />
              <Separator />
              <div>
                <h4 className="mb-3">Button Variants</h4>
                <div className="space-y-2">
                  <VariantSpec name="Default" bg="var(--primary)" color="var(--primary-foreground)" />
                  <VariantSpec name="Secondary" bg="var(--secondary)" color="var(--secondary-foreground)" />
                  <VariantSpec name="Destructive" bg="var(--destructive)" color="var(--destructive-foreground)" />
                  <VariantSpec name="Outline" bg="transparent" color="var(--foreground)" border="1px solid var(--border)" />
                  <VariantSpec name="Ghost" bg="transparent" color="var(--foreground)" note="Hover: var(--accent)" />
                  <VariantSpec name="Link" bg="transparent" color="var(--primary)" note="Underline on hover" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input Field Specifications</CardTitle>
              <CardDescription>Form input dimensions and styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ComponentSpec
                name="Input - Default"
                height="40px"
                padding="10px 12px"
                fontSize="16px"
                borderRadius="10px"
                border="1px solid var(--border)"
              />
              <div className="p-3 bg-muted rounded-md">
                <p>Focus State</p>
                <p className="text-muted-foreground">Ring: 2px offset, var(--ring) color</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Specifications</CardTitle>
              <CardDescription>Container dimensions and styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p>Background: var(--card)</p>
                <p>Border: 1px solid var(--border)</p>
                <p>Border Radius: 10px</p>
                <p>Padding: 24px</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3">Card Sections</h4>
                <div className="space-y-2">
                  <p>• Header: 24px padding, bottom border optional</p>
                  <p>• Content: 24px padding</p>
                  <p>• Footer: 24px padding, top border optional</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge Specifications</CardTitle>
              <CardDescription>Small status indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ComponentSpec
                name="Badge - Default"
                height="22px"
                padding="2px 10px"
                fontSize="14px"
                borderRadius="10px"
              />
              <div>
                <h4 className="mb-3">Badge Variants</h4>
                <div className="space-y-2">
                  <VariantSpec name="Default" bg="var(--primary)" color="var(--primary-foreground)" />
                  <VariantSpec name="Secondary" bg="var(--secondary)" color="var(--secondary-foreground)" />
                  <VariantSpec name="Destructive" bg="var(--destructive)" color="var(--destructive-foreground)" />
                  <VariantSpec name="Outline" bg="transparent" color="var(--foreground)" border="1px solid var(--border)" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Specifications</CardTitle>
              <CardDescription>User profile images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p>Default Size: 40px × 40px</p>
                <p>Border Radius: 9999px (full circle)</p>
                <p>Fallback Background: var(--muted)</p>
                <p>Fallback Text: var(--muted-foreground), 16px, medium weight</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component States</CardTitle>
              <CardDescription>Interactive state specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <StateSpec
                  state="Hover"
                  description="Slight opacity change (0.9) or background lightening"
                />
                <StateSpec
                  state="Active/Pressed"
                  description="Scale: 0.95 or opacity: 0.8"
                />
                <StateSpec
                  state="Focus"
                  description="Ring: 2px offset, var(--ring) color at 50% opacity"
                />
                <StateSpec
                  state="Disabled"
                  description="Opacity: 0.5, cursor: not-allowed"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Reference Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Quick Figma Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>1. Create color styles for all colors listed in the Colors tab</p>
          <p>2. Set up text styles matching the Typography specifications</p>
          <p>3. Use 8-point grid (4px base) for spacing</p>
          <p>4. Create component variants for buttons, inputs, and other elements</p>
          <p>5. Set up auto-layout with specified padding and spacing values</p>
          <p>6. Create both light and dark mode color sets</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ColorSpec({ 
  name, 
  hex, 
  rgb, 
  cssVar, 
  usage, 
  copyButton 
}: { 
  name: string; 
  hex: string; 
  rgb: string; 
  cssVar: string; 
  usage?: string;
  copyButton: React.ReactNode;
}) {
  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="flex items-center justify-between">
        <p>{name}</p>
        {copyButton}
      </div>
      <div 
        className="h-16 rounded border" 
        style={{ backgroundColor: hex }}
      />
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">HEX:</span>
          <code>{hex}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">RGB:</span>
          <code>{rgb}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CSS:</span>
          <code>{cssVar}</code>
        </div>
        {usage && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usage:</span>
            <code>{usage}</code>
          </div>
        )}
      </div>
    </div>
  );
}

function TypographySpec({ 
  element, 
  fontSize, 
  fontWeight, 
  lineHeight, 
  usage,
  copyButton 
}: { 
  element: string; 
  fontSize: string; 
  fontWeight: string; 
  lineHeight: string; 
  usage: string;
  copyButton: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4>{element}</h4>
        {copyButton}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-muted-foreground">Font Size:</span>
          <p>{fontSize}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Font Weight:</span>
          <p>{fontWeight}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Line Height:</span>
          <p>{lineHeight}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Usage:</span>
          <p>{usage}</p>
        </div>
      </div>
    </div>
  );
}

function RadiusSpec({ 
  name, 
  value, 
  calculation, 
  copyButton 
}: { 
  name: string; 
  value: string; 
  calculation: string; 
  copyButton: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-4 flex-1">
        <div
          className="size-12 bg-primary"
          style={{ borderRadius: value }}
        />
        <div>
          <p>{name}</p>
          <p className="text-muted-foreground">{value} ({calculation})</p>
        </div>
      </div>
      {copyButton}
    </div>
  );
}

function BreakpointSpec({ 
  name, 
  value, 
  copyButton 
}: { 
  name: string; 
  value: string; 
  copyButton: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div>
        <p>{name}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
      {copyButton}
    </div>
  );
}

function ComponentSpec({
  name,
  height,
  padding,
  fontSize,
  borderRadius,
  border,
}: {
  name: string;
  height: string;
  padding: string;
  fontSize: string;
  borderRadius: string;
  border?: string;
}) {
  return (
    <div className="p-4 border rounded-md">
      <h4 className="mb-3">{name}</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-muted-foreground">Height:</span>
          <p>{height}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Padding:</span>
          <p>{padding}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Font Size:</span>
          <p>{fontSize}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Border Radius:</span>
          <p>{borderRadius}</p>
        </div>
        {border && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Border:</span>
            <p>{border}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VariantSpec({
  name,
  bg,
  color,
  border,
  note,
}: {
  name: string;
  bg: string;
  color: string;
  border?: string;
  note?: string;
}) {
  return (
    <div className="p-3 border rounded-md">
      <p className="mb-2">{name}</p>
      <div className="space-y-1">
        <p className="text-muted-foreground">Background: <code>{bg}</code></p>
        <p className="text-muted-foreground">Color: <code>{color}</code></p>
        {border && <p className="text-muted-foreground">Border: <code>{border}</code></p>}
        {note && <p className="text-muted-foreground">Note: {note}</p>}
      </div>
    </div>
  );
}

function StateSpec({ state, description }: { state: string; description: string }) {
  return (
    <div className="p-3 border rounded-md">
      <p className="mb-1">{state}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
