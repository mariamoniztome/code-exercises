import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

export function DesignTokens() {
  const colorTokens = [
    { name: "Background", var: "background" },
    { name: "Foreground", var: "foreground" },
    { name: "Card", var: "card" },
    { name: "Card Foreground", var: "card-foreground" },
    { name: "Popover", var: "popover" },
    { name: "Popover Foreground", var: "popover-foreground" },
    { name: "Primary", var: "primary" },
    { name: "Primary Foreground", var: "primary-foreground" },
    { name: "Secondary", var: "secondary" },
    { name: "Secondary Foreground", var: "secondary-foreground" },
    { name: "Muted", var: "muted" },
    { name: "Muted Foreground", var: "muted-foreground" },
    { name: "Accent", var: "accent" },
    { name: "Accent Foreground", var: "accent-foreground" },
    { name: "Destructive", var: "destructive" },
    { name: "Destructive Foreground", var: "destructive-foreground" },
    { name: "Border", var: "border" },
    { name: "Input", var: "input" },
    { name: "Ring", var: "ring" },
  ];

  const chartTokens = [
    { name: "Chart 1", var: "chart-1" },
    { name: "Chart 2", var: "chart-2" },
    { name: "Chart 3", var: "chart-3" },
    { name: "Chart 4", var: "chart-4" },
    { name: "Chart 5", var: "chart-5" },
  ];

  const radiusTokens = [
    { name: "Small", value: "calc(var(--radius) - 4px)" },
    { name: "Medium", value: "calc(var(--radius) - 2px)" },
    { name: "Large", value: "var(--radius)" },
    { name: "Extra Large", value: "calc(var(--radius) + 4px)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2>Design Tokens</h2>
        <p className="text-muted-foreground mt-2">
          Foundation of the design system including colors, typography, spacing,
          and more.
        </p>
      </div>

      {/* Color Tokens */}
      <section>
        <h3 className="mb-4">Color Palette</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <Card key={token.var} className="p-4">
              <div
                className="h-20 rounded-md mb-3 border"
                style={{ backgroundColor: `var(--${token.var})` }}
              />
              <p>{token.name}</p>
              <code className="text-muted-foreground">--{token.var}</code>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Chart Colors */}
      <section>
        <h3 className="mb-4">Chart Colors</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {chartTokens.map((token) => (
            <Card key={token.var} className="p-4">
              <div
                className="h-20 rounded-md mb-3 border"
                style={{ backgroundColor: `var(--${token.var})` }}
              />
              <p>{token.name}</p>
              <code className="text-muted-foreground">--{token.var}</code>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Typography */}
      <section>
        <h3 className="mb-4">Typography</h3>
        <Card className="p-6 space-y-4">
          <div>
            <h1>Heading 1</h1>
            <code className="text-muted-foreground">h1 element</code>
          </div>
          <div>
            <h2>Heading 2</h2>
            <code className="text-muted-foreground">h2 element</code>
          </div>
          <div>
            <h3>Heading 3</h3>
            <code className="text-muted-foreground">h3 element</code>
          </div>
          <div>
            <h4>Heading 4</h4>
            <code className="text-muted-foreground">h4 element</code>
          </div>
          <div>
            <p>
              Paragraph text - The quick brown fox jumps over the lazy dog. This
              is a sample of body text to demonstrate the default paragraph
              styling.
            </p>
            <code className="text-muted-foreground">p element</code>
          </div>
        </Card>
      </section>

      <Separator />

      {/* Border Radius */}
      <section>
        <h3 className="mb-4">Border Radius</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {radiusTokens.map((token) => (
            <Card key={token.name} className="p-4">
              <div
                className="h-20 bg-primary mb-3"
                style={{ borderRadius: token.value }}
              />
              <p>{token.name}</p>
              <code className="text-muted-foreground">{token.value}</code>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Spacing */}
      <section>
        <h3 className="mb-4">Spacing Scale</h3>
        <Card className="p-6 space-y-3">
          {[1, 2, 3, 4, 6, 8, 12, 16, 24, 32].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <code className="w-16 text-muted-foreground">{size * 4}px</code>
              <div
                className="h-8 bg-primary"
                style={{ width: `${size * 4}px` }}
              />
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
