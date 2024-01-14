GRANT ALL ON TABLE "Embeddings" TO "service_role";
GRANT ALL ON TABLE "Embeddings" TO "postgres";
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SEQUENCE "Embeddings_id_seq" TO service_role;

GRANT ALL ON TABLE "Chats" TO "service_role";
GRANT ALL ON TABLE "Chats" TO "postgres";
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SEQUENCE "Chats_id_seq" TO service_role;

GRANT ALL ON TABLE "File" TO "service_role";
GRANT ALL ON TABLE "File" TO "postgres";
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON SEQUENCE "File_id_seq" TO service_role;