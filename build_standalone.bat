@echo off
ren .env.local .env.local_temp
call npm run build
ren .env.local_temp .env.local
xcopy .\public .\.next\standalone\public /ehkyi
xcopy .\.next\static .\.next\standalone\.next\static /ehkyi