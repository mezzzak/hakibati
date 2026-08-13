'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { WILAYAS } from '@/lib/wilayas';
import { registerUser } from '@/lib/order-actions';
import { toast } from 'sonner';
import { Eye, EyeOff, Phone, Lock, User, MapPin, Building2 } from 'lucide-react';

type AuthMode = 'login' | 'register';

export function AuthForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      phone,
      password,
      redirect: false,
    });

    if (result?.error) {
      const msg = t('رقم الهاتف أو كلمة المرور غير صحيحة', 'Numéro ou mot de passe incorrect');
      setError(msg);
      toast.error(msg);
    } else {
      toast.success(t('تم تسجيل الدخول بنجاح', 'Connexion réussie'));
      // Wait briefly for the session cookie to be set before reading it
      await new Promise((resolve) => setTimeout(resolve, 300));
      const session = await getSession();
      const staffRoles = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];
      if (staffRoles.includes(session?.user?.role as string)) {
        window.location.href = '/admin/orders';
      } else {
        window.location.href = '/account/orders';
      }
      return;
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!phone.match(/^(05|06|07)\d{8}$/)) {
      setError(t('رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام', 'Le numéro doit commencer par 05, 06 ou 07 et contenir 10 chiffres'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Le mot de passe doit contenir au moins 6 caractères'));
      setLoading(false);
      return;
    }

    const result = await registerUser({
      fullName,
      phone,
      password,
      wilaya,
      commune,
      address,
      email: email || undefined,
    });

    if (result.success) {
      toast.success(t('تم إنشاء الحساب بنجاح', 'Compte créé avec succès'));
      const loginResult = await signIn('credentials', {
        phone,
        password,
        redirect: false,
      });
      if (loginResult?.ok) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const session = await getSession();
        const staffRoles = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];
        if (staffRoles.includes(session?.user?.role as string)) {
          window.location.href = '/admin/orders';
        } else {
          window.location.href = '/account/orders';
        }
        return;
      }
    } else {
      const msg = result.error || t('فشل في إنشاء الحساب', 'Échec de la création du compte');
      setError(msg);
      toast.error(msg);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === 'login'
            ? t('تسجيل الدخول', 'Connexion')
            : t('إنشاء حساب جديد', 'Créer un compte')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === 'login'
            ? t('أدخل بياناتك للوصول إلى حسابك', 'Entrez vos identifiants pour accéder à votre compte')
            : t('أنشئ حساباً لتتبع طلباتك وحفظ بياناتك', 'Créez un compte pour suivre vos commandes')}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {t('رقم الهاتف', 'Numéro de téléphone')}
          </label>
          <input
            type="tel"
            required
            dir="ltr"
            placeholder="05XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* Full Name - register only */}
        {mode === 'register' && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <User className="h-4 w-4 text-muted-foreground" />
              {t('الاسم الكامل', 'Nom complet')}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            {t('كلمة المرور', 'Mot de passe')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Register fields */}
        {mode === 'register' && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {t('الولاية', 'Wilaya')}
              </label>
              <select
                required
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t('اختر الولاية', 'Choisir la wilaya')}</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.nameAr}>
                    {w.code} - {w.nameAr} ({w.nameFr})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {t('البلدية', 'Commune')}
              </label>
              <input
                type="text"
                required
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('العنوان التفصيلي', 'Adresse détaillée')}</label>
              <textarea
                required
                rows={2}
                dir="auto"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t('البريد الإلكتروني (اختياري)', 'Email (optionnel)')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading
            ? t('جار المعالجة...', 'Traitement...')
            : mode === 'login'
            ? t('تسجيل الدخول', 'Se connecter')
            : t('إنشاء الحساب', 'Créer le compte')}
        </Button>
      </form>

      <div className="text-center text-sm">
        {mode === 'login' ? (
          <>
            {t('ليس لديك حساب؟', "Vous n'avez pas de compte ?")}{' '}
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="text-primary font-semibold hover:underline"
            >
              {t('إنشاء حساب', 'Créer un compte')}
            </button>
          </>
        ) : (
          <>
            {t('لديك حساب بالفعل؟', 'Vous avez déjà un compte ?')}{' '}
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="text-primary font-semibold hover:underline"
            >
              {t('تسجيل الدخول', 'Se connecter')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
