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

// --- INTERFACES ---

// Interface for the data you receive from the API
interface ApiDeveloper {
    developerId: string;
    name: string;
    established_year?: string;
    createdAt: string;
    logo_url?: string;
}

// Interface for the Contact structure used in the form
interface Contact {
  name: string;
  phone: string;
}

// Interface for the data your component uses internally (mapped and including form fields)
interface Developer {
  developerId: string;
  name: string;
  // Mapped fields from API response:
  startDate: string;      // Mapped from 'established_year' or 'createdAt'
  logos: string[];        // Mapped from 'logo_url'
  // Component's custom fields (for display/form):
  description: string;
  contacts: Contact[];
  lastRevenue: string;
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for the "Add Developer" form
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

  /* ---------------- FETCH DEVELOPERS (TRANSFORMED) ---------------- */
  const fetchDevelopers = async () => {
    if (!subID) return; // Wait for subID to be available
    setLoading(true);
    try {
      // Assuming the API returns a response object with a 'developers' array
      const res: { developers?: ApiDeveloper[] } = await apiGet("developers", subID);
      
      const transformedDevelopers: Developer[] = (res.developers || []).map(dev => ({
        developerId: dev.developerId,
        name: dev.name,
        // Map 'established_year' to 'startDate'. Fallback to a formatted date from 'createdAt'.
        startDate: dev.established_year || (new Date(dev.createdAt).getFullYear().toString()),
        // Map 'logo_url' to 'logos'. Filter out "N/A" or empty string logos.
        logos: dev.logo_url && dev.logo_url !== 'N/A' ? [dev.logo_url] : [],
        
        // These fields are assumed empty since they are not in your minimal API sample
        description: "",
        contacts: [], 
        lastRevenue: "",
      }));
      
      setDevelopers(transformedDevelopers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load developers");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [subID]);

  /* ---------------- ADD NEW DEVELOPER ---------------- */
  const handleAddDeveloper = async () => {
    if (!newDev.name) {
      toast.error("Name is required");
      return;
    }

    try {
      // NOTE: When posting, you might need to map 'startDate' back to 'established_year' or 'createdAt' format if the API expects it.
      await apiPost("developers/", subID, newDev);
      toast.success("Developer added successfully! Refreshing list...");
      setOpen(false);
      // Reset form
      setNewDev({
        name: "", description: "", startDate: "", logos: [], contacts: [], lastRevenue: "",
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
  
  // --- Loading State ---
  if (loading) {
    return <div className="p-6 text-center text-xl text-gray-500 dark:text-gray-400">Loading developers...</div>;
  }
  
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
                type="text"
                placeholder="Established Year (e.g., 2018)"
                value={newDev.startDate || ""}
                onChange={(e) => setNewDev({ ...newDev, startDate: e.target.value })}
              />
              <Input
                placeholder="Logo URL (separate with comma)"
                value={newDev.logos?.join(", ") || ""}
                onChange={(e) =>
                  setNewDev({
                    ...newDev,
                    logos: e.target.value.split(",").map((l) => l.trim()).filter(l => l),
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
                  <Input placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  <Input placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  <Button variant="secondary" onClick={addContact}>Add</Button>
                </div>
                <ul className="list-disc ml-4 text-sm">
                  {newDev.contacts?.map((c, i) => (<li key={i}>{c.name} - {c.phone}</li>))}
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
        {developers.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">
                No developers found.
            </p>
        ) : (
            developers.map((dev) => (
                <Card key={dev.developerId} className="shadow-md dark:border-gray-700">
                    <CardHeader>
                        <CardTitle>{dev.name}</CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Established: {dev.startDate}</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-2">{dev.description || "No description provided."}</p>
                        
                        {/* Display Logo if available */}
                        {dev.logos && dev.logos.length > 0 && (
                            <img
                                src={dev.logos[0]}
                                alt={`${dev.name} Logo`}
                                className="w-full h-32 object-contain border dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700"
                            />
                        )}
                        <p className="text-sm mt-2 font-medium">Last Revenue: {dev.lastRevenue || "N/A"}</p>

                        {/* Display Contacts */}
                        {dev.contacts?.length > 0 && (
                            <div className="mt-3">
                                <h4 className="font-semibold text-sm">Contacts:</h4>
                                <ul className="text-sm text-gray-600 dark:text-gray-400">
                                    {dev.contacts.map((c, i) => (<li key={i}>{c.name} - {c.phone}</li>))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}