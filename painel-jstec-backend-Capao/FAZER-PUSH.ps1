# Script para fazer push para o GitHub
# Execute este script como Administrador ou diretamente no PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push para GitHub - Painel JSTec" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Remove arquivos de lock
Write-Host "Removendo arquivos de lock..." -ForegroundColor Yellow
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".git\config.lock" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Configura o remote com o token
Write-Host "Configurando remote com token..." -ForegroundColor Yellow
$token = "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painel"
git remote set-url origin "https://${token}@github.com/JSTec1/painel-jstec-backend-Capao.git"

# Verifica status
Write-Host "`nVerificando status..." -ForegroundColor Yellow
git status

Write-Host "`nFazendo push para o GitHub..." -ForegroundColor Green
Write-Host "Aguarde..." -ForegroundColor Yellow

# Tenta fazer o push
$result = git push origin master 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCESSO! Push realizado com sucesso!" -ForegroundColor Green
    Write-Host "O Render deve fazer o deploy automaticamente em alguns minutos." -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Erro ao fazer push:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host "`nTente executar manualmente:" -ForegroundColor Yellow
    Write-Host "git push origin master" -ForegroundColor White
    Write-Host "`nOu configure suas credenciais do GitHub:" -ForegroundColor Yellow
    Write-Host "git config --global credential.helper manager" -ForegroundColor White
}

Write-Host "`nPressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
