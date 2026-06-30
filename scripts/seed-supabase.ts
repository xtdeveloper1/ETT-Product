import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

type JsonRecord = Record<string, unknown>;

type CategorySeed = {
  id: string;
  slug: string;
  name: string;
  product_count: number;
  image: string;
  href: string;
  sort_order: number;
};

type ProductSeed = {
  id: string;
  slug: string;
  category_id: string;
  category: string;
  name: string;
  price: number;
  old_price: number;
  rating: string;
  rating_value: number;
  rating_count: number;
  discount: string;
  image: string;
  href: string;
  is_featured: boolean;
  sort_order: number;
  metadata?: JsonRecord;
};

type ProductImageSeed = {
  id: string;
  product_id: string;
  image_url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
};

type ProductSpecificationSeed = {
  id: string;
  product_id: string;
  spec_group: string;
  name: string;
  value: string;
  sort_order: number;
};

type ProductFeatureSeed = {
  id: string;
  product_id: string;
  feature: string;
  sort_order: number;
};

type ProductDescriptionSeed = {
  id: string;
  product_id: string;
  description: string;
  short_description: string;
};

const ENV_FILES = [".env.local", ".env"];

function loadEnvFiles() {
  for (const file of ENV_FILES) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) {
      continue;
    }

    const content = readFileSync(path, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);

      if (!match) {
        continue;
      }

      const [, key, rawValue] = match;
      const value = rawValue.replace(/^['"]|['"]$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const categories: CategorySeed[] = [
  {
    id: "street-lights",
    slug: "street-lights",
    name: "Solar Street Lights",
    product_count: 24,
    image: "/images/categories/street-light.jpg",
    href: "/shop?category=street-lights",
    sort_order: 1,
  },
  {
    id: "solar-panels",
    slug: "solar-panels",
    name: "Solar Panels",
    product_count: 18,
    image: "/images/categories/panel.jpg",
    href: "/shop?category=solar-panels",
    sort_order: 2,
  },
  {
    id: "solar-lithium-batteries",
    slug: "solar-lithium-batteries",
    name: "Solar Lithium Batteries",
    product_count: 12,
    image: "/images/categories/pump.jpg",
    href: "/shop?category=solar-lithium-batteries",
    sort_order: 3,
  },
  {
    id: "road-safety",
    slug: "road-safety",
    name: "Road Safety Products",
    product_count: 15,
    image: "/images/categories/road.jpg",
    href: "/shop?category=road-safety",
    sort_order: 4,
  },
];

const products: ProductSeed[] = [
  {
    id: "reflective-traffic-cone",
    slug: "reflective-traffic-cone",
    category_id: "road-safety",
    category: "ROAD SAFETY PRODUCTS",
    name: "Reflective Traffic Cone 750mm",
    price: 649,
    old_price: 899,
    rating: "4.5 (312)",
    rating_value: 4.5,
    rating_count: 312,
    discount: "28% OFF",
    image: "/images/categories/road.jpg",
    href: "/product/reflective-traffic-cone",
    is_featured: false,
    sort_order: 1,
    metadata: {
      description: "High-visibility reflective traffic cone made from durable PVC. Features premium retro-reflective sheeting for maximum visibility in low-light conditions. Ideal for road construction, accident scenes, parking areas, and event management.",
      short_description: "750mm high-visibility safety cone with reflective sheeting",
      delivery_notes: ["Free shipping pan-India", "Ready to use"],
    },
  },
  {
    id: "monocrystalline-panel-450w",
    slug: "monocrystalline-panel-450w",
    category_id: "solar-panels",
    category: "SOLAR PANELS",
    name: "Monocrystalline Solar Panel 450W",
    price: 13499,
    old_price: 15999,
    rating: "4.9 (214)",
    rating_value: 4.9,
    rating_count: 214,
    discount: "16% OFF",
    image: "/images/products/panel1.png",
    href: "/product/monocrystalline-panel-450w",
    is_featured: true,
    sort_order: 2,
    metadata: {
      description: "High-efficiency monocrystalline solar panel suitable for homes, offices, commercial installations and rooftop projects. Features premium grade silicon cells with superior energy conversion and durability. Perfect for maximizing energy generation in limited space.",
      short_description: "450W monocrystalline solar panel with 22% efficiency",
      product_details_rating: "4.7 (128 reviews)",
      product_details_save_label: "Save 29%",
      tax_note: "Inclusive of all taxes",
      delivery_notes: ["Free shipping pan-India", "Manufacturer warranty"],
    },
  },
  {
    id: "solar-street-light-40w",
    slug: "solar-street-light-40w",
    category_id: "street-lights",
    category: "SOLAR STREET LIGHTS",
    name: "All-in-One Solar Street Light 40W",
    price: 8499,
    old_price: 11999,
    rating: "4.7 (128)",
    rating_value: 4.7,
    rating_count: 128,
    discount: "29% OFF",
    image: "/images/products/light1.png",
    href: "/product/solar-street-light-40w",
    is_featured: true,
    sort_order: 3,
    metadata: {
      description: "High-lumen integrated solar street light with motion sensor and 3-day backup. Features 40W LED with 6,000 lumens output. IP66 weatherproof aluminium body with auto-dimming motion detection and LiFePO4 battery backup.",
      short_description: "40W LED solar street light with motion sensor",
      delivery_notes: ["Free shipping pan-India", "Manufacturer warranty"],
    },
  },
  {
    id: "solar-street-light-60w",
    slug: "solar-street-light-60w",
    category_id: "street-lights",
    category: "SOLAR STREET LIGHTS",
    name: "Smart Solar Street Light 60W",
    price: 12999,
    old_price: 16500,
    rating: "4.8 (92)",
    rating_value: 4.8,
    rating_count: 92,
    discount: "21% OFF",
    image: "/images/products/light2.png",
    href: "/product/solar-street-light-60w",
    is_featured: true,
    sort_order: 4,
    metadata: {
      description: "Advanced smart solar street light with 60W LED and intelligent motion sensor. 5-day backup with premium LiFePO4 battery. Features IP67 rating with smart APP control and multiple dimming modes. Ideal for highways, industrial areas, and commercial installations.",
      short_description: "60W smart solar street light with app control",
      delivery_notes: ["Free shipping pan-India", "Manufacturer warranty"],
    },
  },
  {
    id: "solar-blinker-caution",
    slug: "solar-blinker-caution",
    category_id: "road-safety",
    category: "ROAD SAFETY PRODUCTS",
    name: "Solar Blinker Caution Sign",
    price: 2299,
    old_price: 2999,
    rating: "4.6 (88)",
    rating_value: 4.6,
    rating_count: 88,
    discount: "23% OFF",
    image: "/images/categories/road.jpg",
    href: "/product/solar-blinker-caution",
    is_featured: false,
    sort_order: 5,
    metadata: {
      description: "Solar-powered blinking caution sign for construction sites and road safety. Automatic daytime/nighttime operation with durable ABS housing. Features bright LED blinker with extended runtime on rechargeable battery.",
      short_description: "Solar powered blinking caution sign",
      delivery_notes: ["Free shipping pan-India", "Ready to use"],
    },
  },
  {
    id: "bifacial-panel-540w",
    slug: "bifacial-panel-540w",
    category_id: "solar-panels",
    category: "SOLAR PANELS",
    name: "Bifacial Solar Panel 540W",
    price: 16499,
    old_price: 19499,
    rating: "4.8 (76)",
    rating_value: 4.8,
    rating_count: 76,
    discount: "15% OFF",
    image: "/images/products/panel2.png",
    href: "/product/bifacial-panel-540w",
    is_featured: true,
    sort_order: 6,
    metadata: {
      description: "Premium bifacial solar panel with 540W power rating. Generates energy from both front and back surfaces, increasing overall efficiency by 10-25%. Advanced multi-busbar technology and superior shading tolerance. Certified for extreme weather conditions.",
      short_description: "540W bifacial solar panel with dual-side energy generation",
      delivery_notes: ["Free shipping pan-India", "Manufacturer warranty"],
    },
  },
  {
    id: "solar-pump-1.5hp",
    slug: "solar-pump-1.5hp",
    category_id: "solar-lithium-batteries",
    category: "SOLAR LITHIUM BATTERIES",
    name: "Solar Submersible Pump 1.5 HP",
    price: 18999,
    old_price: 22999,
    rating: "4.7 (156)",
    rating_value: 4.7,
    rating_count: 156,
    discount: "17% OFF",
    image: "/images/categories/pump.jpg",
    href: "/product/solar-pump-1.5hp",
    is_featured: false,
    sort_order: 7,
    metadata: {
      description: "1.5 HP solar submersible pump suitable for deep wells and tube wells. Direct solar input with integrated MPPT controller. Corrosion-resistant stainless steel body. No batteries or manual operation required. Perfect for agricultural and domestic water supply.",
      short_description: "1.5 HP solar submersible pump for deep wells",
      delivery_notes: ["Free shipping pan-India", "Installation support provided"],
    },
  },
  {
    id: "solar-pump-2hp",
    slug: "solar-pump-2hp",
    category_id: "solar-lithium-batteries",
    category: "SOLAR LITHIUM BATTERIES",
    name: "Solar Surface Pump 2 HP",
    price: 24999,
    old_price: 29999,
    rating: "4.6 (98)",
    rating_value: 4.6,
    rating_count: 98,
    discount: "17% OFF",
    image: "/images/categories/pump.jpg",
    href: "/product/solar-pump-2hp",
    is_featured: false,
    sort_order: 8,
    metadata: {
      description: "2 HP solar surface pump designed for shallow wells, ponds, and storage tanks. Features variable frequency drive for optimized power consumption. Built-in thermal protection and efficient brushless motor. Ideal for agriculture, livestock, and irrigation.",
      short_description: "2 HP solar surface pump for shallow wells",
      delivery_notes: ["Free shipping pan-India", "Installation support provided"],
    },
  },
];

const productImages: ProductImageSeed[] = [
  ...products.map((product) => ({
    id: `${product.id}-primary`,
    product_id: product.id,
    image_url: product.image,
    alt: product.name,
    is_primary: true,
    sort_order: 1,
  })),
  {
    id: "monocrystalline-panel-450w-gallery-panel",
    product_id: "monocrystalline-panel-450w",
    image_url: "/images/categories/panel.jpg",
    alt: "product",
    is_primary: false,
    sort_order: 2,
  },
  {
    id: "monocrystalline-panel-450w-gallery-street-light",
    product_id: "monocrystalline-panel-450w",
    image_url: "/images/categories/street-light.jpg",
    alt: "product",
    is_primary: false,
    sort_order: 3,
  },
  {
    id: "monocrystalline-panel-450w-gallery-pump",
    product_id: "monocrystalline-panel-450w",
    image_url: "/images/categories/pump.jpg",
    alt: "product",
    is_primary: false,
    sort_order: 4,
  },
  {
    id: "monocrystalline-panel-450w-gallery-road",
    product_id: "monocrystalline-panel-450w",
    image_url: "/images/categories/road.jpg",
    alt: "product",
    is_primary: false,
    sort_order: 5,
  },
];

const productSpecifications: ProductSpecificationSeed[] = [
  {
    id: "monocrystalline-panel-450w-benefit-warranty",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product details",
    name: "25 Year Performance Warranty",
    value: "Included",
    sort_order: 1,
  },
  {
    id: "monocrystalline-panel-450w-benefit-efficiency",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product details",
    name: "High Conversion Efficiency",
    value: "Included",
    sort_order: 2,
  },
  {
    id: "monocrystalline-panel-450w-benefit-weather",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product details",
    name: "Weather Resistant",
    value: "Included",
    sort_order: 3,
  },
  {
    id: "monocrystalline-panel-450w-benefit-bis",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product details",
    name: "BIS Certified",
    value: "Included",
    sort_order: 4,
  },
  {
    id: "monocrystalline-panel-450w-description-summary",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product description",
    name: "Summary",
    value: "High-lumen integrated solar street light with motion sensor and 3-day backup.",
    sort_order: 5,
  },
  {
    id: "monocrystalline-panel-450w-description-led",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product description",
    name: "40W LED",
    value: "with 6,000 lumens",
    sort_order: 6,
  },
  {
    id: "monocrystalline-panel-450w-description-motion",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product description",
    name: "Motion sensor",
    value: "with auto-dimming",
    sort_order: 7,
  },
  {
    id: "monocrystalline-panel-450w-description-weatherproof",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product description",
    name: "IP66 weatherproof",
    value: "aluminium body",
    sort_order: 8,
  },
  {
    id: "monocrystalline-panel-450w-description-backup",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Product description",
    name: "3-day backup",
    value: "with LiFePO4 battery",
    sort_order: 9,
  },
  {
    id: "monocrystalline-panel-450w-spec-led-power",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Specifications",
    name: "LED Power",
    value: "40W",
    sort_order: 10,
  },
  {
    id: "monocrystalline-panel-450w-spec-lumens",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Specifications",
    name: "Lumens",
    value: "6000 lm",
    sort_order: 11,
  },
  {
    id: "monocrystalline-panel-450w-spec-battery",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Specifications",
    name: "Battery",
    value: "LiFePO4 25.6Wh",
    sort_order: 12,
  },
  {
    id: "monocrystalline-panel-450w-spec-solar-panel",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Specifications",
    name: "Solar Panel",
    value: "60W Mono",
    sort_order: 13,
  },
  {
    id: "monocrystalline-panel-450w-spec-warranty",
    product_id: "monocrystalline-panel-450w",
    spec_group: "Specifications",
    name: "Warranty",
    value: "3 Years",
    sort_order: 14,
  },
];

const productFeatures: ProductFeatureSeed[] = [
  // Reflective Traffic Cone
  {
    id: "reflective-traffic-cone-feature-1",
    product_id: "reflective-traffic-cone",
    feature: "Premium retro-reflective sheeting",
    sort_order: 1,
  },
  {
    id: "reflective-traffic-cone-feature-2",
    product_id: "reflective-traffic-cone",
    feature: "Durable PVC construction",
    sort_order: 2,
  },
  {
    id: "reflective-traffic-cone-feature-3",
    product_id: "reflective-traffic-cone",
    feature: "750mm high visibility",
    sort_order: 3,
  },
  {
    id: "reflective-traffic-cone-feature-4",
    product_id: "reflective-traffic-cone",
    feature: "Lightweight and portable",
    sort_order: 4,
  },

  // Monocrystalline Panel
  {
    id: "monocrystalline-panel-450w-feature-1",
    product_id: "monocrystalline-panel-450w",
    feature: "22% conversion efficiency",
    sort_order: 1,
  },
  {
    id: "monocrystalline-panel-450w-feature-2",
    product_id: "monocrystalline-panel-450w",
    feature: "25-year performance warranty",
    sort_order: 2,
  },
  {
    id: "monocrystalline-panel-450w-feature-3",
    product_id: "monocrystalline-panel-450w",
    feature: "Weather resistant construction",
    sort_order: 3,
  },
  {
    id: "monocrystalline-panel-450w-feature-4",
    product_id: "monocrystalline-panel-450w",
    feature: "BIS certified",
    sort_order: 4,
  },

  // Solar Street Light 40W
  {
    id: "solar-street-light-40w-feature-1",
    product_id: "solar-street-light-40w",
    feature: "40W LED with 6,000 lumens",
    sort_order: 1,
  },
  {
    id: "solar-street-light-40w-feature-2",
    product_id: "solar-street-light-40w",
    feature: "Motion sensor with auto-dimming",
    sort_order: 2,
  },
  {
    id: "solar-street-light-40w-feature-3",
    product_id: "solar-street-light-40w",
    feature: "IP66 weatherproof rated",
    sort_order: 3,
  },
  {
    id: "solar-street-light-40w-feature-4",
    product_id: "solar-street-light-40w",
    feature: "3-day backup with LiFePO4 battery",
    sort_order: 4,
  },

  // Solar Street Light 60W
  {
    id: "solar-street-light-60w-feature-1",
    product_id: "solar-street-light-60w",
    feature: "60W LED with 8,000 lumens",
    sort_order: 1,
  },
  {
    id: "solar-street-light-60w-feature-2",
    product_id: "solar-street-light-60w",
    feature: "Smart APP control",
    sort_order: 2,
  },
  {
    id: "solar-street-light-60w-feature-3",
    product_id: "solar-street-light-60w",
    feature: "IP67 weatherproof rated",
    sort_order: 3,
  },
  {
    id: "solar-street-light-60w-feature-4",
    product_id: "solar-street-light-60w",
    feature: "5-day backup with premium battery",
    sort_order: 4,
  },

  // Solar Blinker Caution
  {
    id: "solar-blinker-caution-feature-1",
    product_id: "solar-blinker-caution",
    feature: "Solar powered operation",
    sort_order: 1,
  },
  {
    id: "solar-blinker-caution-feature-2",
    product_id: "solar-blinker-caution",
    feature: "Automatic day/night operation",
    sort_order: 2,
  },
  {
    id: "solar-blinker-caution-feature-3",
    product_id: "solar-blinker-caution",
    feature: "Durable ABS housing",
    sort_order: 3,
  },
  {
    id: "solar-blinker-caution-feature-4",
    product_id: "solar-blinker-caution",
    feature: "Bright LED blinker",
    sort_order: 4,
  },

  // Bifacial Panel
  {
    id: "bifacial-panel-540w-feature-1",
    product_id: "bifacial-panel-540w",
    feature: "Dual-side energy generation",
    sort_order: 1,
  },
  {
    id: "bifacial-panel-540w-feature-2",
    product_id: "bifacial-panel-540w",
    feature: "10-25% efficiency improvement",
    sort_order: 2,
  },
  {
    id: "bifacial-panel-540w-feature-3",
    product_id: "bifacial-panel-540w",
    feature: "Multi-busbar technology",
    sort_order: 3,
  },
  {
    id: "bifacial-panel-540w-feature-4",
    product_id: "bifacial-panel-540w",
    feature: "Extreme weather certified",
    sort_order: 4,
  },

  // Solar Pump 1.5HP
  {
    id: "solar-pump-1.5hp-feature-1",
    product_id: "solar-pump-1.5hp",
    feature: "1.5 HP submersible pump",
    sort_order: 1,
  },
  {
    id: "solar-pump-1.5hp-feature-2",
    product_id: "solar-pump-1.5hp",
    feature: "Direct solar input operation",
    sort_order: 2,
  },
  {
    id: "solar-pump-1.5hp-feature-3",
    product_id: "solar-pump-1.5hp",
    feature: "Corrosion-resistant stainless steel",
    sort_order: 3,
  },
  {
    id: "solar-pump-1.5hp-feature-4",
    product_id: "solar-pump-1.5hp",
    feature: "Integrated MPPT controller",
    sort_order: 4,
  },

  // Solar Pump 2HP
  {
    id: "solar-pump-2hp-feature-1",
    product_id: "solar-pump-2hp",
    feature: "2 HP surface pump",
    sort_order: 1,
  },
  {
    id: "solar-pump-2hp-feature-2",
    product_id: "solar-pump-2hp",
    feature: "Variable frequency drive",
    sort_order: 2,
  },
  {
    id: "solar-pump-2hp-feature-3",
    product_id: "solar-pump-2hp",
    feature: "Built-in thermal protection",
    sort_order: 3,
  },
  {
    id: "solar-pump-2hp-feature-4",
    product_id: "solar-pump-2hp",
    feature: "Efficient brushless motor",
    sort_order: 4,
  },
];

async function upsertTable(table: string, rows: JsonRecord[], onConflict: string) {
  console.log(`Seeding ${table}: ${rows.length} row(s)...`);

  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict });

  if (error) {
    console.error(`Failed to seed ${table}: ${error.message}`);
    throw error;
  }

  console.log(`Seeded ${table} successfully.`);
}

loadEnvFiles();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

try {
  await upsertTable("categories", categories, "id");
  await upsertTable("products", products, "id");
  await upsertTable("product_images", productImages, "id");
  await upsertTable("product_features", productFeatures, "id");
  await upsertTable("product_specifications", productSpecifications, "id");

  console.log("Supabase seed completed successfully.");
} catch {
  console.error("Supabase seed failed.");
  process.exit(1);
}
