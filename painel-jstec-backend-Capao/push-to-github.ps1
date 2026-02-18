# Script para fazer push das alterações para o GitHub
# Execute este script na pasta painel-jstec-backend-Capao

Write-Host "Fazendo push para o GitHub..." -ForegroundColor Green

# Remove arquivos de lock se existirem
Remove-Item -Path ".git\index.lock" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".git\config.lock" -Force -ErrorAction SilentlyContinue

# Adiciona o arquivo modificado
git add server.js

# Faz o commit (se ainda não foi feito)
git commit -m "Corrige envio para GitHub: adiciona timestamp e melhora regex" -ErrorAction SilentlyContinue

# Faz o push
Write-Host "Fazendo push..." -ForegroundColor Yellow
git push origin master

Write-Host "`nConcluído! As alterações foram enviadas para o GitHub." -ForegroundColor Green
Write-Host "O Render deve fazer o deploy automaticamente em alguns minutos." -ForegroundColor Cyan
