import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | حقيبتي',
  description: 'سياسة خصوصية بيانات المستخدمين في منصة حقيبتي',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold mb-3">سياسة الخصوصية</h1>
          <p className="text-muted-foreground">Politique de confidentialité</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. المعلومات التي نجمعها</h2>
            <p>
              نجمع المعلومات التالية: الاسم الكامل، رقم الهاتف، البريد الإلكتروني (اختياري)، العنوان (الولاية، البلدية، العنوان التفصيلي)، وتاريخ الطلبات.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. كيف نستخدم معلوماتك</h2>
            <p>
              نستخدم بياناتك لمعالجة طلباتك، التواصل معك بخصوص التوصيل، وتحسين خدماتنا. لا نبيع أو نشارك بياناتك مع أطراف ثالثة لأغراض تسويقية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. حماية البيانات</h2>
            <p>
              نتخذ إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الكشف أو الإتلاف. تُخزن كلمات المرور مشفرة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط الأساسية لتحسين تجربة التصفح وللحفاظ على محتوى سلة التسوق. لا نستخدم ملفات تعقب لأغراض إعلانية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. حقوقك</h2>
            <p>
              لديك الحق في الوصول إلى بياناتك، تصحيحها، أو طلب حذفها. يمكنك التواصل معنا في أي وقت لممارسة هذه الحقوق.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. الاحتفاظ بالبيانات</h2>
            <p>
              نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الضرورة لتقديم خدماتنا. يمكنك حذف حسابك في أي وقت.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. التعديلات</h2>
            <p>
              قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم إشعارك بأي تغييرات جوهرية.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. التواصل</h2>
            <p>
              لأي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر القنوات المتاحة في الموقع.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
