import { Metadata } from 'next';
import { Truck, Home, MapPin, Clock, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'طرق التوصيل | حقيبتي',
  description: 'معلومات عن طرق التوصيل والشحن لجميع ولايات الجزائر',
};

const methods = [
  {
    icon: Home,
    title: 'توصيل للمنزل',
    titleFr: 'Livraison à domicile',
    desc: 'يصلك الطلب مباشرة إلى باب منزلك في جميع أنحاء الجزائر. يقوم مندوب التوصيل بالاتصال بك قبل الوصول.',
    descFr: 'Votre commande vous est livrée directement à votre porte dans toute l\'Algérie. Le livreur vous appelle avant d\'arriver.',
    price: '400 د.ج',
    time: '24-72 ساعة',
  },
  {
    icon: MapPin,
    title: 'نقطة استلام',
    titleFr: 'Point de retrait',
    desc: 'استلم طلبك من أقرب نقطة استلام معتمدة في ولايتك. توفر هذه الخدمة في معظم الولايات.',
    descFr: 'Récupérez votre commande au point de retrait agréé le plus proche de votre wilaya. Ce service est disponible dans la plupart des wilayas.',
    price: '0 د.ج',
    time: '24-72 ساعة',
  },
];

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">طرق التوصيل</h1>
          <p className="text-muted-foreground">Modes de livraison</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {methods.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border bg-card p-6 shadow-sm space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <m.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{m.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {m.desc}
              </p>
              <div className="flex items-center gap-4 pt-2 border-t">
                <div className="flex items-center gap-1.5 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-bold">{m.price}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{m.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border bg-muted/30 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="font-bold">ملاحظات مهمة</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              التوصيل متوفر لجميع ولايات الجزائر الـ 58.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              يتم الاتصال بالعميل قبل التوصيل للتأكد من العنوان والموعد.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              الدفع عند الاستلام (COD) هو الطريقة الوحيدة المتاحة حالياً.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              أوقات التوصيل قد تتغير قليلاً حسب الظروف الجوية أو المناطق النائية.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
