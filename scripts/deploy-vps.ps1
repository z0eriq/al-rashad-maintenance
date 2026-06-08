# نشر على سيرفر Windows/VPS — شغّل من مجلد المشروع بعد رفع الملفات
$ErrorActionPreference = "Stop"

Write-Host "=== نشر موقع الرشاد ===" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
  Write-Host "خطأ: ملف .env غير موجود. انسخ .env.example وعدّل القيم." -ForegroundColor Red
  exit 1
}

Write-Host "1) تثبيت الحزم..." -ForegroundColor Yellow
npm ci

Write-Host "2) تطبيق قاعدة البيانات..." -ForegroundColor Yellow
npx prisma db push
npm run db:seed

Write-Host "3) بناء المشروع..." -ForegroundColor Yellow
npm run build

Write-Host "4) نسخ الملفات الثابتة لـ standalone..." -ForegroundColor Yellow
if (Test-Path ".next\standalone") {
  Copy-Item -Recurse -Force "public" ".next\standalone\public"
  Copy-Item -Recurse -Force ".next\static" ".next\standalone\.next\static"
}

Write-Host "5) تشغيل PM2..." -ForegroundColor Yellow
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
  pm2 delete al-rashad -ErrorAction SilentlyContinue
  pm2 start ecosystem.config.cjs
  pm2 save
  Write-Host "تم التشغيل عبر PM2" -ForegroundColor Green
} else {
  Write-Host "PM2 غير مثبت. شغّل يدوياً: npm run start" -ForegroundColor Yellow
}

Write-Host "`n=== اكتمل النشر ===" -ForegroundColor Green
Write-Host "شغّل الفحص: .\scripts\verify-deployment.ps1 -BaseUrl http://YOUR-DOMAIN" -ForegroundColor Cyan
