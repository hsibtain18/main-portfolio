"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { apiPost } from "@/lib/apis";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

export default function NewDeveloperPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    lastRevenue: "",
    logos: [] as string[],
    contactPersons: [] as { name: string; phone: string }[],
  });
  const { subID } = usePreferenceStore();

  const [logoUrl, setLogoUrl] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addLogo = () => {
    if (!logoUrl.trim()) return toast.error("Enter a valid logo URL");
    setForm((prev) => ({ ...prev, logos: [...prev.logos, logoUrl.trim()] }));
    setLogoUrl("");
    toast.success("Logo added");
  };

  const addContact = () => {
    if (!contact.name || !contact.phone) return toast.error("Enter both name and phone number");
    setForm((prev) => ({
      ...prev,
      contactPersons: [...prev.contactPersons, contact],
    }));
    setContact({ name: "", phone: "" });
    toast.success("Contact added");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Developer name is required");

    try {
      const res = await fetch("/api/developers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const restp =  await apiPost("/developers",subID, form);
      if (!res.ok) throw new Error("Failed to save developer");

      toast.success("Developer added successfully!");
      setForm({
        name: "",
        description: "",
        startDate: "",
        lastRevenue: "",
        logos: [],
        contactPersons: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Error saving developer");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add Developer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Developer name"
                />
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Last Revenue (AED)</Label>
                <Input
                  name="lastRevenue"
                  value={form.lastRevenue}
                  onChange={handleChange}
                  placeholder="e.g. 1,200,000"
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short description about the developer"
                rows={4}
              />
            </div>

            {/* Logos */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">Logos</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Logo Image URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <Button type="button" onClick={addLogo}>
                  Add Logo
                </Button>
              </div>

              {form.logos.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {form.logos.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={url} alt={`Logo ${i}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Persons */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-3">Contact Persons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Phone Number"
                  value={contact.phone}
                  onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button type="button" onClick={addContact} className="mt-2">
                Add Contact
              </Button>

              {form.contactPersons.length > 0 && (
                <div className="mt-4 space-y-2">
                  {form.contactPersons.map((c, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2 border rounded bg-gray-50"
                    >
                      <span>
                        {c.name} — <span className="text-sm text-gray-600">{c.phone}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full mt-6">
              Save Developer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
