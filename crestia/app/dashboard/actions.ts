'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const geckoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    morph: z.string().min(1, 'Morph is required'),
    gender: z.enum(['Male', 'Female', 'Unknown']),
    birth_date: z.string().optional(),
    sire_id: z.string().optional().nullable(),
    dam_id: z.string().optional().nullable(),
    sire_name: z.string().optional().nullable(),
    dam_name: z.string().optional().nullable(),
    description: z.string().optional().nullable().or(z.literal('')),
    is_for_sale: z.boolean().default(false),
    // Image handling is separate
});

export async function createGecko(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // 1. Handle Main Image Upload
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('gecko-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { error: 'Failed to upload image' };
        }
        const { data: publicData } = supabase.storage
            .from('gecko-images')
            .getPublicUrl(fileName);
        imageUrl = publicData.publicUrl;
    }

    // 2. Handle Proof Image Upload
    const proofFile = formData.get('proof_image') as File | null;
    let proofUrl: string | null = null;

    if (proofFile && proofFile.size > 0) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${user.id}/proof_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('gecko-images') // Reusing bucket for now
            .upload(fileName, proofFile);

        if (uploadError) {
            console.error('Proof Upload Error:', uploadError);
            // Non-blocking error for proof? Maybe strict? Let's strict for now to ensure quality
            // Or allow graceful fail. Let's log but proceed to not block registration.
        } else {
            const { data: publicData } = supabase.storage
                .from('gecko-images')
                .getPublicUrl(fileName);
            proofUrl = publicData.publicUrl;
        }
    }

    // 3. Parse and Validate Data
    const rawData = {
        name: formData.get('name'),
        morph: formData.get('morph'),
        gender: formData.get('gender'),
        birth_date: formData.get('birth_date') || undefined,
        sire_id: formData.get('sire_id') === "null" || formData.get('sire_id') === "" ? null : formData.get('sire_id'),
        dam_id: formData.get('dam_id') === "null" || formData.get('dam_id') === "" ? null : formData.get('dam_id'),
        sire_name: formData.get('sire_name') || null,
        dam_name: formData.get('dam_name') || null,
        description: formData.get('description'),
        is_for_sale: formData.get('is_for_sale') === 'true',
    };

    const parsed = geckoSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: 'Validation failed' };
    }

    const { data: validatedData } = parsed;

    // 4. Insert into Database
    console.log("Attempting to insert gecko for Owner ID:", user.id);

    const { error: insertError } = await supabase
        .from('geckos')
        .insert({
            owner_id: user.id,
            name: validatedData.name,
            morph: validatedData.morph,
            gender: validatedData.gender,
            birth_date: validatedData.birth_date || null,
            image_url: imageUrl,
            sire_id: validatedData.sire_id || null,
            dam_id: validatedData.dam_id || null,
            sire_name: validatedData.sire_name || null,
            dam_name: validatedData.dam_name || null,
            proof_image_url: proofUrl,
            description: validatedData.description || null,
            is_for_sale: validatedData.is_for_sale,
        });

    if (insertError) {
        console.error('Server Action Insert Error:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
        });
        return { error: `Database Error: ${insertError.message}` };
    }


    console.log("Gecko created successfully for Owner ID:", user.id);

    revalidatePath('/dashboard');
    revalidatePath('/shop');
    redirect('/shop');
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile" };
    }

    const shopName = formData.get("shop_name") as string;

    if (!shopName || shopName.length < 3) {
        return { error: "Shop name must be at least 3 characters long" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ shop_name: shopName })
        .eq("id", user.id);

    if (error) {
        console.error("Profile Update Error:", error);
        return { error: "Failed to update profile" };
    }

    revalidatePath("/", "layout"); // Revalidate everywhere to update Navbar
    return { success: true };
}

export async function updateGecko(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const geckoId = formData.get('id') as string;
    if (!geckoId) return { error: 'Gecko ID is required' };

    // 1. Handle Main Image Upload
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | undefined = undefined;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('gecko-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { error: 'Failed to upload image' };
        }
        const { data: publicData } = supabase.storage
            .from('gecko-images')
            .getPublicUrl(fileName);
        imageUrl = publicData.publicUrl;
    }

    // 2. Handle Proof Image Upload
    const proofFile = formData.get('proof_image') as File | null;
    let proofUrl: string | undefined = undefined;

    if (proofFile && proofFile.size > 0) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${user.id}/proof_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('gecko-images')
            .upload(fileName, proofFile);

        if (!uploadError) {
            const { data: publicData } = supabase.storage
                .from('gecko-images')
                .getPublicUrl(fileName);
            proofUrl = publicData.publicUrl;
        }
    }

    // 3. Parse and Validate Data
    const rawData = {
        name: formData.get('name'),
        morph: formData.get('morph'),
        gender: formData.get('gender'),
        birth_date: formData.get('birth_date') || undefined,
        sire_id: formData.get('sire_id') === "null" || formData.get('sire_id') === "" ? null : formData.get('sire_id'),
        dam_id: formData.get('dam_id') === "null" || formData.get('dam_id') === "" ? null : formData.get('dam_id'),
        sire_name: formData.get('sire_name') || null,
        dam_name: formData.get('dam_name') || null,
        description: formData.get('description'),
        is_for_sale: formData.get('is_for_sale') === 'true',
    };

    const parsed = geckoSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: 'Validation failed' };
    }

    const { data: validatedData } = parsed;

    // 4. Update Database
    const updatePayload: any = {
        name: validatedData.name,
        morph: validatedData.morph,
        gender: validatedData.gender,
        birth_date: validatedData.birth_date || null,
        sire_id: validatedData.sire_id || null,
        dam_id: validatedData.dam_id || null,
        sire_name: validatedData.sire_name || null,
        dam_name: validatedData.dam_name || null,
        description: validatedData.description || null,
        is_for_sale: validatedData.is_for_sale,
        // Only update images if changed
        ...(imageUrl && { image_url: imageUrl }),
        ...(proofUrl && { proof_image_url: proofUrl }),
    };


    const { error: updateError } = await supabase
        .from('geckos')
        .update(updatePayload)
        .eq('id', geckoId)
        .eq('owner_id', user.id);

    if (updateError) {
        return { error: `Database Error: ${updateError.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/geckos/${geckoId}`);
    redirect('/dashboard');
}
