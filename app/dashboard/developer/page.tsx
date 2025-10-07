"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { apiGet, apiPost } from "@/lib/apis";
import { usePreferenceStore } from "@/app/stores/useDashboardStore";

interface Contact {
  name: string;
  phone: string;
}

interface Developer {
  developerId: string;
  name: string;
  description: string;
  startDate: string;
  logos: string[];
  contacts: Contact[];
  lastRevenue: string;
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [open, setOpen] = useState(false);
  const [newDev, setNewDev] = useState<Partial<Developer>>({
    name: "",
    description: "",
    startDate: "",
    logos: [],
    contacts: [],
    lastRevenue: "",
  });
  const { subID } = usePreferenceStore();

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  /* ---------------- FETCH DEVELOPERS ---------------- */
  const fetchDevelopers = async () => {
    try {
      const res: any = await apiGet("developers",subID); // proxy to Express
      setDevelopers(res.developers || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load developers");
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  /* ---------------- ADD NEW DEVELOPER ---------------- */
  const handleAddDeveloper = async () => {
    if (!newDev.name) {
      toast.error("Name is required");
      return;
    }

    try {
    //   await axios.post("/api/developers", newDev);
      await apiPost("developers/",subID, newDev ); // proxy to Express
      toast.success("Developer added successfully!");
      setOpen(false);
      setNewDev({
        name: "",
        description: "",
        startDate: "",
        logos: [],
        contacts: [],
        lastRevenue: "",
      });
      fetchDevelopers();
    } catch (error) {
      console.error(error);
      toast.error("Error adding developer");
    }
  };

  /* ---------------- ADD CONTACT TO TEMP LIST ---------------- */
  const addContact = () => {
    if (!contactName || !contactPhone) return toast.error("Enter contact details");
    setNewDev({
      ...newDev,
      contacts: [...(newDev.contacts || []), { name: contactName, phone: contactPhone }],
    });
    setContactName("");
    setContactPhone("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Developers</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Developer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Developer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={newDev.name || ""}
                onChange={(e) => setNewDev({ ...newDev, name: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newDev.description || ""}
                onChange={(e) => setNewDev({ ...newDev, description: e.target.value })}
              />
              <Input
                type="date"
                value={newDev.startDate || ""}
                onChange={(e) => setNewDev({ ...newDev, startDate: e.target.value })}
              />
              <Input
                placeholder="Logo URL (comma separated)"
                value={newDev.logos?.join(", ") || ""}
                onChange={(e) =>
                  setNewDev({
                    ...newDev,
                    logos: e.target.value.split(",").map((l) => l.trim()),
                  })
                }
              />
              <Input
                placeholder="Last Revenue"
                value={newDev.lastRevenue || ""}
                onChange={(e) => setNewDev({ ...newDev, lastRevenue: e.target.value })}
              />

              {/* CONTACTS SECTION */}
              <div className="border-t pt-3 space-y-2">
                <h3 className="font-semibold">Contacts</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                  <Button variant="secondary" onClick={addContact}>
                    Add
                  </Button>
                </div>
                <ul className="list-disc ml-4 text-sm">
                  {newDev.contacts?.map((c, i) => (
                    <li key={i}>
                      {c.name} - {c.phone}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full mt-4" onClick={handleAddDeveloper}>
                Save Developer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* DEVELOPER GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {developers.map((dev) => (
          <Card key={dev.developerId} className="shadow-md">
            <CardHeader>
              <CardTitle>{dev.name}</CardTitle>
              <p className="text-sm text-gray-500">{dev.startDate}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{dev.description}</p>
              {dev.logos && dev.logos.length > 0 && (
                <img
                  src={dev.logos[0]}
                  alt={dev.name}
                  className="w-full h-32 object-contain border rounded-lg"
                />
              )}
              <p className="text-sm mt-2 font-medium">Last Revenue: {dev.lastRevenue || "N/A"}</p>

              {dev.contacts?.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-sm">Contacts:</h4>
                  <ul className="text-sm text-gray-600">
                    {dev.contacts.map((c, i) => (
                      <li key={i}>
                        {c.name} - {c.phone}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
