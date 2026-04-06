@echo off
setlocal

echo.
echo  CaseStrike ^> Git Commit ^& Push
echo  ================================
echo.

set /p "MSG=Commit message: "

if "%MSG%"=="" (
    echo  [ERROR] Commit message cannot be empty.
    exit /b 1
)

echo.
echo  Staging all changes...
git add -A
if errorlevel 1 (
    echo  [ERROR] git add failed.
    exit /b 1
)

echo  Committing: "%MSG%"
git commit -m "%MSG%"
if errorlevel 1 (
    echo  [ERROR] git commit failed. Nothing to commit?
    exit /b 1
)

echo  Pulling latest from origin ^(rebase^)...
git pull --rebase origin main
if errorlevel 1 (
    echo.
    echo  [ERROR] Rebase failed - there are conflicts that need manual resolution.
    echo  Run "git rebase --abort" to cancel, fix conflicts, then try again.
    exit /b 1
)

echo  Pushing to origin...
git push
if errorlevel 1 (
    echo  [ERROR] git push failed.
    exit /b 1
)

echo.
echo  Done! Changes pushed to GitHub.
echo.
endlocal
