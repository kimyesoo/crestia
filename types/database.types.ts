export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    shop_name: string | null
                    is_verified: boolean
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    shop_name?: string | null
                    is_verified?: boolean
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    shop_name?: string | null
                    is_verified?: boolean
                    avatar_url?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            geckos: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    morph: string
                    gender: "Male" | "Female" | "Unknown"
                    birth_date: string | null
                    image_url: string | null
                    sire_id: string | null
                    dam_id: string | null
                    description: string | null
                    is_for_sale: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    name: string
                    morph: string
                    gender?: "Male" | "Female" | "Unknown"
                    birth_date?: string | null
                    image_url?: string | null
                    sire_id?: string | null
                    dam_id?: string | null
                    description?: string | null
                    is_for_sale?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    name?: string
                    morph?: string
                    gender?: "Male" | "Female" | "Unknown"
                    birth_date?: string | null
                    image_url?: string | null
                    sire_id?: string | null
                    dam_id?: string | null
                    description?: string | null
                    is_for_sale?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "geckos_owner_id_fkey"
                        columns: ["owner_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "geckos_sire_id_fkey"
                        columns: ["sire_id"]
                        referencedRelation: "geckos"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "geckos_dam_id_fkey"
                        columns: ["dam_id"]
                        referencedRelation: "geckos"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            gender_type: "Male" | "Female" | "Unknown"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
