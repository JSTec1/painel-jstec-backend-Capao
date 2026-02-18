@echo off
echo Fazendo push para o GitHub...
cd /d "%~dp0"

REM Remove arquivos de lock
del .git\index.lock 2>nul
del .git\config.lock 2>nul

REM Configura o token do GitHub
set GIT_TERMINAL_PROMPT=0
set GITHUB_TOKEN=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painel

REM Faz o push usando o token na URL
git push https://%GITHUB_TOKEN%@github.com/JSTec1/painel-jstec-backend-Capao.git master

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Concluido! As alteracoes foram enviadas para o GitHub.
    echo O Render deve fazer o deploy automaticamente em alguns minutos.
) else (
    echo.
    echo Erro ao fazer push. Tente executar manualmente:
    echo git push origin master
)

pause
