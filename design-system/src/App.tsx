import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Moon, Sun } from "lucide-react";
import { DesignTokens } from "./components/DesignTokens";
import { ComponentsShowcase } from "./components/ComponentsShowcase";
import { FormsShowcase } from "./components/FormsShowcase";
import { OverlaysShowcase } from "./components/OverlaysShowcase";
import { NavigationShowcase } from "./components/NavigationShowcase";
import { FigmaSpecs } from "./components/FigmaSpecs";

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen bg-background`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1>Design System</h1>
            <p className="text-muted-foreground">
              Complete component library and design tokens
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="figma">Figma Specs</TabsTrigger>
            <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2>Welcome to the Design System</h2>
              <p className="text-muted-foreground mt-2">
                This comprehensive design system includes a complete set of
                design tokens, UI components, and patterns built with React,
                Tailwind CSS v4, and ShadCN UI.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 border rounded-lg bg-card">
                <h3>Design Tokens</h3>
                <p className="text-muted-foreground mt-2">
                  Explore color palettes, typography scales, spacing, and radius
                  tokens that form the foundation of this design system.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card">
                <h3>Components</h3>
                <p className="text-muted-foreground mt-2">
                  40+ production-ready components including buttons, cards,
                  dialogs, and more with full accessibility support.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card">
                <h3>Dark Mode</h3>
                <p className="text-muted-foreground mt-2">
                  Full dark mode support with automatic color adjustments across
                  all components and tokens.
                </p>
              </div>
            </div>

            <NavigationShowcase />
          </TabsContent>

          {/* Figma Specs Tab */}
          <TabsContent value="figma">
            <FigmaSpecs />
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens">
            <DesignTokens />
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components">
            <ComponentsShowcase />
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <FormsShowcase />
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value="overlays">
            <OverlaysShowcase />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
