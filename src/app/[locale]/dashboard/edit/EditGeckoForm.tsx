"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, UploadCloud, Loader2, AlertTriangle, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { updateGecko } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    morph: z.string().min(1, "Morph is required"),
    gender: z.enum(["Male", "Female", "Unknown"]),
    birth_date: z.date().optional(),
    sire_id: z.string().optional(),
    dam_id: z.string().optional(),
    sire_name: z.string().optional(),
    dam_name: z.string().optional(),
    description: z.string().optional().or(z.literal('')),
    is_for_sale: z.boolean().default(false),
    image: z.any().optional(),
    proof_image: z.any().optional(),
});

interface EditGeckoFormProps {
    gecko: any; // Using any for simplicity with Supabase return type
    potentialParents: { id: string; name: string; gender: string }[];
}

export function EditGeckoForm({ gecko, potentialParents }: EditGeckoFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Initial previews
    const [preview, setPreview] = useState<string | null>(gecko.image_url || null);
    const [proofPreview, setProofPreview] = useState<string | null>(gecko.proof_image_url || null);

    // Modes for linege entry
    const [sireMode, setSireMode] = useState<"system" | "manual">(gecko.sire_id ? "system" : "manual");
    const [damMode, setDamMode] = useState<"system" | "manual">(gecko.dam_id ? "system" : "manual");

    // Filter Parents
    const sires = potentialParents.filter(p => p.gender === 'Male');
    const dams = potentialParents.filter(p => p.gender === 'Female');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: gecko.name || "",
            morph: gecko.morph || "",
            gender: gecko.gender || "Unknown",
            birth_date: gecko.birth_date ? new Date(gecko.birth_date) : undefined,
            is_for_sale: gecko.is_for_sale || false,
            sire_id: gecko.sire_id || "",
            dam_id: gecko.dam_id || "",
            sire_name: gecko.sire_name || "",
            dam_name: gecko.dam_name || "",
            description: gecko.description || "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "image" | "proof_image") => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (fieldName === "image") {
                setPreview(url);
                form.setValue("image", file);
            } else {
                setProofPreview(url);
                form.setValue("proof_image", file);
            }
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", gecko.id);
        formData.append("name", values.name);
        formData.append("morph", values.morph);
        formData.append("gender", values.gender);
        if (values.birth_date) {
            formData.append("birth_date", format(values.birth_date, "yyyy-MM-dd"));
        }

        // Handle Sire
        if (sireMode === "system" && values.sire_id && values.sire_id !== "none") {
            formData.append("sire_id", values.sire_id);
            // Clear manual name if switching to system
            formData.delete("sire_name");
        } else if (sireMode === "manual" && values.sire_name) {
            formData.append("sire_name", values.sire_name);
            // Clear ID if switching to manual
            formData.delete("sire_id");
        }

        // Handle Dam
        if (damMode === "system" && values.dam_id && values.dam_id !== "none") {
            formData.append("dam_id", values.dam_id);
            formData.delete("dam_name");
        } else if (damMode === "manual" && values.dam_name) {
            formData.append("dam_name", values.dam_name);
            formData.delete("dam_id");
        }

        if (values.description) formData.append("description", values.description);
        formData.append("is_for_sale", String(values.is_for_sale));

        if (values.image) formData.append("image", values.image);
        if (values.proof_image) formData.append("proof_image", values.proof_image);

        const result = await updateGecko(formData);

        if (result?.error) {
            toast.error("Failed to update gecko", { description: result.error });
            setIsLoading(false);
        } else {
            toast.success("Gecko Updated", { description: "Changes saved successfully." });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image & Basic Info */}
                    <div className="space-y-6">
                        {/* Image Upload Area */}
                        <div className="aspect-square relative rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/50 hover:border-gold-500/50 transition-colors flex flex-col items-center justify-center overflow-hidden cursor-pointer group">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                onChange={(e) => handleImageChange(e, "image")}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4 space-y-2 group-hover:text-gold-400 transition-colors">
                                    <div className="p-4 bg-black rounded-full inline-block border border-zinc-800">
                                        <UploadCloud className="h-8 w-8 text-zinc-500 group-hover:text-gold-400" />
                                    </div>
                                    <div className="text-sm font-medium text-zinc-300">Change Photo</div>
                                    <div className="text-xs text-zinc-500">JPG, PNG up to 5MB</div>
                                </div>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Gecko Name" {...field} className="bg-zinc-900 border-zinc-800 focus:border-gold-500/50 text-white placeholder:text-zinc-600" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="morph"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400">Morph</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lilly White" {...field} className="bg-zinc-900 border-zinc-800 focus:border-gold-500/50 text-white placeholder:text-zinc-600" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column: Details & Lineage */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400">Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:border-gold-500/50 text-white">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Unknown">Unknown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-zinc-400">Hatch Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 hover:text-gold-500",
                                                        !field.value && "text-zinc-500"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800 text-white" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                                className="bg-zinc-900"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* LINEAGE SECTION */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                            <div className="flex items-center justify-between pb-2">
                                <h3 className="text-lg font-serif font-bold text-white">Lineage Info</h3>
                            </div>

                            {/* Sire Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-zinc-400">Sire (Father)</FormLabel>
                                    <div className="flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => setSireMode("system")}
                                            className={cn("px-2 py-0.5 text-xs rounded-sm transition-colors", sireMode === "system" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                                        >
                                            System
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSireMode("manual")}
                                            className={cn("px-2 py-0.5 text-xs rounded-sm transition-colors", sireMode === "manual" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                                        >
                                            Manual
                                        </button>
                                    </div>
                                </div>

                                {sireMode === "system" ? (
                                    <FormField
                                        control={form.control}
                                        name="sire_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                                            <SelectValue placeholder="Select Registered Sire" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                        <SelectItem value="none">None</SelectItem>
                                                        {sires.map((s) => (
                                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="sire_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Enter Sire Name" {...field} className="bg-zinc-900 border-zinc-800 border-dashed text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* Dam Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-zinc-400">Dam (Mother)</FormLabel>
                                    <div className="flex bg-zinc-900 rounded-md p-0.5 border border-zinc-800">
                                        <button
                                            type="button"
                                            onClick={() => setDamMode("system")}
                                            className={cn("px-2 py-0.5 text-xs rounded-sm transition-colors", damMode === "system" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                                        >
                                            System
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDamMode("manual")}
                                            className={cn("px-2 py-0.5 text-xs rounded-sm transition-colors", damMode === "manual" ? "bg-zinc-800 text-white" : "text-zinc-500")}
                                        >
                                            Manual
                                        </button>
                                    </div>
                                </div>

                                {damMode === "system" ? (
                                    <FormField
                                        control={form.control}
                                        name="dam_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                                            <SelectValue placeholder="Select Registered Dam" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                        <SelectItem value="none">None</SelectItem>
                                                        {dams.map((d) => (
                                                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="dam_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Enter Dam Name" {...field} className="bg-zinc-900 border-zinc-800 border-dashed text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            {/* Warning for Manual Entry */}
                            {(sireMode === "manual" || damMode === "manual") && (
                                <Alert className="bg-gold-500/10 border-gold-500/30">
                                    <AlertTriangle className="h-4 w-4 text-gold-500" />
                                    <AlertTitle className="text-gold-500 text-xs font-bold uppercase tracking-wide">Data Connection Note</AlertTitle>
                                    <AlertDescription className="text-xs text-zinc-400 mt-1">
                                        Manually entered parents are <strong>User Declared</strong>. Providing reference material helps build trust in your data.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Reference Material Upload */}
                            <div className="pt-2">
                                <FormLabel className="text-zinc-400 block mb-2">Reference Material (Optional)</FormLabel>
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 relative rounded-md border border-dashed border-zinc-700 bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0">
                                        {proofPreview ? (
                                            <img src={proofPreview} alt="Proof" className="w-full h-full object-cover" />
                                        ) : (
                                            <UploadCloud className="h-4 w-4 text-zinc-600" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageChange(e, "proof_image")}
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Upload hatching card or parent photos.<br />
                                        <span className="text-zinc-600">This serves as supporting reference for your declared lineage.</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="is_for_sale"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base text-zinc-200">
                                            Available for Sale
                                        </FormLabel>
                                        <FormDescription className="text-zinc-500">
                                            List this gecko in the public market.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-gold-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400">Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notes about lineage, traits, etc."
                                            className="resize-none bg-zinc-900 border-zinc-800 min-h-[100px] text-white focus:border-gold-500/50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-black hover:from-gold-300 hover:to-gold-500 font-bold border-0 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
