@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create-issues.ps1" %*
pause
