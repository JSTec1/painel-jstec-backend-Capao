# Como Fazer Push para o GitHub

## ✅ Status Atual
- ✅ Commit local criado com sucesso
- ✅ Código corrigido (timestamp, regex melhorada, CORS)
- ⚠️ Falta apenas fazer o push

## 🔧 Solução Rápida (Escolha uma)

### Opção 1: Usar o Script PowerShell (Mais Fácil)
1. Abra o PowerShell como Administrador
2. Navegue até a pasta: `cd "C:\Users\Johns\OneDrive\Desktop\PAINEL-CAPÃO\painel-jstec-backend-Capao"`
3. Execute: `.\FAZER-PUSH.ps1`

### Opção 2: Comandos Manuais no PowerShell
```powershell
cd "C:\Users\Johns\OneDrive\Desktop\PAINEL-CAPÃO\painel-jstec-backend-Capao"

# Remove locks
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
Remove-Item .git\config.lock -Force -ErrorAction SilentlyContinue

# Configura o remote com token
git remote set-url origin https://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painel@github.com/JSTec1/painel-jstec-backend-Capao.git

# Desabilita credential helper temporariamente
git config --local credential.helper ""

# Faz o push
git push origin master
```

### Opção 3: Usar GitHub Desktop ou VS Code
1. Abra o projeto no VS Code ou GitHub Desktop
2. Vá para a aba "Source Control" (VS Code) ou "Changes" (GitHub Desktop)
3. Clique em "Push" ou "Sync"

### Opção 4: Configurar Credenciais do Windows
Se ainda não funcionar, configure suas credenciais:

```powershell
# Remove credenciais antigas do Windows
cmdkey /list | Select-String "git" | ForEach-Object { cmdkey /delete:$_ }

# Configura o Git para usar o Windows Credential Manager
git config --global credential.helper manager

# Tenta fazer push (vai pedir credenciais)
git push origin master
```

Quando pedir credenciais:
- **Username**: Seu usuário do GitHub (JSTec1)
- **Password**: Use um Personal Access Token (não sua senha)
  - Vá em: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Crie um novo token com permissão `repo`
  - Use esse token como senha

## 📋 O Que Foi Corrigido

1. ✅ **Timestamp adicionado**: Agora a URL inclui `?v=timestamp` para evitar cache
2. ✅ **Regex melhorada**: Encontra URLs com ou sem timestamp
3. ✅ **CORS liberado**: Permite requisições de qualquer origem
4. ✅ **Logs de debug**: Facilita identificar problemas futuros

## 🚀 Após o Push

1. O GitHub será atualizado automaticamente
2. O Render detectará as mudanças
3. O deploy será feito em 2-5 minutos
4. O painel voltará a funcionar normalmente!

## ❓ Problemas Comuns

### Erro: "Permission denied"
- Execute o PowerShell como Administrador
- Feche outros programas que possam estar usando o Git (VS Code, GitHub Desktop, etc.)

### Erro: "Credential Manager"
- Use a Opção 4 acima para reconfigurar credenciais
- Ou use o token diretamente na URL (Opção 2)

### Erro: "Lock file exists"
- Execute: `Remove-Item .git\index.lock -Force`
- Execute: `Remove-Item .git\config.lock -Force`
