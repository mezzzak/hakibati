'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { WILAYAS } from '@/lib/wilayas';
import { updateProfile } from '@/lib/order-actions';
import { toast } from 'sonner';
import { User, Phone, MapPin, Building2, Mail, Save } from 'lucide-react';

interface ProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    wilaya?: string | null;
    commune?: string | null;
    address?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [wilaya, setWilaya] = useState(user.wilaya || '');
  const [commune, setCommune] = useState(user.commune || '');
  const [address, setAddress] = useState(user.address || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      fullName,
      phone,
      wilaya,
      commune,
      address,
      email: email || undefined,
    });

    if (result.success) {
      toast.success(t('تم تحديث البيانات بنجاح', 'Profil mis à jour'));
      await update({
        name: fullName,
        wilaya,
        commune,
        address,
      });
      router.refresh();
    } else {
      toast.error(result.error || t('فشل في التحديث', 'Échec de la mise à jour'));
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <p className="text-xs text-muted-foreground">
          {t('لا يمكن تغيير رقم الهاتف حالياً', 'Le numéro ne peut pas être modifié actuellement')}
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium flex items-center gap-1.5">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {t('البريد الإلكتروني', 'Email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

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
          rows={3}
          dir="auto"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>

      <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
        <Save className="h-4 w-4" />
        {loading ? t('جار الحفظ...', 'Enregistrement...') : t('حفظ التغييرات', 'Enregistrer')}
      </Button>
    </form>
  );
}
