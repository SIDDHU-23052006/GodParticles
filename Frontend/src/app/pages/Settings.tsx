import React, { useEffect, useState } from "react";
import { Camera, Save, Pencil } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { getCompany, saveCompany } from "../../utils/companyStorage";
import { toast } from "sonner";

interface Company {
  logo?: string;
  tradeName: string;
  companyName: string;
  phone: string;
  email: string;
  gstin: string;
  website: string;
  pan: string;
  address: string;
}

export const Settings: React.FC = () => {

  const [editMode, setEditMode] = useState(false);

  const [company, setCompany] = useState<Company>({
    tradeName: "",
    companyName: "",
    phone: "",
    email: "",
    gstin: "",
    website: "",
    pan: "",
    address: "",
  });

  /* LOAD COMPANY */
  useEffect(() => {
    const stored = getCompany();
    if (stored) setCompany(stored);
  }, []);

  /* LOGO UPLOAD */
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany({ ...company, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  /* SAVE */
  const handleSave = () => {
    saveCompany(company);
    setEditMode(false);
    toast.success("Company profile saved!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

      {/* LEFT PROFILE PANEL */}
      <Card className="p-6 flex flex-col items-center text-center shadow-xl rounded-2xl">

        <div className="relative mb-4">

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 bg-gray-100 flex items-center justify-center">
            {company.logo ? (
              <img src={company.logo} className="w-full h-full object-cover"/>
            ) : (
              <Camera className="w-10 h-10 text-gray-400"/>
            )}
          </div>

          {editMode && (
            <label className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer hover:scale-110 transition">
              <Camera className="text-white w-4 h-4"/>
              <input type="file" hidden onChange={handleLogo}/>
            </label>
          )}
        </div>

        <h2 className="text-xl font-semibold">
          {company.tradeName || "Your Business"}
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          {company.companyName || "Company Name"}
        </p>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil className="w-4 h-4"/>
          {editMode ? "Cancel Editing" : "Edit Profile"}
        </Button>

      </Card>

      {/* RIGHT DETAILS PANEL */}
      <div className="lg:col-span-3">

        <Card className="p-8 shadow-xl rounded-2xl">

          <h2 className="text-2xl font-semibold mb-6">
            Organization Details
          </h2>

          <div className="space-y-6">

            {/* TRADE NAME */}
            <div>
              <Label>Trade / Brand Name</Label>
              <Input
                disabled={!editMode}
                value={company.tradeName}
                onChange={(e)=>setCompany({...company, tradeName:e.target.value})}
                className="mt-1"
              />
            </div>

            {/* COMPANY NAME */}
            <div>
              <Label>Company Name</Label>
              <Input
                disabled={!editMode}
                value={company.companyName}
                onChange={(e)=>setCompany({...company, companyName:e.target.value})}
                className="mt-1"
              />
            </div>

            {/* PHONE + EMAIL */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Phone</Label>
                <Input
                  disabled={!editMode}
                  value={company.phone}
                  onChange={(e)=>setCompany({...company, phone:e.target.value})}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  disabled={!editMode}
                  value={company.email}
                  onChange={(e)=>setCompany({...company, email:e.target.value})}
                />
              </div>
            </div>

            {/* GST + PAN */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>GSTIN</Label>
                <Input
                  disabled={!editMode}
                  value={company.gstin}
                  onChange={(e)=>setCompany({...company, gstin:e.target.value})}
                />
              </div>

              <div>
                <Label>PAN Number</Label>
                <Input
                  disabled={!editMode}
                  value={company.pan}
                  onChange={(e)=>setCompany({...company, pan:e.target.value})}
                />
              </div>
            </div>

            {/* WEBSITE */}
            <div>
              <Label>Website</Label>
              <Input
                disabled={!editMode}
                value={company.website}
                onChange={(e)=>setCompany({...company, website:e.target.value})}
              />
            </div>

            {/* ADDRESS */}
            <div>
              <Label>Address</Label>
              <Textarea
                disabled={!editMode}
                value={company.address}
                onChange={(e)=>setCompany({...company, address:e.target.value})}
              />
            </div>

            {editMode && (
              <Button
                onClick={handleSave}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-8"
              >
                <Save className="w-4 h-4"/>
                Save & Update
              </Button>
            )}

          </div>
        </Card>
      </div>
    </div>
  );
};