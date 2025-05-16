-- Adicionar coluna deleted_at para soft delete
ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela de logs de auditoria
CREATE TABLE audit_logs (
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
CREATE POLICY "Qualquer pessoa pode ver produtos não excluídos" 
ON products FOR SELECT 
TO authenticated, anon
USING (deleted_at IS NULL);

-- Criar função para registrar ações de auditoria
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
CREATE POLICY "Apenas admins podem ver todos os produtos" 
ON all_products FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.is_admin = true
  )
);
