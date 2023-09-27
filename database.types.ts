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
          userId: string
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
          userId: string
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
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Embeddings_fileId_fkey"
            columns: ["fileId"]
            referencedRelation: "File"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Embeddings_userId_fkey"
            columns: ["userId"]
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      File: {
        Row: {
          content: string
          deleted: boolean
          extension: string
          id: number
          name: string
          userId: string
        }
        Insert: {
          content: string
          deleted?: boolean
          extension: string
          id?: number
          name: string
          userId: string
        }
        Update: {
          content?: string
          deleted?: boolean
          extension?: string
          id?: number
          name?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "File_userId_fkey"
            columns: ["userId"]
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
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          email: string | null
          emailVerified: string | null
          id: string
          image: string | null
          name: string | null
          password: string | null
        }
        Insert: {
          email?: string | null
          emailVerified?: string | null
          id: string
          image?: string | null
          name?: string | null
          password?: string | null
        }
        Update: {
          email?: string | null
          emailVerified?: string | null
          id?: string
          image?: string | null
          name?: string | null
          password?: string | null
        }
        Relationships: []
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
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_page_sections: {
        Args: {
          embedding: string
          match_threshold: number
          match_count: number
          min_content_length: number
        }
        Returns: {
          id: number
          title: string
          text_url: string
          text_date: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
