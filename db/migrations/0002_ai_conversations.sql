-- Migration: 0002_ai_conversations.sql
-- Description: AI Multi-Agent System Tables (Conversations, Messages, Knowledge Chunks)

CREATE TABLE IF NOT EXISTS "ai_conversations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "agent_id" VARCHAR(64) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(32) NOT NULL DEFAULT 'gemini',
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "ai_messages" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "conversation_id" UUID NOT NULL REFERENCES "ai_conversations"("id") ON DELETE CASCADE,
    "role" VARCHAR(20) NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    "content" TEXT NOT NULL,
    "tokens" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "ai_knowledge_chunks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB DEFAULT '{}'::jsonb,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_ai_conversations_user_id" ON "ai_conversations"("user_id");
CREATE INDEX IF NOT EXISTS "idx_ai_messages_conversation_id" ON "ai_messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "idx_ai_knowledge_chunks_title" ON "ai_knowledge_chunks"("title");
