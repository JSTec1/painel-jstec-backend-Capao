# ========================================
# COMANDOS COMPLETOS PARA VS CODE
# Copie e cole tudo no terminal do VS Code
# ========================================

# Navega para a pasta do projeto
cd "C:\Users\Johns\OneDrive\Desktop\PAINEL-CAPÃO\painel-jstec-backend-Capao"

# Verifica o status atual
Write-Host "`n=== VERIFICANDO STATUS ===" -ForegroundColor Cyan
git status

# Verifica o remote configurado
Write-Host "`n=== VERIFICANDO REMOTE ===" -ForegroundColor Cyan
git remote -v

# Remove arquivos de lock se existirem
Write-Host "`n=== LIMPANDO LOCKS ===" -ForegroundColor Yellow
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".git\config.lock" -Force -ErrorAction SilentlyContinue

# Configura o credential helper
Write-Host "`n=== CONFIGURANDO CREDENCIAIS ===" -ForegroundColor Yellow
git config --global credential.helper manager

# Faz o push
Write-Host "`n=== FAZENDO PUSH ===" -ForegroundColor Green
git push origin master

Write-Host "`n=== CONCLUÍDO! ===" -ForegroundColor Green
Write-Host "Se pedir credenciais:" -ForegroundColor Yellow
Write-Host "  Username: JSTec1" -ForegroundColor White
Write-Host "  Password: Cole seu token do GitHub" -ForegroundColor White
