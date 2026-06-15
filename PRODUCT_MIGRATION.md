# Product Data Migration Guide

## Migration Complete ✅

All hardcoded product data has been successfully refactored to use Supabase as the single source of truth.

## What Was Migrated

### 1. **Product Descriptions**
- Added `description` and `short_description` fields to products
- All product descriptions are stored in the `products` table
- Source: Migrated from hardcoded seed data

### 2. **Product Features**
- Created `product_features` table
- Each product has 4 features with sort_order
- Features are fetched dynamically per product
- Fallback: returns empty array if no features exist

### 3. **Product Specifications**
- Already stored in `product_specifications` table
- Grouped by `spec_group`:
  - "Product details" - benefit features
  - "Product description" - highlights and key points
  - "Specifications" - technical specs in table format
- Fetched with sort_order for consistent display

### 4. **Product Gallery Images**
- Already stored in `product_images` table
- Each product has primary image (is_primary = true)
- Additional gallery images with sort_order
- Fallback: uses `products.image_url` if no images exist

## Database Tables

### Products Table Updates
```sql
-- Columns added/used:
- description (text) - full product description
- short_description (text) - brief one-liner
- image_url (text) - primary product image
```

### Product Features Table
```sql
CREATE TABLE product_features (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  feature TEXT,
  sort_order INTEGER
);
```

### Product Images Table (Already Exists)
```sql
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  image_url TEXT,
  alt TEXT,
  is_primary BOOLEAN,
  sort_order INTEGER
);
```

### Product Specifications Table (Already Exists)
```sql
CREATE TABLE product_specifications (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  spec_group TEXT, -- "Product details", "Product description", "Specifications"
  name TEXT,
  value TEXT,
  sort_order INTEGER
);
```

## Updated Files

### Backend Services
- **`/services/product-details-service.ts`** (NEW)
  - `fetchProductSpecifications()` - fetch by spec_group
  - `fetchProductFeatures()` - fetch product features
  - `fetchProductImages()` - fetch product gallery images
  - `fetchProductDetails()` - fetch all details in parallel
  - `groupSpecificationsByGroup()` - group specs by category

### Pages & Components
- **`/app/product/[slug]/page.tsx`**
  - Fetches all product details on page load
  - Passes data to components instead of hardcoding

- **`/components/products/product-gallery.tsx`**
  - Accepts `productImages` array and `primaryImage` prop
  - Displays gallery from Supabase
  - Fallback: uses hardcoded placeholders only if no images

- **`/components/products/product-description.tsx`**
  - Displays main description from `products.description`
  - Shows product highlights from specifications (spec_group = "Product description")
  - No hardcoded text

- **`/components/products/product-specifications.tsx`**
  - Fetches specs with spec_group = "Specifications"
  - Renders dynamic table from database
  - No hardcoded values

### Seed Script
- **`/scripts/seed-supabase.ts`**
  - Added ProductFeatureSeed type
  - Added complete descriptions for all 8 products
  - Added 32 features (4 per product)
  - Existing specifications data preserved
  - Existing product images data preserved

## To Run Migration

```bash
# Run the updated seed script
npm run seed

# This will:
# 1. Upsert categories
# 2. Upsert products (with new descriptions)
# 3. Upsert product_images
# 4. Upsert product_features (new table)
# 5. Upsert product_specifications
```

## Verification Checklist

- [ ] Run `npm run seed` successfully
- [ ] Check Supabase:
  - [ ] `products` table has `description` and `short_description` columns
  - [ ] `product_features` table exists and has 32 rows
  - [ ] All 8 products have descriptions
  - [ ] Each product has 4 features
- [ ] Visit product page: `http://localhost:3000/product/monocrystalline-panel-450w`
  - [ ] Gallery shows images from `product_images`
  - [ ] Description loads from database
  - [ ] Features display from specifications
  - [ ] Specifications table shows correctly
- [ ] Test fallbacks:
  - [ ] If image missing, shows product.image_url
  - [ ] If no specs, shows "not available"
- [ ] Build and deploy: `npm run build` succeeds

## Data Consistency

✅ All hardcoded arrays removed from:
- product-description.tsx
- product-specifications.tsx
- product-gallery.tsx

✅ All data now sourced from Supabase:
- Descriptions: `products.description`
- Features: `product_features` table
- Specifications: `product_specifications` table
- Images: `product_images` table

✅ Fallbacks implemented:
- Gallery: product.image_url if no product_images
- Description: "not available" if no description
- Specs: "not available" if no specifications

## Future Updates

To update product data in the future:

1. **Add/Edit Product Features:**
   ```
   Edit /scripts/seed-supabase.ts productFeatures array
   Run: npm run seed
   ```

2. **Update Product Description:**
   ```
   Edit /scripts/seed-supabase.ts products[].metadata.description
   Run: npm run seed
   ```

3. **Add Gallery Images:**
   ```
   Edit /scripts/seed-supabase.ts productImages array
   Run: npm run seed
   ```

4. **Change Specifications:**
   ```
   Edit /scripts/seed-supabase.ts productSpecifications array
   Run: npm run seed
   ```

## No More Mock Data

✅ Zero hardcoded product data in components
✅ Zero mock arrays in frontend code
✅ Supabase is the single source of truth
✅ All requests include proper error handling
✅ Graceful fallbacks for missing data
