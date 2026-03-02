@echo off
setlocal EnableExtensions
rem Убедимся, что работаем из папки скрипта
pushd "%~dp0"

rem ==============================
rem  NestJS + Prisma Dev Runner
rem ==============================

rem Проверка наличия bun в PATH
where bun >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Bun не найден в PATH. Установите bun и/или добавьте в PATH.
  goto :error
)

echo(
echo ==============================
echo   NestJS + Prisma – Dev Mode
echo ==============================
echo(

echo [1/4] Installing dependencies...
call bun install
if %errorlevel% neq 0 goto :error

echo(
echo [2/4] Generating Prisma client...
call bun run prisma:generate
if %errorlevel% neq 0 goto :error

echo(
echo [3/4] Running database migrations...
call bun run prisma:migrate
if %errorlevel% neq 0 goto :error

echo(
echo [4/4] Launching NestJS in dev mode...
call bun run dev
if %errorlevel% neq 0 goto :error

echo(
echo ==============================
echo   All steps completed OK.
echo ==============================
popd
exit /b 0

:error
echo(
echo ==============================
echo   ERROR: Step failed (%errorlevel%)
echo ==============================
popd
exit /b %errorlevel%
