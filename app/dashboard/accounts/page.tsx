"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");

  const handleSubmit = () => {
    if (!name || !currency) {
      toast.error("Please fill in all fields");
      return;
    }

    // Call your API to create account
    console.log({ name, currency });
    toast.success("Account created successfully!");
    setName("");
    setCurrency("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Main Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              placeholder="e.g., USD Main"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              placeholder="e.g., USD, AED"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
