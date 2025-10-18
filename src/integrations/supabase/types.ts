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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          cart_items: Json
          created_at: string | null
          email: string
          id: string
          recovered_at: string | null
          reminder_sent_at: string | null
          session_id: string | null
          subtotal: number
        }
        Insert: {
          cart_items?: Json
          created_at?: string | null
          email: string
          id?: string
          recovered_at?: string | null
          reminder_sent_at?: string | null
          session_id?: string | null
          subtotal: number
        }
        Update: {
          cart_items?: Json
          created_at?: string | null
          email?: string
          id?: string
          recovered_at?: string | null
          reminder_sent_at?: string | null
          session_id?: string | null
          subtotal?: number
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          position: string
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          position: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string | null
          fulfilled_at: string | null
          fulfillment_status: string
          id: string
          items: Json
          order_number: string
          payment_status: string
          refund_amount: number | null
          shipping: number | null
          shipping_address: Json | null
          shipping_label_url: string | null
          shipping_notification_sent_at: string | null
          stallion_shipment_id: string | null
          status: string
          stripe_session_id: string
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: string
          id?: string
          items?: Json
          order_number: string
          payment_status?: string
          refund_amount?: number | null
          shipping?: number | null
          shipping_address?: Json | null
          shipping_label_url?: string | null
          shipping_notification_sent_at?: string | null
          stallion_shipment_id?: string | null
          status?: string
          stripe_session_id: string
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: string
          id?: string
          items?: Json
          order_number?: string
          payment_status?: string
          refund_amount?: number | null
          shipping?: number | null
          shipping_address?: Json | null
          shipping_label_url?: string | null
          shipping_notification_sent_at?: string | null
          stallion_shipment_id?: string | null
          status?: string
          stripe_session_id?: string
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_sections: {
        Row: {
          background_color: string | null
          category_filter: string | null
          created_at: string | null
          display_order: number
          id: string
          layout_columns: number | null
          name: string
          subtitle: string | null
          title: string
          updated_at: string | null
          visible: boolean
        }
        Insert: {
          background_color?: string | null
          category_filter?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          layout_columns?: number | null
          name: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          visible?: boolean
        }
        Update: {
          background_color?: string | null
          category_filter?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          layout_columns?: number | null
          name?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      sister_stories: {
        Row: {
          author: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_path: string
          video_url: string
        }
        Insert: {
          author: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_path: string
          video_url: string
        }
        Update: {
          author?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_path?: string
          video_url?: string
        }
        Relationships: []
      }
      site_texts: {
        Row: {
          button_text: string | null
          created_at: string | null
          description: string | null
          enabled: boolean
          id: string
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      uploaded_images: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          folder_path: string | null
          height: number | null
          id: string
          mime_type: string
          original_size: number
          updated_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          folder_path?: string | null
          height?: number | null
          id?: string
          mime_type: string
          original_size: number
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          folder_path?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          original_size?: number
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      uploaded_videos: {
        Row: {
          created_at: string | null
          duration: number | null
          file_name: string
          file_path: string
          file_size: number
          folder_path: string | null
          height: number | null
          id: string
          mime_type: string
          updated_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_name: string
          file_path: string
          file_size: number
          folder_path?: string | null
          height?: number | null
          id?: string
          mime_type: string
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_name?: string
          file_path?: string
          file_size?: number
          folder_path?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      woocommerce_customers: {
        Row: {
          billing: Json | null
          created_at: string | null
          email: string
          first_name: string | null
          id: number
          last_name: string | null
          orders_count: number | null
          shipping: Json | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing?: Json | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: number
          last_name?: string | null
          orders_count?: number | null
          shipping?: Json | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing?: Json | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          orders_count?: number | null
          shipping?: Json | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      woocommerce_orders: {
        Row: {
          billing: Json | null
          created_at: string | null
          currency: string | null
          date_created: string | null
          fulfilled_at: string | null
          fulfillment_status: string
          id: number
          line_items: Json | null
          meta_data: Json | null
          refund_amount: number | null
          shipping: Json | null
          shipping_label_url: string | null
          shipping_notification_sent_at: string | null
          stallion_shipment_id: string | null
          status: string
          total: number | null
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing?: Json | null
          created_at?: string | null
          currency?: string | null
          date_created?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: string
          id: number
          line_items?: Json | null
          meta_data?: Json | null
          refund_amount?: number | null
          shipping?: Json | null
          shipping_label_url?: string | null
          shipping_notification_sent_at?: string | null
          stallion_shipment_id?: string | null
          status: string
          total?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing?: Json | null
          created_at?: string | null
          currency?: string | null
          date_created?: string | null
          fulfilled_at?: string | null
          fulfillment_status?: string
          id?: number
          line_items?: Json | null
          meta_data?: Json | null
          refund_amount?: number | null
          shipping?: Json | null
          shipping_label_url?: string | null
          shipping_notification_sent_at?: string | null
          stallion_shipment_id?: string | null
          status?: string
          total?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      woocommerce_products: {
        Row: {
          attributes: Json | null
          categories: Json | null
          created_at: string | null
          description: string | null
          id: number
          images: Json | null
          in_stock: boolean | null
          manage_stock: boolean | null
          meta_data: Json | null
          name: string
          price: number | null
          regular_price: number | null
          sale_price: number | null
          short_description: string | null
          slug: string
          stock_quantity: number | null
          synced_at: string | null
          updated_at: string | null
          visible: boolean
        }
        Insert: {
          attributes?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id: number
          images?: Json | null
          in_stock?: boolean | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          name: string
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          short_description?: string | null
          slug: string
          stock_quantity?: number | null
          synced_at?: string | null
          updated_at?: string | null
          visible?: boolean
        }
        Update: {
          attributes?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: number
          images?: Json | null
          in_stock?: boolean | null
          manage_stock?: boolean | null
          meta_data?: Json | null
          name?: string
          price?: number | null
          regular_price?: number | null
          sale_price?: number | null
          short_description?: string | null
          slug?: string
          stock_quantity?: number | null
          synced_at?: string | null
          updated_at?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      woocommerce_sync_log: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          records_processed: number | null
          status: string
          sync_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          records_processed?: number | null
          status: string
          sync_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          records_processed?: number | null
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
