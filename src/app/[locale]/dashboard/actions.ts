'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';

const geckoSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    morph: z.string().min(1, 'Morph is required'),
    gender: z.enum(['Male', 'Female', 'Unknown']),
    birth_date: z.string().optional(),
    sire_id: z.string().nullable().optional(),
    dam_id: z.string().nullable().optional(),
    sire_name: z.string().nullable().optional(),
    dam_name: z.string().nullable().optional(),
    description: z.string().nullable().optional().or(z.literal('')),
    is_for_sale: z.boolean().default(false),
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
            .from('gecko-images')
            .upload(fileName, proofFile);

        if (uploadError) {
            console.error('Proof Upload Error:', uploadError);
        } else {
            const { data: publicData } = supabase.storage
                .from('gecko-images')
                .getPublicUrl(fileName);
            proofUrl = publicData.publicUrl;
        }
    }

    // 3. Parse and Validate Data
    // Helper to Convert Empty Strings to Null
    const getValue = (key: string) => {
        const value = formData.get(key);
        if (value === "null" || value === "" || value === null) return null;
        return value;
    }

    const rawData = {
        name: formData.get('name'),
        morph: formData.get('morph'),
        gender: formData.get('gender'),
        birth_date: formData.get('birth_date') || undefined,
        sire_id: getValue('sire_id'),
        dam_id: getValue('dam_id'),
        sire_name: getValue('sire_name'),
        dam_name: getValue('dam_name'),
        description: formData.get('description'),
        is_for_sale: formData.get('is_for_sale') === 'true',
    };

    const parsed = geckoSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error("Validation failed:", parsed.error);
        return { error: 'Validation failed' };
    }

    const { data: validatedData } = parsed;

    // 4. Insert into Database
    const { error: insertError } = await supabase
        .from('geckos')
        .insert({
            owner_id: user.id,
            name: validatedData.name,
            morph: validatedData.morph,
            gender: validatedData.gender,
            birth_date: validatedData.birth_date || null,
            image_url: imageUrl,
            sire_id: validatedData.sire_id,
            dam_id: validatedData.dam_id,
            sire_name: validatedData.sire_name,
            dam_name: validatedData.dam_name,
            proof_image_url: proofUrl,
            description: validatedData.description || null,
            is_for_sale: validatedData.is_for_sale,
        });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: `Database Error: ${insertError.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath('/shop');

    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';
    redirect({ href: '/shop', locale });
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
    const getValue = (key: string) => {
        const value = formData.get(key);
        if (value === "null" || value === "" || value === null) return null;
        return value;
    }

    const rawData = {
        name: formData.get('name'),
        morph: formData.get('morph'),
        gender: formData.get('gender'),
        birth_date: formData.get('birth_date') || undefined,
        sire_id: getValue('sire_id'),
        dam_id: getValue('dam_id'),
        sire_name: getValue('sire_name'),
        dam_name: getValue('dam_name'),
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
        sire_id: validatedData.sire_id,
        dam_id: validatedData.dam_id,
        sire_name: validatedData.sire_name,
        dam_name: validatedData.dam_name,
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

    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';
    redirect({ href: '/dashboard', locale });
}

export async function deleteGecko(geckoId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    if (!geckoId) {
        return { error: 'Gecko ID is required' };
    }

    // Delete gecko (only if owned by user)
    const { error: deleteError } = await supabase
        .from('geckos')
        .delete()
        .eq('id', geckoId)
        .eq('owner_id', user.id);

    if (deleteError) {
        console.error('Delete Error:', deleteError);
        return { error: `Failed to delete: ${deleteError.message}` };
    }

    revalidatePath('/dashboard');
    revalidatePath('/shop');

    return { success: true };
}
