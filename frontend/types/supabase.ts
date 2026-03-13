export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          age: number | null
          gender: string | null
          goal: string | null
          experience_level: string | null
          equipment: string | null
          body_type: string | null
          height: number | null
          weight: number | null
          avatar_url: string | null
          instagram_handle: string | null
          bio: string | null
          is_profile_complete: boolean | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          name?: string | null
          age?: number | null
          gender?: string | null
          goal?: string | null
          experience_level?: string | null
          equipment?: string | null
          body_type?: string | null
          height?: number | null
          weight?: number | null
          avatar_url?: string | null
          instagram_handle?: string | null
          bio?: string | null
          is_profile_complete?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          age?: number | null
          gender?: string | null
          goal?: string | null
          experience_level?: string | null
          equipment?: string | null
          body_type?: string | null
          height?: number | null
          weight?: number | null
          avatar_url?: string | null
          instagram_handle?: string | null
          bio?: string | null
          is_profile_complete?: boolean | null
        }
      }
    }
  }
}
