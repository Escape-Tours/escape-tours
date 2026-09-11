  export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

  export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
      PostgrestVersion: "14.5"
    }
    public: {
      Tables: {
        bookings: {
          Row: {
            adults: number | null
            agent_fee: number | null
            base_price: number | null
            check_in: string | null
            check_out: string | null
            children: number | null
            climb_date: string | null
            climbers: number | null
            created_at: string
            currency: string | null
            custom_request: string | null
            email: string | null
            full_name: string | null
            gear_rental: string | null
            id: string
            merchant_reference: string | null
            nights: number | null
            order_tracking_id: string | null
            phone: number | null
            room_category: string | null
            service_name: string | null
            service_type: string | null
            status: string | null
            total_amount: number | null
            vat_amount: number | null
          }
          Insert: {
            adults?: number | null
            agent_fee?: number | null
            base_price?: number | null
            check_in?: string | null
            check_out?: string | null
            children?: number | null
            climb_date?: string | null
            climbers?: number | null
            created_at?: string
            currency?: string | null
            custom_request?: string | null
            email?: string | null
            full_name?: string | null
            gear_rental?: string | null
            id?: string
            merchant_reference?: string | null
            nights?: number | null
            order_tracking_id?: string | null
            phone?: number | null
            room_category?: string | null
            service_name?: string | null
            service_type?: string | null
            status?: string | null
            total_amount?: number | null
            vat_amount?: number | null
          }
          Update: {
            adults?: number | null
            agent_fee?: number | null
            base_price?: number | null
            check_in?: string | null
            check_out?: string | null
            children?: number | null
            climb_date?: string | null
            climbers?: number | null
            created_at?: string
            currency?: string | null
            custom_request?: string | null
            email?: string | null
            full_name?: string | null
            gear_rental?: string | null
            id?: string
            merchant_reference?: string | null
            nights?: number | null
            order_tracking_id?: string | null
            phone?: number | null
            room_category?: string | null
            service_name?: string | null
            service_type?: string | null
            status?: string | null
            total_amount?: number | null
            vat_amount?: number | null
          }
          Relationships: []
        }
        hotels: {
          Row: {
            has_360: boolean | null
            has_video: boolean | null
            id: number
            image: string | null
            image_url: string | null
            is_government_fee: boolean | null
            latitude: number | null
            location: string | null
            location_type: string | null
            lodge_environment: Json | null
            longitude: number | null
            name: string | null
            park_id: string | null
            price_per_night: number | null
            price_permit: number | null
            rating: number | null
            room_categories: string[] | null
            room_images: Json | null
            room_prices: Json | null
            slug: string | null
            video_url: string | null
          }
          Insert: {
            has_360?: boolean | null
            has_video?: boolean | null
            id?: number
            image?: string | null
            image_url?: string | null
            is_government_fee?: boolean | null
            latitude?: number | null
            location?: string | null
            location_type?: string | null
            lodge_environment?: Json | null
            longitude?: number | null
            name?: string | null
            park_id?: string | null
            price_per_night?: number | null
            price_permit?: number | null
            rating?: number | null
            room_categories?: string[] | null
            room_images?: Json | null
            room_prices?: Json | null
            slug?: string | null
            video_url?: string | null
          }
          Update: {
            has_360?: boolean | null
            has_video?: boolean | null
            id?: number
            image?: string | null
            image_url?: string | null
            is_government_fee?: boolean | null
            latitude?: number | null
            location?: string | null
            location_type?: string | null
            lodge_environment?: Json | null
            longitude?: number | null
            name?: string | null
            park_id?: string | null
            price_per_night?: number | null
            price_permit?: number | null
            rating?: number | null
            room_categories?: string[] | null
            room_images?: Json | null
            room_prices?: Json | null
            slug?: string | null
            video_url?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "hotels_park_id_fkey"
              columns: ["park_id"]
              isOneToOne: false
              referencedRelation: "parks"
              referencedColumns: ["id"]
            },
          ]
        }
        inventory: {
          Row: {
            availability: Json | null
            base_price: Json
            category: string | null
            created_at: string | null
            description: string | null
            id: string
            image_url: string | null
            latitude: number | null
            longitude: number | null
            name: string
            pricing_rules: Json | null
            trek_pricing: Json | null
            type: string
          }
          Insert: {
            availability?: Json | null
            base_price: Json
            category?: string | null
            created_at?: string | null
            description?: string | null
            id?: string
            image_url?: string | null
            latitude?: number | null
            longitude?: number | null
            name: string
            pricing_rules?: Json | null
            trek_pricing?: Json | null
            type: string
          }
          Update: {
            availability?: Json | null
            base_price?: Json
            category?: string | null
            created_at?: string | null
            description?: string | null
            id?: string
            image_url?: string | null
            latitude?: number | null
            longitude?: number | null
            name?: string
            pricing_rules?: Json | null
            trek_pricing?: Json | null
            type?: string
          }
          Relationships: []
        }
        itineraries: {
          Row: {
            created_at: string | null
            id: string
            title: string
            user_id: string
          }
          Insert: {
            created_at?: string | null
            id?: string
            title: string
            user_id: string
          }
          Update: {
            created_at?: string | null
            id?: string
            title?: string
            user_id?: string
          }
          Relationships: []
        }
        itinerary_days: {
          Row: {
            created_at: string | null
            day_number: number
            id: string
            itinerary_id: string
            location: string | null
          }
          Insert: {
            created_at?: string | null
            day_number: number
            id?: string
            itinerary_id: string
            location?: string | null
          }
          Update: {
            created_at?: string | null
            day_number?: number
            id?: string
            itinerary_id?: string
            location?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "fk_itinerary"
              columns: ["itinerary_id"]
              isOneToOne: false
              referencedRelation: "itineraries"
              referencedColumns: ["id"]
            },
            {
              foreignKeyName: "itinerary_days_itinerary_id_fkey"
              columns: ["itinerary_id"]
              isOneToOne: false
              referencedRelation: "itineraries"
              referencedColumns: ["id"]
            },
          ]
        }
        itinerary_items: {
          Row: {
            created_at: string | null
            day: number | null
            day_id: string
            id: string
            itinerary_id: string
            price: number | null
            service_id: string
            type: string
          }
          Insert: {
            created_at?: string | null
            day?: number | null
            day_id: string
            id?: string
            itinerary_id: string
            price?: number | null
            service_id: string
            type: string
          }
          Update: {
            created_at?: string | null
            day?: number | null
            day_id?: string
            id?: string
            itinerary_id?: string
            price?: number | null
            service_id?: string
            type?: string
          }
          Relationships: [
            {
              foreignKeyName: "fk_day"
              columns: ["day_id"]
              isOneToOne: false
              referencedRelation: "itinerary_days"
              referencedColumns: ["id"]
            },
            {
              foreignKeyName: "fk_itinerary_days_id"
              columns: ["day_id"]
              isOneToOne: false
              referencedRelation: "itinerary_days"
              referencedColumns: ["id"]
            },
            {
              foreignKeyName: "itinerary_items_day_id_fkey"
              columns: ["day_id"]
              isOneToOne: false
              referencedRelation: "itinerary_days"
              referencedColumns: ["id"]
            },
            {
              foreignKeyName: "itinerary_items_itinerary_id_fkey"
              columns: ["itinerary_id"]
              isOneToOne: false
              referencedRelation: "itineraries"
              referencedColumns: ["id"]
            },
          ]
        }
        leads: {
          Row: {
            country: string | null
            created_at: string | null
            email: string | null
            full_name: string | null
            id: number
            message: string | null
            phone: string | null
            return_date: string | null
            travel_date: string | null
            trip_type: string | null
          }
          Insert: {
            country?: string | null
            created_at?: string | null
            email?: string | null
            full_name?: string | null
            id?: number
            message?: string | null
            phone?: string | null
            return_date?: string | null
            travel_date?: string | null
            trip_type?: string | null
          }
          Update: {
            country?: string | null
            created_at?: string | null
            email?: string | null
            full_name?: string | null
            id?: number
            message?: string | null
            phone?: string | null
            return_date?: string | null
            travel_date?: string | null
            trip_type?: string | null
          }
          Relationships: []
        }
        parks: {
          Row: {
            foreigner_fee: number
            id: string
            image_url: string | null
            name: string
            resident_fee: number
          }
          Insert: {
            foreigner_fee: number
            id?: string
            image_url?: string | null
            name: string
            resident_fee: number
          }
          Update: {
            foreigner_fee?: number
            id?: string
            image_url?: string | null
            name?: string
            resident_fee?: number
          }
          Relationships: []
        }
        reviews: {
          Row: {
            comment: string | null
            created_at: string | null
            hotel_id: number | null
            id: string
            rating: number | null
            user_name: string | null
          }
          Insert: {
            comment?: string | null
            created_at?: string | null
            hotel_id?: number | null
            id?: string
            rating?: number | null
            user_name?: string | null
          }
          Update: {
            comment?: string | null
            created_at?: string | null
            hotel_id?: number | null
            id?: string
            rating?: number | null
            user_name?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "reviews_hotel_id_fkey"
              columns: ["hotel_id"]
              isOneToOne: false
              referencedRelation: "hotels"
              referencedColumns: ["id"]
            },
          ]
        }
        safari_cars: {
          Row: {
            car_type: string | null
            created_at: string | null
            description: string | null
            features: string[] | null
            id: number
            image_url: string | null
            name: string
            price_per_day: Json
            price_permit: number | null
            price_tzs: number | null
          }
          Insert: {
            car_type?: string | null
            created_at?: string | null
            description?: string | null
            features?: string[] | null
            id?: number
            image_url?: string | null
            name: string
            price_per_day: Json
            price_permit?: number | null
            price_tzs?: number | null
          }
          Update: {
            car_type?: string | null
            created_at?: string | null
            description?: string | null
            features?: string[] | null
            id?: number
            image_url?: string | null
            name?: string
            price_per_day?: Json
            price_permit?: number | null
            price_tzs?: number | null
          }
          Relationships: []
        }
        trek_daily_itinerary: {
          Row: {
            activity_description: string | null
            day_number: number
            elevation_gain: string | null
            id: string
            location_name: string
            trek_id: string | null
          }
          Insert: {
            activity_description?: string | null
            day_number: number
            elevation_gain?: string | null
            id?: string
            location_name: string
            trek_id?: string | null
          }
          Update: {
            activity_description?: string | null
            day_number?: number
            elevation_gain?: string | null
            id?: string
            location_name?: string
            trek_id?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "trek_daily_itinerary_trek_id_fkey"
              columns: ["trek_id"]
              isOneToOne: false
              referencedRelation: "trek_routes"
              referencedColumns: ["id"]
            },
          ]
        }
        trek_pricing: {
          Row: {
            base_price: number
            currency: string | null
            id: string
            is_active: boolean | null
            tier: string | null
            trek_id: string | null
          }
          Insert: {
            base_price: number
            currency?: string | null
            id?: string
            is_active?: boolean | null
            tier?: string | null
            trek_id?: string | null
          }
          Update: {
            base_price?: number
            currency?: string | null
            id?: string
            is_active?: boolean | null
            tier?: string | null
            trek_id?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "trek_pricing_trek_id_fkey"
              columns: ["trek_id"]
              isOneToOne: false
              referencedRelation: "trek_routes"
              referencedColumns: ["id"]
            },
          ]
        }
        trek_routes: {
          Row: {
            created_at: string | null
            description: string | null
            difficulty_level: string | null
            duration_days: number
            id: string
            image_url: string | null
            name: string
            slug: string
          }
          Insert: {
            created_at?: string | null
            description?: string | null
            difficulty_level?: string | null
            duration_days: number
            id?: string
            image_url?: string | null
            name: string
            slug: string
          }
          Update: {
            created_at?: string | null
            description?: string | null
            difficulty_level?: string | null
            duration_days?: number
            id?: string
            image_url?: string | null
            name?: string
            slug?: string
          }
          Relationships: []
        }
        trekking: {
          Row: {
            description: string | null
            id: number
            image_url: string | null
            name: string
            price_permit: number | null
            price_tzs: number | null
            price_usd: number | null
          }
          Insert: {
            description?: string | null
            id?: number
            image_url?: string | null
            name: string
            price_permit?: number | null
            price_tzs?: number | null
            price_usd?: number | null
          }
          Update: {
            description?: string | null
            id?: number
            image_url?: string | null
            name?: string
            price_permit?: number | null
            price_tzs?: number | null
            price_usd?: number | null
          }
          Relationships: []
        }
        vehicle_rates: {
          Row: {
            daily_rate: number | null
            id: string
            type: string | null
          }
          Insert: {
            daily_rate?: number | null
            id?: string
            type?: string | null
          }
          Update: {
            daily_rate?: number | null
            id?: string
            type?: string | null
          }
          Relationships: []
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        save_itinerary_full:
          | {
              Args: { p_days: Json; p_items: Json; p_itinerary_id: string }
              Returns: undefined
            }
          | {
              Args: {
                p_days: Json
                p_items: Json
                p_itinerary_id: string
                p_user_id: string
              }
              Returns: undefined
            }
          | {
              Args: {
                p_days: Json
                p_items: Json
                p_itinerary_id: string
                p_title: string
                p_user_id: string
              }
              Returns: undefined
            }
      }
      Enums: {
        [_ in never]: never
      }
      CompositeTypes: {
        [_ in never]: never
      }
    }
  }

  type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

  type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

  export type Tables<
    DefaultSchemaTableNameOrOptions extends
      | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
      | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
      : never = never,
  > = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
        Row: infer R
      }
      ? R
      : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
          DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
          DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
          Row: infer R
        }
        ? R
        : never
      : never

  export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
      | keyof DefaultSchema["Tables"]
      | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      : never = never,
  > = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
      }
      ? I
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Insert: infer I
        }
        ? I
        : never
      : never

  export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
      | keyof DefaultSchema["Tables"]
      | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
      : never = never,
  > = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
      }
      ? U
      : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Update: infer U
        }
        ? U
        : never
      : never

  export type Enums<
    DefaultSchemaEnumNameOrOptions extends
      | keyof DefaultSchema["Enums"]
      | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
      : never = never,
  > = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never

  export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
      | keyof DefaultSchema["CompositeTypes"]
      | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals
    }
      ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
      : never = never,
  > = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never

  export const Constants = {
    public: {
      Enums: {},
    },
  } as const
