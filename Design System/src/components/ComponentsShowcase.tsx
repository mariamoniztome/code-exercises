import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { AspectRatio } from "./ui/aspect-ratio";
import { AlertCircle, Info, CheckCircle, ChevronDown, Calendar, User, Mail, Phone } from "lucide-react";
import { useState } from "react";

export function ComponentsShowcase() {
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([50]);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  return (
    <div className="space-y-12">
      <div>
        <h2>Components</h2>
        <p className="text-muted-foreground mt-2">
          Comprehensive showcase of all available UI components
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h3>Buttons</h3>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Calendar className="size-5" />
            </Button>
          </div>
        </Card>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h3>Badges</h3>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Card>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h3>Cards</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area. You can put any content here.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p>John Doe</p>
                <p className="text-muted-foreground">john@example.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Alerts */}
      <section className="space-y-4">
        <h3>Alerts</h3>
        <div className="space-y-3">
          <Alert>
            <Info className="size-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert message.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Avatar */}
      <section className="space-y-4">
        <h3>Avatars</h3>
        <Card className="p-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>EF</AvatarFallback>
            </Avatar>
          </div>
        </Card>
      </section>

      {/* Progress & Slider */}
      <section className="space-y-4">
        <h3>Progress & Slider</h3>
        <Card className="p-6 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label>Progress Bar</label>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
            </div>
          </div>
          <Separator />
          <div>
            <div className="flex justify-between mb-2">
              <label>Slider</label>
              <span>{sliderValue[0]}</span>
            </div>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          </div>
        </Card>
      </section>

      {/* Switch */}
      <section className="space-y-4">
        <h3>Switch</h3>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Switch id="switch-1" />
            <label htmlFor="switch-1">Enable notifications</label>
          </div>
        </Card>
      </section>

      {/* Skeleton */}
      <section className="space-y-4">
        <h3>Skeleton</h3>
        <Card className="p-6 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
        </Card>
      </section>

      {/* Accordion */}
      <section className="space-y-4">
        <h3>Accordion</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Section 1</AccordionTrigger>
            <AccordionContent>
              This is the content for section 1. Accordions are great for organizing information.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Section 2</AccordionTrigger>
            <AccordionContent>
              This is the content for section 2. You can expand one section at a time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Section 3</AccordionTrigger>
            <AccordionContent>
              This is the content for section 3. Click to collapse this section.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h3>Tabs</h3>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card className="p-6">
              <p>Content for Tab 1</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="p-6">
              <p>Content for Tab 2</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="p-6">
              <p>Content for Tab 3</p>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Table */}
      <section className="space-y-4">
        <h3>Table</h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>User</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob Johnson</TableCell>
                <TableCell>bob@example.com</TableCell>
                <TableCell>User</TableCell>
                <TableCell><Badge variant="secondary">Inactive</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Scroll Area */}
      <section className="space-y-4">
        <h3>Scroll Area</h3>
        <Card className="p-6">
          <ScrollArea className="h-48 w-full rounded border p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="py-2">
                Scroll item {i + 1}
              </div>
            ))}
          </ScrollArea>
        </Card>
      </section>

      {/* Tooltip */}
      <section className="space-y-4">
        <h3>Tooltip</h3>
        <Card className="p-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Card>
      </section>

      {/* Hover Card */}
      <section className="space-y-4">
        <h3>Hover Card</h3>
        <Card className="p-6">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@username</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4>@username</h4>
                  <p className="text-muted-foreground">
                    Software developer and designer
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Card>
      </section>

      {/* Collapsible */}
      <section className="space-y-4">
        <h3>Collapsible</h3>
        <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Collapsible Section</CardTitle>
                <ChevronDown className={`size-5 transition-transform ${isCollapsibleOpen ? 'rotate-180' : ''}`} />
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <p>This content can be toggled open and closed.</p>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </section>

      {/* Aspect Ratio */}
      <section className="space-y-4">
        <h3>Aspect Ratio</h3>
        <Card className="p-6">
          <div className="w-full max-w-md">
            <AspectRatio ratio={16 / 9}>
              <div className="size-full bg-muted rounded flex items-center justify-center">
                16:9 Aspect Ratio
              </div>
            </AspectRatio>
          </div>
        </Card>
      </section>
    </div>
  );
}
