import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Calendar } from "./ui/calendar";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useState } from "react";

export function FormsShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sliderValue, setSliderValue] = useState([50]);

  return (
    <div className="space-y-12">
      <div>
        <h2>Form Components</h2>
        <p className="text-muted-foreground mt-2">
          Input fields, selectors, and other form controls
        </p>
      </div>

      {/* Input */}
      <section className="space-y-4">
        <h3>Input</h3>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-default">Default Input</Label>
            <Input id="input-default" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-email">Email Input</Label>
            <Input id="input-email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-password">Password Input</Label>
            <Input id="input-password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-disabled">Disabled Input</Label>
            <Input id="input-disabled" placeholder="Disabled" disabled />
          </div>
        </Card>
      </section>

      {/* Textarea */}
      <section className="space-y-4">
        <h3>Textarea</h3>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="textarea">Message</Label>
            <Textarea id="textarea" placeholder="Type your message here..." />
          </div>
        </Card>
      </section>

      {/* Checkbox */}
      <section className="space-y-4">
        <h3>Checkbox</h3>
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label htmlFor="terms">Accept terms and conditions</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <label htmlFor="marketing">Send me marketing emails</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <label htmlFor="disabled">Disabled checkbox</label>
          </div>
        </Card>
      </section>

      {/* Radio Group */}
      <section className="space-y-4">
        <h3>Radio Group</h3>
        <Card className="p-6">
          <RadioGroup defaultValue="option-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-1" id="option-1" />
              <Label htmlFor="option-1">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-2" id="option-2" />
              <Label htmlFor="option-2">Option 2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-3" id="option-3" />
              <Label htmlFor="option-3">Option 3</Label>
            </div>
          </RadioGroup>
        </Card>
      </section>

      {/* Select */}
      <section className="space-y-4">
        <h3>Select</h3>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="select">Select an option</Label>
            <Select>
              <SelectTrigger id="select">
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option-1">Option 1</SelectItem>
                <SelectItem value="option-2">Option 2</SelectItem>
                <SelectItem value="option-3">Option 3</SelectItem>
                <SelectItem value="option-4">Option 4</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </section>

      {/* Switch */}
      <section className="space-y-4">
        <h3>Switch</h3>
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
            <Switch id="airplane-mode" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch id="notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="disabled-switch">Disabled</Label>
            <Switch id="disabled-switch" disabled />
          </div>
        </Card>
      </section>

      {/* Slider */}
      <section className="space-y-4">
        <h3>Slider</h3>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Volume</Label>
              <span>{sliderValue[0]}%</span>
            </div>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
            />
          </div>
        </Card>
      </section>

      {/* Calendar */}
      <section className="space-y-4">
        <h3>Calendar</h3>
        <Card className="p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>
      </section>

      {/* Input OTP */}
      <section className="space-y-4">
        <h3>Input OTP</h3>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>One-Time Password</Label>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Card>
      </section>

      {/* Complete Form Example */}
      <section className="space-y-4">
        <h3>Complete Form Example</h3>
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill out the form below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-form">Email</Label>
              <Input id="email-form" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-form">Password</Label>
              <Input id="password-form" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <RadioGroup defaultValue="email">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-email" />
                  <Label htmlFor="contact-email">Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <Label htmlFor="contact-phone">Phone</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="newsletter" />
              <label htmlFor="newsletter">Subscribe to newsletter</label>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button>Create Account</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
