# Configuração do Banco de Dados

Para configurar o banco de dados com as últimas alterações, siga estas etapas:

## 1. Verifique a conexão com o banco de dados Supabase

Certifique-se de que você tem acesso ao banco de dados e que as credenciais estão corretas no arquivo `.env` ou `.env.local`.

## 2. Execute a migração Prisma

Execute o seguinte comando para criar a migração e aplicá-la ao banco de dados:

```bash
npx prisma migrate dev --name add_user_settings
```

Este comando vai:
1. Gerar os arquivos de migração baseados nas mudanças do schema
2. Aplicar a migração ao banco de dados
3. Regenerar o cliente Prisma

## 3. (Alternativa) Aplicar manualmente o SQL

Se você tiver problemas com o comando anterior, você pode executar diretamente este SQL no banco de dados:

```sql
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "settings" JSONB DEFAULT '{"emailNotificacoes": true, "novosRecursos": true, "dicas": true, "temaEscuro": false}';
```

## 4. Gere o cliente Prisma

Após a migração do banco de dados, gere o cliente Prisma atualizado:

```bash
npx prisma generate
```

## 5. Reinicie o servidor

Depois de aplicar todas as alterações, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Verificação

Para verificar se a migração foi aplicada corretamente, verifique se a coluna `settings` está presente na tabela `users` no seu banco de dados. 