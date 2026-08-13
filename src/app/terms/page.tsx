import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط الاستخدام | حقيبتي',
  description: 'شروط وأحكام استخدام منصة حقيبتي',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">شروط الاستخدام</h1>
          <p className="text-muted-foreground">Conditions d&apos;utilisation</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. مقدمة</h2>
            <p>
              باستخدامك لمنصة حقيبتي، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. التسجيل والحساب</h2>
            <p>
              يجب أن تكون المعلومات التي تقدمها عند التسجيل دقيقة وكاملة. أنت مسؤول عن الحفاظ على سرية بيانات تسجيل الدخول الخاصة بك.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. الطلبات والدفع</h2>
            <p>
              جميع الطلبات خاضعة للتوفر. نحتفظ بالحق في رفض أو إلغاء أي طلب لأي سبب. الدفع عند الاستلام هو الطريقة الوحيدة المتاحة حالياً.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. الأسعار</h2>
            <p>
              الأسعار المعروضة تشمل الضرائب. قد تتغير الأسعار من وقت لآخر دون إشعار مسبق. سعر الشحن محدد حسب الولاية وطريقة التوصيل.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. التوصيل</h2>
            <p>
              أوقات التوصيل المقدرة هي تقديرات فقط. لا نتحمل المسؤولية عن التأخير الناتج عن ظروف خارجة عن إرادتنا.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. الإرجاع والاستبدال</h2>
            <p>
              يمكن الإرجاع خلال 48 ساعة من الاستلام وفقاً لسياسة الإرجاع المعتمدة. يجب أن يكون المنتج في حالته الأصلية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. الملكية الفكرية</h2>
            <p>
              جميع المحتويات على هذا الموقع (شعارات، صور، نصوص) هي ملك لحقيبتي ومحمية بموجب قوانين الملكية الفكرية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. التعديلات</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيصبح أي تعديل ساري المفعول فور نشره على الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">9. التواصل</h2>
            <p>
              لأي استفسار أو شكوى، يرجى التواصل معنا عبر البريد الإلكتروني أو الهاتف المذكور في صفحة التواصل.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
