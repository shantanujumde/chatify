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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Chats: {
        Row: {
          createdAt: string
          id: number
          question: string
          response: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: number
          question: string
          response: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: number
          question?: string
          response?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Chats_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Embeddings: {
        Row: {
          content: string
          contentLength: number
          contentTokens: number
          createdAt: string
          embedding: string | null
          fileId: number
          id: number
          openAiResponce: Json
          organizationId: string | null
        }
        Insert: {
          content: string
          contentLength: number
          contentTokens: number
          createdAt?: string
          embedding?: string | null
          fileId: number
          id?: number
          openAiResponce: Json
          organizationId?: string | null
        }
        Update: {
          content?: string
          contentLength?: number
          contentTokens?: number
          createdAt?: string
          embedding?: string | null
          fileId?: number
          id?: number
          openAiResponce?: Json
          organizationId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Embeddings_fileId_fkey"
            columns: ["fileId"]
            isOneToOne: false
            referencedRelation: "File"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Embeddings_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          }
        ]
      }
      File: {
        Row: {
          content: string
          createdAt: string | null
          deleted: boolean
          extension: string
          id: number
          name: string
          organizationId: string | null
          updatedAt: string | null
        }
        Insert: {
          content: string
          createdAt?: string | null
          deleted?: boolean
          extension: string
          id?: number
          name: string
          organizationId?: string | null
          updatedAt?: string | null
        }
        Update: {
          content?: string
          createdAt?: string | null
          deleted?: boolean
          extension?: string
          id?: number
          name?: string
          organizationId?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "File_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          }
        ]
      }
      Organization: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      Payment: {
        Row: {
          id: number
          stripeCurrentPeriodEnd: string | null
          stripeCustomerId: string | null
          stripePriceId: string | null
          stripeSubscriptionId: string | null
          userId: string | null
        }
        Insert: {
          id?: number
          stripeCurrentPeriodEnd?: string | null
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          userId?: string | null
        }
        Update: {
          id?: number
          stripeCurrentPeriodEnd?: string | null
          stripeCustomerId?: string | null
          stripePriceId?: string | null
          stripeSubscriptionId?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Payment_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      RolesAndPaymentInfo: {
        Row: {
          id: number
          paymentDetails: Json
          premiumUser: boolean
          role: string
          userId: string
        }
        Insert: {
          id?: number
          paymentDetails: Json
          premiumUser: boolean
          role?: string
          userId: string
        }
        Update: {
          id?: number
          paymentDetails?: Json
          premiumUser?: boolean
          role?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RolesAndPaymentInfo_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          createdAt: string | null
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          organizationId: string | null
          password: string | null
          role: Database["public"]["Enums"]["Role"] | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string | null
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          organizationId?: string | null
          password?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string | null
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          organizationId?: string | null
          password?: string | null
          role?: Database["public"]["Enums"]["Role"] | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "User_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          }
        ]
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      Role: "ADMIN" | "USER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
