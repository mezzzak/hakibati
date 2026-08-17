import csv
import os

# Algerian school-supply brands mapped by what they are famous for.
# Each tuple is (brand_name, price_multiplier).
BRAND_MAPPINGS = {
    # ── حقائب مدرسية ─────────────────────────────────────
    "حقائب مدرسية, Sacs scolaires": [
        ("Techno", 1.15),
        ("Maped", 1.25),
        ("Vertex", 1.1),
    ],

    # ── تنظيم وتخزين ─────────────────────────────────────
    "تنظيم وتخزين, Organisation et rangement": [
        ("Comix", 1.15),
        ("Exacompta", 1.25),
        ("Maped", 1.2),
        ("Oxford", 1.2),
        ("Deli", 1.1),
    ],

    # ── كراسات ودفاتر ────────────────────────────────────
    "كراسات ودفاتر, Cahiers et carnets": [
        ("Techno", 1.05),
        ("Oxford", 1.3),
        ("Conquérant", 1.15),
        ("Clairefontaine", 1.4),
        ("Hilal", 1.1),
        ("BIC", 1.05),
        ("Faber-Castell", 1.25),
        ("Milan", 1.15),
    ],

    # ── الرسم والفنون ────────────────────────────────────
    "الرسم والفنون, Dessin et arts": [
        ("Techno", 1.1),
        ("Maped", 1.2),
        ("Faber-Castell", 1.35),
        ("Canson", 1.3),
        ("Artline", 1.25),
        ("Stabilo", 1.2),
        ("Sharpie", 1.2),
        ("BIC", 1.05),
        ("Staedtler", 1.25),
    ],

    # ── أدوات الكتابة ─────────────────────────────────────
    "أدوات الكتابة, Fournitures d'écriture": [
        ("BIC", 1.1),
        ("Pilot", 1.35),
        ("Stabilo", 1.25),
        ("Faber-Castell", 1.3),
        ("Uni-ball", 1.3),
        ("Schneider", 1.25),
        ("Pelikan", 1.2),
        ("Montex", 1.15),
        ("Rayane", 1.1),
        ("Milan", 1.15),
        ("Staedtler", 1.25),
        ("Maped", 1.15),
    ],

    # ── الهندسة والقياس ───────────────────────────────────
    "الهندسة والقياس, Géométrie et mesure": [
        ("Maped", 1.25),
        ("Deli", 1.2),
        ("Staedtler", 1.3),
        ("Helix", 1.15),
        ("Casio", 1.35),
        ("Faber-Castell", 1.25),
        ("BIC", 1.1),
    ],

    # ── الموسيقى ──────────────────────────────────────────
    "الموسيقى, Musique": [
        ("Maped", 1.1),
        ("Staedtler", 1.15),
        ("Techno", 1.05),
    ],

    # ── التغليف والحماية ──────────────────────────────────
    "التغليف والحماية, Emballage et protection": [
        ("Comix", 1.1),
        ("Exacompta", 1.15),
        ("Oxford", 1.15),
        ("Maped", 1.1),
    ],

    # ── أدوات القسم ──────────────────────────────────────
    "أدوات القسم, Fournitures de classe": [
        ("Maped", 1.2),
        ("BIC", 1.1),
        ("Milan", 1.15),
        ("Pelikan", 1.15),
        ("Staedtler", 1.15),
    ],

    # ── التربية البدنية والرياضية ─────────────────────────
    "التربية البدنية والرياضية, Éducation physique et sportive": [
        ("Vertex", 1.1),
        ("Techno", 1.05),
    ],

    # ── أطقم مدرسية ───────────────────────────────────────
    "أطقم مدرسية, Kits scolaires": [
        ("Techno", 1.15),
        ("Maped", 1.25),
        ("BIC", 1.2),
        ("Faber-Castell", 1.35),
        ("Oxford", 1.2),
        ("Milan", 1.15),
        ("Pelikan", 1.2),
        ("Vertex", 1.1),
        ("Rayane", 1.1),
        ("Deli", 1.15),
        ("Staedtler", 1.25),
    ],
}

# Fallback for any un-mapped category
DEFAULT_BRANDS = [
    ("Techno", 1.05),
    ("Maped", 1.15),
    ("BIC", 1.1),
    ("Vertex", 1.05),
]

# Product-level overrides for items that need specific brands
# regardless of their broader category.
PRODUCT_BRAND_OVERRIDES = {
    "Colle": [
        ("UHU", 1.3),
        ("Pritt", 1.25),
    ],
    "Ruban adhésif transparent": [
        ("UHU", 1.2),
    ],
}

def round_price(price):
    """Round price to nearest 5 DZD for cleaner numbers"""
    return round(price / 5) * 5

def main():
    input_path = r"c:\Users\ghoui\Downloads\produits_scolaires_Algerie.csv"
    output_path = r"c:\Users\ghoui\Downloads\produits_scolaires_Algerie_with_brands.csv"

    with open(input_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    new_rows = []
    current_id = 1

    for row in rows:
        category = row["category"].strip()
        product_name = row["nameFr"].strip()
        base_price = float(row["unitPriceDZD"])

        # Get brands for this category
        brands = BRAND_MAPPINGS.get(category, DEFAULT_BRANDS)

        # Merge product-specific override brands (avoid duplicates)
        override_brands = PRODUCT_BRAND_OVERRIDES.get(product_name, [])
        existing_names = {b[0] for b in brands}
        merged_brands = list(brands) + [b for b in override_brands if b[0] not in existing_names]

        for brand, multiplier in merged_brands:
            new_row = dict(row)
            new_row["id"] = str(current_id)
            new_row["brand"] = brand
            new_row["unitPriceDZD"] = str(int(round_price(base_price * multiplier)))
            new_rows.append(new_row)
            current_id += 1

    # Write output
    fieldnames = ["id", "nameAr", "nameFr", "descriptionAr", "descriptionFr", "Color", "brand", "category", "unitPriceDZD"]

    with open(output_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(new_rows)

    print(f"Done! Generated {len(new_rows)} products from {len(rows)} original products.")
    print(f"Output saved to: {output_path}")

    # Print sample
    print("\nSample (first 15 rows):")
    for row in new_rows[:15]:
        print(f"  {row['id']:>3}. {row['nameFr']:<30} | {row['brand']:<15} | {row['unitPriceDZD']} DZD")

if __name__ == "__main__":
    main()
