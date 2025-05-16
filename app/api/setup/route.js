import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request) {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado e é admin
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Verificar se o usuário é administrador
  const { data: profile } = await supabase.from("user_profiles").select("is_admin").eq("id", session.user.id).single()

  if (!profile?.is_admin) {
    return new Response(JSON.stringify({ error: "Acesso negado: apenas administradores podem executar esta ação" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    // Executar a migração SQL para adicionar soft delete e logs de auditoria
    const { error: migrationError } = await supabase.rpc("execute_sql", {
      sql: `
        -- Adicionar coluna deleted_at para soft delete se não existir
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'deleted_at'
          ) THEN
            ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
          END IF;
        END $$;

        -- Criar tabela de logs de auditoria se não existir
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id),
          action VARCHAR(50) NOT NULL,
          table_name VARCHAR(50) NOT NULL,
          record_id UUID NOT NULL,
          details JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Atualizar as políticas de segurança para considerar soft delete
        DROP POLICY IF EXISTS "Qualquer pessoa pode ver produtos" ON products;
        CREATE POLICY IF NOT EXISTS "Qualquer pessoa pode ver produtos não excluídos" 
        ON products FOR SELECT 
        TO authenticated, anon
        USING (deleted_at IS NULL);

        -- Criar função para registrar ações de auditoria se não existir
        CREATE OR REPLACE FUNCTION log_audit_event(
          action VARCHAR,
          table_name VARCHAR,
          record_id UUID,
          details JSONB DEFAULT NULL
        ) RETURNS UUID AS $$
        DECLARE
          log_id UUID;
          current_user_id UUID;
        BEGIN
          -- Obter o ID do usuário atual
          current_user_id := auth.uid();
          
          -- Inserir o log
          INSERT INTO audit_logs (user_id, action, table_name, record_id, details)
          VALUES (current_user_id, action, table_name, record_id, details)
          RETURNING id INTO log_id;
          
          RETURN log_id;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Criar view para produtos incluindo os excluídos (para administradores)
        CREATE OR REPLACE VIEW all_products AS
        SELECT 
          p.*,
          CASE WHEN p.deleted_at IS NULL THEN false ELSE true END AS is_deleted
        FROM 
          products p;

        -- Política para a view all_products (apenas admins)
        DROP POLICY IF EXISTS "Apenas admins podem ver todos os produtos" ON all_products;
        CREATE POLICY IF NOT EXISTS "Apenas admins podem ver todos os produtos" 
        ON all_products FOR SELECT 
        USING (
          EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.id = auth.uid() AND up.is_admin = true
          )
        );
      `,
    })

    if (migrationError) {
      console.error("Erro ao executar migração:", migrationError)
      return new Response(JSON.stringify({ error: "Erro ao executar migração" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true, message: "Migração executada com sucesso" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Erro ao configurar banco de dados:", error)
    return new Response(JSON.stringify({ error: "Erro ao configurar banco de dados" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
