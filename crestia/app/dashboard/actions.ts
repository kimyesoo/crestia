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
    description: z.string().optional(),
    // Image handling is separate
});

export async function createGecko(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    // 1. Handle File Upload
    const imageFile = formData.get('image') as File | null;
    let imageUrl: string | null = null;

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        // Upload to 'gecko-images' bucket
        const { error: uploadError } = await supabase.storage
            .from('gecko-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return { error: 'Failed to upload image' };
        }

        // Get Public URL
        const { data: publicData } = supabase.storage
            .from('gecko-images')
            .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
    }

    // 2. Parse and Validate Data
    const rawData = {
        name: formData.get('name'),
        morph: formData.get('morph'),
        gender: formData.get('gender'),
        birth_date: formData.get('birth_date') || undefined, // Send undefined if empty
        sire_id: formData.get('sire_id') === "null" ? null : formData.get('sire_id'),
        dam_id: formData.get('dam_id') === "null" ? null : formData.get('dam_id'),
        description: formData.get('description'),
    };

    const parsed = geckoSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: 'Validation failed' };
    }

    const { data: validatedData } = parsed;

    // 3. Insert into Database
    const { error: insertError } = await supabase
        .from('geckos')
        .insert({
            owner_id: user.id,
            name: validatedData.name,
            morph: validatedData.morph,
            gender: validatedData.gender,
            birth_date: validatedData.birth_date || null,
            image_url: imageUrl,
            sire_id: validatedData.sire_id || null, // Ensure explicit null
            dam_id: validatedData.dam_id || null,   // Ensure explicit null
            description: validatedData.description || null,
        });

    if (insertError) {
        console.error('Insert Error:', insertError);
        return { error: insertError.message };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}
