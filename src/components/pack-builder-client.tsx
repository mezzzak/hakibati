'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GradeLevel, type SupplyItem } from '@/types';
import { useLanguage } from '@/components/language-provider';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet } from '@/components/ui/sheet';
import { PackBuilderSkeleton } from '@/components/pack-builder-skeleton';
import { formatDZD } from '@/lib/utils';
import Link from 'next/link';
import {
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  Package,
  Backpack,
  Check,
  Sparkles,
  AlertCircle,
  Layers,
  X,
  Search,
} from 'lucide-react';

interface PackItemState {
  supplyItem: SupplyItem;
  quantity: number;
  included: boolean;
}

interface PackData {
  id: string;
  nameAr: string;
  nameFr: string | null;
  descriptionAr: string | null;
  descriptionFr: string | null;
  gradeLevel: string;
  basePriceDZD: number;
  discountPercent: number;
  items: {
    id: string;
    quantity: number;
    isOptional: boolean;
    supplyItem: SupplyItem;
  }[];
}

interface BackpackData {
  id: string;
  nameAr: string;
  nameFr: string | null;
  unitPriceDZD: number;
}

function validGrade(g?: string): GradeLevel {
  const validValues = Object.values(GradeLevel);
  if (g && validValues.includes(g as GradeLevel)) {
    return g as GradeLevel;
  }
  return GradeLevel.AP1;
}

function isCustomGrade(g: GradeLevel): boolean {
  return g === GradeLevel.CUSTOM;
}

export function PackBuilderClient({ initialGrade }: { initialGrade?: string }) {
  const router = useRouter();
  const { t, isAr } = useLanguage();
  const { addItem, setCartOpen } = useCartStore();

  const [pack, setPack] = useState<PackData | null>(null);
  const [items, setItems] = useState<PackItemState[]>([]);
  const [allSupplies, setAllSupplies] = useState<SupplyItem[]>([]);
  const [backpacks, setBackpacks] = useState<BackpackData[]>([]);
  const [selectedBackpack, setSelectedBackpack] = useState<BackpackData | null>(null);
  const [showBackpackDrawer, setShowBackpackDrawer] = useState(false);
  const [showAddItemsDrawer, setShowAddItemsDrawer] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [availablePacks, setAvailablePacks] = useState<PackData[]>([]);

  const grade = validGrade(initialGrade);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const isCustom = isCustomGrade(grade);

        const [packRes, suppliesRes, backpackRes] = await Promise.all([
          isCustom
            ? Promise.resolve({ json: () => Promise.resolve({ success: true, data: [] }) })
            : fetch(`/api/packs?gradeLevel=${grade}&activeOnly=true`),
          fetch(`/api/supplies?activeOnly=true`),
          fetch(`/api/supplies?category=cartables&activeOnly=true`),
        ]);

        const packData = isCustom ? { success: true, data: [] } : await packRes.json();
        const suppliesData = await suppliesRes.json();
        const backpackData = await backpackRes.json();

        // Store all supplies for adding/swapping
        if (suppliesData.success) {
          setAllSupplies(suppliesData.data);
        }

        if (isCustom) {
          setPack({
            id: 'custom-pack',
            nameAr: 'حقيبة مخصصة',
            nameFr: 'Kit personnalisé',
            descriptionAr: 'حقيبة مخصصة بناءً على اختياراتك',
            descriptionFr: 'Kit personnalisé selon vos choix',
            gradeLevel: GradeLevel.CUSTOM,
            basePriceDZD: 0,
            discountPercent: 0,
            items: [],
          });
          setItems([]);
        } else {
          if (packData.success && packData.data.length > 0) {
            if (packData.data.length === 1) {
              const fetchedPack = packData.data[0];
              setPack(fetchedPack);
              setItems(
                fetchedPack.items.map((item: any) => ({
                  supplyItem: item.supplyItem,
                  quantity: item.quantity,
                  included: true,
                }))
              );
            } else {
              setAvailablePacks(packData.data);
            }
          } else {
            setError(t('لا توجد حقيبة متاحة لهذا المستوى', 'Aucun kit disponible pour ce niveau'));
          }
        }

        if (backpackData.success && backpackData.data.length > 0) {
          setBackpacks(backpackData.data);
        }
      } catch (err) {
        console.error('Failed to fetch pack data:', err);
        setError(t('حدث خطأ أثناء تحميل البيانات', 'Erreur lors du chargement des données'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [grade, t]);

  const toggleItem = useCallback((index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, included: !item.included } : item
      )
    );
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, delta: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  }, []);

  const swapItem = useCallback((newSupplyItem: SupplyItem) => {
    if (swapTargetIndex === null) return;
    setItems((prev) =>
      prev.map((item, i) =>
        i === swapTargetIndex
          ? { ...item, supplyItem: newSupplyItem, included: true }
          : item
      )
    );
    setShowSwapDrawer(false);
    setSwapTargetIndex(null);
  }, [swapTargetIndex]);

  const addNewItem = useCallback((supplyItem: SupplyItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.supplyItem.id === supplyItem.id);
      if (existing) {
        return prev.map((i) =>
          i.supplyItem.id === supplyItem.id
            ? { ...i, quantity: i.quantity + 1, included: true }
            : i
        );
      }
      return [...prev, { supplyItem, quantity: 1, included: true }];
    });
  }, []);

  const calculateTotal = useMemo(() => {
    const itemsTotal = items
      .filter((item) => item.included)
      .reduce((sum, item) => sum + item.supplyItem.unitPriceDZD * item.quantity, 0);
    const backpackTotal = selectedBackpack?.unitPriceDZD ?? 0;
    return itemsTotal + backpackTotal;
  }, [items, selectedBackpack]);

  const includedCount = useMemo(
    () => items.filter((i) => i.included).length,
    [items]
  );

  const openSwapDrawer = useCallback((index: number) => {
    setSwapTargetIndex(index);
    setShowSwapDrawer(true);
  }, []);

  const getAlternatives = useCallback((item: PackItemState) => {
    return allSupplies.filter(
      (s) =>
        s.category === item.supplyItem.category &&
        s.id !== item.supplyItem.id &&
        s.isActive !== false
    );
  }, [allSupplies]);

  const getAvailableItemsToAdd = useMemo(() => {
    return allSupplies.filter((s) => s.isActive !== false);
  }, [allSupplies]);

  const filteredAddItems = useMemo(() => {
    if (!searchQuery.trim()) return getAvailableItemsToAdd;
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    return getAvailableItemsToAdd.filter((item) => {
      const haystack = [
        item.nameAr,
        item.nameFr,
        item.brand,
        item.category,
        (item as any).categoryAr,
        (item as any).categoryFr,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [getAvailableItemsToAdd, searchQuery]);

  const addToCart = useCallback(() => {
    if (!pack) return;

    const customDesc = items
      .filter((i) => i.included)
      .map((i) => `${i.supplyItem.id}::${isAr ? i.supplyItem.nameAr : (i.supplyItem.nameFr || i.supplyItem.nameAr)}::${i.supplyItem.unitPriceDZD}::${i.quantity}`)
      .join(' · ');

    addItem({
      type: 'pack',
      hakibatiPack: {
        ...pack,
        items: [],
      } as any,
      quantity: 1,
      customPrice: calculateTotal,
      customDescription: customDesc,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setCartOpen(true);
  }, [pack, items, calculateTotal, addItem, setCartOpen]);

  const selectPack = useCallback((selected: PackData) => {
    setPack(selected);
    setItems(
      selected.items.map((item: any) => ({
        supplyItem: item.supplyItem,
        quantity: item.quantity,
        included: true,
      }))
    );
    setAvailablePacks([]);
  }, []);

  if (loading) {
    return <PackBuilderSkeleton />;
  }

  if (availablePacks.length > 0) {
    return (
      <div className="min-h-screen pb-28">
        <div className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 gap-1">
              <ArrowRight className="h-4 w-4" />
              {t('رجوع', 'Retour')}
            </Button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {t('اختر الحقيبة', 'Choisissez votre kit')}
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              {t('يوجد عدة حقائب لهذا المستوى، اختر المناسبة لك', 'Plusieurs kits sont disponibles pour ce niveau, choisissez celui qui vous convient')}
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availablePacks.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPack(p)}
                className="group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20 text-start"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <Package className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 text-start">
                  <h3 className="text-lg font-bold">{isAr ? p.nameAr : (p.nameFr || p.nameAr)}</h3>
                  {p.nameFr && p.nameAr && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAr ? p.nameFr : p.nameAr}
                    </p>
                  )}
                  {isAr ? (p.descriptionAr && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.descriptionAr}</p>) : (p.descriptionFr && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.descriptionFr}</p>)}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-primary">
                      {formatDZD(Math.round(p.basePriceDZD * (1 - p.discountPercent / 100)))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {p.items.length} {t('عنصر', 'articles')}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="mx-auto h-14 w-14 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {error || t('لا توجد حقيبة متاحة', 'Aucun kit disponible')}
        </h2>
        <Button asChild className="mt-6">
          <Link href="/">{t('العودة للرئيسية', 'Retour à l\'accueil')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      {/* Pack Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
              <ArrowRight className="h-4 w-4" />
              {t('رجوع', 'Retour')}
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
              <Link href="/#grade-selector">
                {t('تغيير المستوى', 'Changer de niveau')}
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {isCustomGrade(grade)
                    ? t('بناء الحقيبة يدوياً', 'Construction manuelle')
                    : t('تعديل الحقيبة', 'Modifier le kit')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                {isAr ? pack.nameAr : (pack.nameFr || pack.nameAr)}
              </h1>
              {pack.nameFr && pack.nameAr && (
                <p className="text-muted-foreground mt-1">
                  {isAr ? pack.nameFr : pack.nameAr}
                </p>
              )}
              {isAr ? (pack.descriptionAr && (
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  {pack.descriptionAr}
                </p>
              )) : (pack.descriptionFr && (
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  {pack.descriptionFr}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                {formatDZD(calculateTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Items count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t(`${includedCount} عنصر مختار من ${items.length}`, `${includedCount} articles sélectionnés sur ${items.length}`)}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setItems((prev) => prev.map((i) => ({ ...i, included: true })))}
              className="text-sm text-primary hover:underline"
            >
              {t('تحديد الكل', 'Tout sélectionner')}
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => setItems((prev) => prev.map((i) => ({ ...i, included: false })))}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              {t('إلغاء الكل', 'Tout désélectionner')}
            </button>
          </div>
        </div>

        {/* Pack Items */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const alternatives = getAlternatives(item);
            const itemName = isAr ? item.supplyItem.nameAr : (item.supplyItem.nameFr || item.supplyItem.nameAr);
            const itemSubName = item.supplyItem.nameFr && item.supplyItem.nameAr
              ? (isAr ? item.supplyItem.nameFr : item.supplyItem.nameAr)
              : null;

            return (
              <div
                key={`${item.supplyItem.id}-${index}`}
                className={`rounded-xl border p-3 sm:p-4 transition-all ${
                  item.included
                    ? 'bg-card border-border'
                    : 'bg-muted/30 border-muted opacity-60'
                }`}
              >
                {/* Mobile: two-row layout | Desktop: single row */}
                <div className="flex items-start gap-3">
                  {/* Checkbox — bigger on mobile */}
                  <div className="pt-0.5">
                    <Checkbox
                      checked={item.included}
                      onCheckedChange={() => toggleItem(index)}
                    />
                  </div>

                  {/* Product icon */}
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {itemName.slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base leading-tight">{itemName}</p>
                    {itemSubName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{itemSubName}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatDZD(item.supplyItem.unitPriceDZD)}
                      <span className="text-xs font-normal text-muted-foreground mr-1">
                        / {t('الوحدة', 'unité')}
                      </span>
                    </p>
                  </div>

                  {/* Desktop actions */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      onClick={() => updateQuantity(index, -1)}
                      disabled={!item.included}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-md"
                      onClick={() => updateQuantity(index, 1)}
                      disabled={!item.included}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="hidden sm:flex flex-col gap-1">
                    {alternatives.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-muted-foreground hover:text-primary"
                        onClick={() => openSwapDrawer(index)}
                        title={t('استبدال المنتج', 'Changer de marque')}
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(index)}
                      title={t('إزالة', 'Retirer')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile: quantity + actions row */}
                <div className="flex sm:hidden items-center justify-between mt-3 pl-7">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      disabled={!item.included}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-foreground disabled:opacity-40 active:bg-muted transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      disabled={!item.included}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-foreground disabled:opacity-40 active:bg-muted transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {alternatives.length > 0 && (
                      <button
                        onClick={() => openSwapDrawer(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground active:bg-muted transition-colors"
                        title={t('استبدال', 'Changer')}
                      >
                        <Layers className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground active:bg-muted transition-colors"
                      title={t('إزالة', 'Retirer')}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add More Items */}
        <button
          onClick={() => setShowAddItemsDrawer(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary hover:bg-primary/5"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">{t('إضافة أدوات أخرى', 'Ajouter d\'autres articles')}</span>
        </button>

        {/* Backpack Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Backpack className="h-5 w-5 text-primary" />
              {t('حقيبة الظهر', 'Cartable / Sac à dos')}
            </h3>
            {selectedBackpack && (
              <button
                onClick={() => setSelectedBackpack(null)}
                className="text-sm text-destructive hover:underline"
              >
                {t('إزالة', 'Retirer')}
              </button>
            )}
          </div>

          {selectedBackpack ? (
            <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Backpack className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{isAr ? selectedBackpack.nameAr : (selectedBackpack.nameFr || selectedBackpack.nameAr)}</p>
                <p className="text-sm font-bold text-primary">{formatDZD(selectedBackpack.unitPriceDZD)}</p>
              </div>
              <Check className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <button
              onClick={() => setShowBackpackDrawer(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 p-6 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary hover:bg-primary/5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{t('إضافة حقيبة جديدة', 'Ajouter un cartable')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sticky Total Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:bottom-0 bottom-[60px]">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {includedCount} {t('عنصر', 'articles')} · {t('المجموع', 'Total')}
            </p>
            <p className="text-lg sm:text-2xl font-extrabold text-primary leading-tight">
              {formatDZD(calculateTotal)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 text-sm"
              asChild
            >
              <Link href="/#grade-selector">
                <Package className="h-4 w-4" />
                {t('أضف حزمة أخرى', 'Ajouter')}
              </Link>
            </Button>
            <Button
              size="default"
              className={`gap-2 text-sm px-5 h-11 rounded-xl transition-all ${
                addedToCart ? 'bg-green-600 hover:bg-green-600' : ''
              }`}
              onClick={addToCart}
              disabled={includedCount === 0}
            >
              {addedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('تمت الإضافة', 'Ajouté')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  {t('أضف إلى السلة', 'Ajouter')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Backpack Drawer */}
      <Sheet
        open={showBackpackDrawer}
        onOpenChange={setShowBackpackDrawer}
        title={t('اختر حقيبة الظهر', 'Choisissez un cartable')}
        side="right"
      >
        <div className="space-y-3">
          {backpacks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>{t('لا توجد حقائب متاحة حالياً', 'Aucun cartable disponible pour le moment')}</p>
            </div>
          ) : (
            backpacks.map((backpack) => (
              <button
                key={backpack.id}
                onClick={() => {
                  setSelectedBackpack(backpack);
                  setShowBackpackDrawer(false);
                }}
                className="flex w-full items-center gap-4 rounded-xl border p-4 text-start transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Backpack className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="flex-1 text-start">
                  <p className="font-semibold">{isAr ? backpack.nameAr : (backpack.nameFr || backpack.nameAr)}</p>
                  {backpack.nameFr && backpack.nameAr && (
                    <p className="text-xs text-muted-foreground">{isAr ? backpack.nameFr : backpack.nameAr}</p>
                  )}
                </div>
                <div className="text-end">
                  <p className="text-lg font-bold text-primary">{formatDZD(backpack.unitPriceDZD)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </Sheet>

      {/* Add Items Drawer */}
      <Sheet
        open={showAddItemsDrawer}
        onOpenChange={(open) => {
          setShowAddItemsDrawer(open);
          if (!open) setSearchQuery('');
        }}
        title={null}
        side="right"
        size="wide"
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-bold">
              {t('إضافة أدوات أخرى', 'Ajouter d\'autres articles')}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t(`${allSupplies.length} منتج متاح`, `${allSupplies.length} produits disponibles`)}
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ابحث باسم المنتج أو الفئة...', 'Rechercher par nom ou catégorie...')}
              className="w-full rounded-xl border bg-background pr-9 pl-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Items Card */}
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="bg-primary/[0.04] px-5 py-3 border-b flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">
                {t('المنتجات المتاحة', 'Produits disponibles')}
              </h3>
              <span className="mr-auto text-xs text-muted-foreground">
                {filteredAddItems.length} {t('منتج', 'produit')}
              </span>
            </div>
            <div className="p-5 space-y-1 max-h-[50vh] overflow-y-auto">
              {filteredAddItems.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mb-2" />
                  <p>{t('لا توجد أدوات مطابقة للبحث', 'Aucun article ne correspond à la recherche')}</p>
                </div>
              ) : (
                filteredAddItems.map((item, idx) => {
                  const existing = items.find((i) => i.supplyItem.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 py-3 ${idx !== filteredAddItems.length - 1 ? 'border-b' : ''}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold">{isAr ? item.nameAr : (item.nameFr || item.nameAr)}</p>
                            {item.nameFr && item.nameAr && (
                              <p className="text-xs text-muted-foreground">{isAr ? item.nameFr : item.nameAr}</p>
                            )}
                            {item.brand && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {t('العلامة:', 'Marque:')} {item.brand}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {t('الفئة:', 'Catégorie:')} {isAr ? ((item as any).categoryAr || item.category) : ((item as any).categoryFr || item.category)}
                            </p>
                          </div>
                          <div className="text-end shrink-0">
                            <p className="text-sm font-bold text-primary">{formatDZD(item.unitPriceDZD)}</p>
                            {existing && (
                              <p className="text-xs text-muted-foreground">
                                {t('في الحقيبة:', 'Dans le kit:')} {existing.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={existing ? 'secondary' : 'outline'}
                        className="shrink-0 gap-1"
                        onClick={() => addNewItem(item)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {existing ? t('زيادة', '+1') : t('إضافة', 'Ajouter')}
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </Sheet>

      {/* Swap Item Drawer */}
      <Sheet
        open={showSwapDrawer}
        onOpenChange={(open) => {
          setShowSwapDrawer(open);
          if (!open) setSwapTargetIndex(null);
        }}
        title={t('استبدال المنتج', 'Changer de marque')}
        side="right"
      >
        <div className="space-y-3">
          {swapTargetIndex !== null && getAlternatives(items[swapTargetIndex]).length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
              <AlertCircle className="h-10 w-10 mb-2" />
              <p>{t('لا توجد بدائل متاحة', 'Aucune alternative disponible')}</p>
            </div>
          ) : swapTargetIndex !== null ? (
            <>
              <p className="text-sm text-muted-foreground">
                {t('المنتج الحالي:', 'Produit actuel:')} {' '}
                <span className="font-semibold text-foreground">{isAr ? items[swapTargetIndex].supplyItem.nameAr : (items[swapTargetIndex].supplyItem.nameFr || items[swapTargetIndex].supplyItem.nameAr)}</span>
              </p>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {getAlternatives(items[swapTargetIndex]).map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => swapItem(alt)}
                    className="flex w-full items-center gap-3 rounded-xl border p-3 text-start transition-all hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                      {(isAr ? alt.nameAr : (alt.nameFr || alt.nameAr)).slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0 text-start">
                      <p className="font-semibold text-sm truncate">{isAr ? alt.nameAr : (alt.nameFr || alt.nameAr)}</p>
                      {alt.nameFr && alt.nameAr && (
                        <p className="text-xs text-muted-foreground truncate">{isAr ? alt.nameFr : alt.nameAr}</p>
                      )}
                      <p className="text-sm font-bold text-primary">{formatDZD(alt.unitPriceDZD)}</p>
                    </div>
                    <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </Sheet>
    </div>
  );
}
