"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, UploadCloud, Loader2 } from "lucide-react";

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
import { createGecko } from "../actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    morph: z.string().min(1, "Morph is required"),
    gender: z.enum(["Male", "Female", "Unknown"]),
    birth_date: z.date().optional(),
    sire_id: z.string().optional(),
    dam_id: z.string().optional(),
    description: z.string().optional(),
    image: z.any().optional(), // File handling manually
});

interface AddGeckoFormProps {
    sires: { id: string; name: string }[];
    dams: { id: string; name: string }[];
}

export function AddGeckoForm({ sires, dams }: AddGeckoFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            morph: "",
            gender: "Unknown",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            form.setValue("image", file);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("morph", values.morph);
        formData.append("gender", values.gender);
        if (values.birth_date) {
            formData.append("birth_date", format(values.birth_date, "yyyy-MM-dd"));
        }
        if (values.sire_id && values.sire_id !== "none") formData.append("sire_id", values.sire_id);
        if (values.dam_id && values.dam_id !== "none") formData.append("dam_id", values.dam_id);
        if (values.description) formData.append("description", values.description);
        if (values.image) formData.append("image", values.image);

        const result = await createGecko(formData);

        if (result?.error) {
            toast.error("Failed to register gecko", { description: result.error });
            setIsLoading(false);
        } else {
            toast.success("Gecko Registered", { description: "Your legacy is growing." });
            // Redirect handled in server action
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Image & Basic Info */}
                    <div className="space-y-6">
                        {/* Image Upload Area */}
                        <div className="aspect-square relative rounded-xl border-2 border-dashed border-input hover:border-gold-500/50 transition-colors flex flex-col items-center justify-center overflow-hidden bg-card/30 group cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                onChange={handleImageChange}
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4 space-y-2 group-hover:text-gold-400 transition-colors">
                                    <div className="p-4 bg-secondary/50 rounded-full inline-block">
                                        <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-gold-400" />
                                    </div>
                                    <div className="text-sm font-medium">Click to upload photo</div>
                                    <div className="text-xs text-muted-foreground">JPG, PNG up to 5MB</div>
                                </div>
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Gecko Name" {...field} className="bg-secondary/30" />
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
                                    <FormLabel>Morph</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lilly White" {...field} className="bg-secondary/30" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-secondary/30">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
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
                                    <FormLabel>Hatch Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal bg-secondary/30 border-input",
                                                        !field.value && "text-muted-foreground"
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
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sire_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sire (Father)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary/30">
                                                    <SelectValue placeholder="Select Sire" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">None / Unknown</SelectItem>
                                                {sires.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dam_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dam (Mother)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-secondary/30">
                                                    <SelectValue placeholder="Select Dam" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">None / Unknown</SelectItem>
                                                {dams.map((d) => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notes about lineage, traits, etc."
                                            className="resize-none bg-secondary/30 min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading} className="w-full bg-gold-500 text-black hover:bg-gold-400 font-bold">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register Gecko
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
