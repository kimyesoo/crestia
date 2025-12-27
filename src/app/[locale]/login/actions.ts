'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from '@/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()
    const redirectTo = formData.get('redirectTo') as string | null;

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

    // Redirect to the specified page or home
    const targetPath = redirectTo || '/';
    redirect({ href: targetPath, locale });
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const redirectTo = formData.get('redirectTo') as string | null;

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('full_name') as string,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')

    const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

    // Redirect to the specified page or home
    const targetPath = redirectTo || '/';
    redirect({ href: targetPath, locale });
}
