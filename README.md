# Mosque Dashboard – Starter (Next.js + TypeScript)

واجهة أمامية فقط؛ تعتمد على Next.js (App Router) + Tailwind + shadcn/ui (مكوّنات أساسية) + TanStack Query + Zod + سياق للمصادقة + Axios.

## البدء

1) انسخ ملف البيئة:
```bash
cp .env.local.example .env.local
```
2) ثبّت الاعتماديات:
```bash
npm i
```
3) شغّل التطوير:
```bash
npm run dev
```

> عدّل `NEXT_PUBLIC_API_URL` في `.env.local` ليشير إلى الـ API لديك.

## ما الذي تم تضمينه؟

- **صفحة تسجيل دخول بسيطة** (username/password) تربط دالة `login` بـ `POST /auth/login` (عدّل المسار حسبك).
- **حماية الروابط عبر middleware**: أي مسار غير عام يتطلب كوكي `access_token`. المسارات العامة: `/login` فقط.
- **Context للمصادقة** لتخزين/إزالة التوكن (كوكي) والانتقال بين الصفحات.
- **عميل Axios** بإضافة رأس Authorization من الكوكي تلقائيًا.
- **تهيئة TanStack Query** كمزوّد عام.
- **تقسيم وحدات API** كما طلبت (Users, Districts, Mosques + filters/enums, Mosque Attachments, Workers + enums/profile/roles).
- **مكونات shadcn/ui مصغّرة**: Button, Input, Label, Card + Toaster.

## المجلدات المهمة
```
app/                     # App Router
  (auth)/login/          # صفحة تسجيل الدخول
  dashboard/             # Placeholder
  layout.tsx             # RTL + Providers
  providers.tsx          # Query + Auth providers
components/ui/           # مكونات shadcn المبسطة
contexts/                # AuthContext
features/                # وحدات الموارد (API فقط، بدون صفحات)
lib/                     # axios client + utils + auth constants
middleware.ts            # حماية الروابط
```

## تكييف مع API الفعلي
- غيّر مسار تسجيل الدخول في `contexts/AuthContext.tsx`.
- حدّث أنواع `features/shared/types.ts` بحسب مخططك.
- عدّل مسارات الـ enums إن كانت مختلفة.

> لاحقًا يمكنك إضافة صفحات CRUD داخل `app/dashboard/...` لكل وحدة، واستخدام الدوال الجاهزة في `features/*/api.ts`.

موفّق 🌟
