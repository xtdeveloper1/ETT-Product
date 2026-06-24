"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UploadedImage {
    file: File;
    preview: string;
    url?: string;
}

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

interface Feature {
    id: string;
    feature: string;
}

interface Specification {
    id: string;
    spec_key: string;
    spec_value: string;
}

export default function AddProductPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedParentId, setSelectedParentId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category_id: "",
        price: "",
        old_price: "",
        description: "",
        stock: "",
        featured: false,
        is_active: true,
        rating: "5",
        rating_count: "0",
        discount: "",
    });

    const [features, setFeatures] = useState<Feature[]>([]);
    const [specifications, setSpecifications] = useState<Specification[]>([]);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Try ordering by sort_order if present, otherwise fall back to name
                let res = await supabase
                    .from("categories")
                    .select("id, name, parent_id")
                    .order("sort_order", { ascending: true });

                if (res.error) {
                    console.warn("sort_order ordering failed, retrying by name", res.error);
                    res = await supabase
                        .from("categories")
                        .select("id, name, parent_id")
                        .order("name", { ascending: true });
                }

                const { data, error } = res;
                if (error) {
                    console.error("Failed to load categories:", error);
                    setError(error.message || JSON.stringify(error));
                    setCategories([]);
                } else {
                    setCategories(data || []);
                }
            } catch (err) {
                console.error("Unexpected error loading categories:", err);
                setError(String(err));
                setCategories([]);
            }
        };

        loadCategories();
    }, []);

    // Generate unique ID for temporary items
    const generateId = () => `temp-${Date.now()}-${Math.random()}`;

    // Sanitize slug - make it URL-safe
    const sanitizeSlug = (text: string): string => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "") // Remove special characters
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        
        let newValue: any = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        
        // Auto-generate slug from product name
        if (name === "name") {
            setFormData({
                ...formData,
                [name]: newValue,
                slug: sanitizeSlug(newValue),
            });
        } else if (name === "slug") {
            setFormData({
                ...formData,
                [name]: sanitizeSlug(newValue),
            });
        } else {
            setFormData({
                ...formData,
                [name]: newValue,
            });
        }
    };

    // Image handlers
    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files) return;

        try {
            setUploading(true);
            setError(null);

            const newImages: UploadedImage[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (!file.type.startsWith("image/")) {
                    setError("Please select only image files");
                    continue;
                }

                if (file.size > 5 * 1024 * 1024) {
                    setError("Image size must be less than 5MB");
                    continue;
                }

                const preview = URL.createObjectURL(file);

                const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
                const { data, error: uploadError } = await supabase.storage
                    .from("products")
                    .upload(`images/${fileName}`, file, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    console.error("Upload error details:", {
                        message: uploadError.message,
                        error: uploadError,
                    });
                    setError(`Failed to upload ${file.name}: ${uploadError.message}`);
                    continue;
                }

                console.log("File uploaded successfully:", fileName);

                const { data: publicData } = supabase.storage
                    .from("products")
                    .getPublicUrl(`images/${fileName}`);

                console.log("Public URL generated:", publicData.publicUrl);

                newImages.push({
                    file,
                    preview,
                    url: publicData.publicUrl,
                });
            }

            setUploadedImages([...uploadedImages, ...newImages]);

            if (uploadedImages.length === 0 && newImages.length > 0) {
                setPrimaryImageIndex(0);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);

        if (primaryImageIndex === index) {
            setPrimaryImageIndex(Math.max(0, index - 1));
        }
    };

    const handleSetPrimaryImage = (index: number) => {
        setPrimaryImageIndex(index);
    };

    // Feature handlers
    const addFeature = () => {
        setFeatures([...features, { id: generateId(), feature: "" }]);
    };

    const removeFeature = (id: string) => {
        setFeatures(features.filter((f) => f.id !== id));
    };

    const updateFeature = (id: string, feature: string) => {
        setFeatures(
            features.map((f) => (f.id === id ? { ...f, feature } : f))
        );
    };

    // Specification handlers
    const addSpecification = () => {
        setSpecifications([
            ...specifications,
            { id: generateId(), spec_key: "", spec_value: "" },
        ]);
    };

    const removeSpecification = (id: string) => {
        setSpecifications(
            specifications.filter((s) => s.id !== id)
        );
    };

    const updateSpecification = (id: string, field: string, value: string) => {
        setSpecifications(
            specifications.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
            )
        );
    };

    // Check if slug exists and generate unique one if needed
    const getUniqueSlug = async (baseSlug: string): Promise<string> => {
        let testSlug = baseSlug;
        let counter = 2;

        while (true) {
            const { data, error } = await supabase
                .from("products")
                .select("id")
                .eq("slug", testSlug)
                .limit(1);

            if (error) {
                console.error("Error checking slug:", error);
                return testSlug; // If error checking, return what we have
            }

            if (!data || data.length === 0) {
                // Slug is unique
                return testSlug;
            }

            // Slug exists, try with suffix
            testSlug = `${baseSlug}-${counter}`;
            counter++;

            if (counter > 100) {
                // Prevent infinite loop
                return `${baseSlug}-${Date.now()}`;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (uploadedImages.length === 0) {
            setError("Please upload at least one image");
            return;
        }

        if (!formData.name || !formData.slug || !formData.category_id) {
            setError("Please fill in all required fields");
            return;
        }

        if (!formData.price || Number(formData.price) <= 0) {
            setError("Please enter a valid price");
            return;
        }

        if (!formData.stock || Number(formData.stock) < 0) {
            setError("Please enter a valid stock quantity");
            return;
        }

        if (!formData.description) {
            setError("Please enter a product description");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Validate images were uploaded
            if (!uploadedImages.every((img) => img.url)) {
                setError("Some images failed to upload. Please re-upload.");
                setLoading(false);
                return;
            }

            // Check for duplicate slug and get unique one if needed
            const uniqueSlug = await getUniqueSlug(formData.slug);

            const productPayload = {
                name: formData.name,
                slug: uniqueSlug,
                category_id: formData.category_id,
                price: Number(formData.price),
                old_price: formData.old_price ? Number(formData.old_price) : null,
                description: formData.description,
                image_url: uploadedImages[primaryImageIndex].url,
                stock: Number(formData.stock),
                featured: formData.featured,
                is_active: formData.is_active,
                rating: Number(formData.rating) || 5,
                rating_count: Number(formData.rating_count) || 0,
                discount: formData.discount || null,
            };

            console.log("Inserting product with payload:", productPayload);

            // 1. Insert product
            const { data: productData, error: productError } = await supabase
                .from("products")
                .insert([productPayload])
                .select("id")
                .single();

            if (productError) {
                console.error("Product creation error details:", {
                    message: productError.message,
                    code: productError.code,
                    details: productError.details,
                    hint: productError.hint,
                });
                setError(`Database Error: ${productError.message}`);
                return;
            }

            if (!productData) {
                console.error("No product data returned");
                setError("Failed to create product - no data returned");
                return;
            }

            const productId = productData.id;
            console.log("Product created with ID:", productId);

            // 2. Insert product images with is_primary and sort_order
            if (uploadedImages.length > 0) {
                const imageRecords = uploadedImages.map((img, index) => ({
                    product_id: productId,
                    image_url: img.url,
                    alt: formData.name, // Use product name as alt text
                    is_primary: index === primaryImageIndex,
                    sort_order: index,
                }));

                console.log("Image records to insert:", JSON.stringify(imageRecords, null, 2));

                const { error: imagesError } = await supabase
                    .from("product_images")
                    .insert(imageRecords);

                if (imagesError) {
                    console.error("Images insertion error details:", {
                        message: imagesError.message,
                        code: imagesError.code,
                        details: imagesError.details,
                        hint: imagesError.hint,
                    });
                    setError(`Failed to save product images: ${imagesError.message}`);
                    return;
                }
            }

            // 3. Insert features
            if (features.length > 0) {
                const featureRecords = features
                    .filter((f) => f.feature.trim())
                    .map((f) => ({
                        product_id: productId,
                        feature: f.feature,
                    }));

                if (featureRecords.length > 0) {
                    const { error: featuresError } = await supabase
                        .from("product_features")
                        .insert(featureRecords);

                    if (featuresError) {
                        console.error("Features insertion error:", featuresError);
                        setError("Failed to save product features");
                        return;
                    }
                }
            }

            // 4. Insert specifications
            if (specifications.length > 0) {
                const specRecords = specifications
                    .filter((s) => s.spec_key.trim() && s.spec_value.trim())
                    .map((s, index) => ({
                        product_id: productId,
                        spec_group: "Specifications",
                        name: s.spec_key,
                        value: s.spec_value,
                        sort_order: index,
                    }));

                if (specRecords.length > 0) {
                    const { error: specsError } = await supabase
                        .from("product_specifications")
                        .insert(specRecords);

                    if (specsError) {
                        console.error("Specifications insertion error:", specsError);
                        setError("Failed to save product specifications");
                        return;
                    }
                }
            }

            router.push("/admin/products");
        } catch (error) {
            console.error("Unexpected error:", error);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Add Product
                </h1>
                <p className="text-slate-500 mt-2">
                    Create a new product with features and specifications
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        Basic Information
                    </h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Slug (Auto-generated from product name) *
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="auto-generated-from-name"
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Automatically generated from product name. Edit if needed.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                            Category *
                        </label>
                        <select
                            value={selectedParentId}
                            onChange={(event) => {
                                const parentId = event.target.value;
                                const hasChildren = categories.some((category) => String(category.parent_id) === parentId);
                                setSelectedParentId(parentId);
                                setFormData((current) => ({ ...current, category_id: hasChildren ? "" : parentId }));
                            }}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            {categories.filter((cat) => cat.parent_id == null).map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subcategory</label>
                        <select
                            name="category_id"
                            value={categories.some((category) => String(category.parent_id) === selectedParentId) ? formData.category_id : ""}
                            onChange={handleChange}
                            required={categories.some((category) => String(category.parent_id) === selectedParentId)}
                            disabled={!categories.some((category) => String(category.parent_id) === selectedParentId)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        >
                            <option value="">{selectedParentId ? "Select Subcategory" : "Select Category first"}</option>
                            {categories.filter((cat) => String(cat.parent_id) === selectedParentId).map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Old Price (₹)
                            </label>
                            <input
                                type="number"
                                name="old_price"
                                value={formData.old_price}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Discount (e.g., 20% OFF)
                            </label>
                            <input
                                type="text"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                placeholder="20% OFF"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rating (0-5) *
                            </label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                min="0"
                                max="5"
                                step="0.1"
                                required
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rating Count
                            </label>
                            <input
                                type="number"
                                name="rating_count"
                                value={formData.rating_count}
                                onChange={handleChange}
                                min="0"
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Stock *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium mb-3">
                                Status
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="w-4 h-4 border-slate-300 rounded"
                                    />
                                    <span className="text-sm">Featured Product</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-4 h-4 border-slate-300 rounded"
                                    />
                                    <span className="text-sm">Active</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description *
                        </label>
                        <textarea
                            rows={6}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Images Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">
                        Product Images *
                    </h2>

                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <span className="text-sm font-medium text-slate-700">
                                Click to upload or drag images
                            </span>
                            <span className="text-xs text-slate-500 mt-1">
                                PNG, JPG, GIF up to 5MB each. Upload multiple images.
                            </span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {uploading && (
                        <div className="text-sm text-blue-600">
                            Uploading images...
                        </div>
                    )}

                    {uploadedImages.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">
                                Uploaded Images ({uploadedImages.length})
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                                            primaryImageIndex === index
                                                ? "border-blue-600 ring-2 ring-blue-400"
                                                : "border-slate-200 hover:border-slate-400"
                                        }`}
                                    >
                                        <img
                                            src={img.preview}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                            onClick={() => handleSetPrimaryImage(index)}
                                        />
                                        {primaryImageIndex === index && (
                                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Primary
                                                </span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">
                            Product Features
                        </h2>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add Feature
                        </button>
                    </div>

                    {features.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No features added yet. Click "Add Feature" to get started.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {features.map((feature) => (
                                <div key={feature.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g., High efficiency solar cells"
                                        value={feature.feature}
                                        onChange={(e) =>
                                            updateFeature(feature.id, e.target.value)
                                        }
                                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(feature.id)}
                                        className="text-red-600 hover:bg-red-50 p-3 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Specifications Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">
                            Product Specifications
                        </h2>
                        <button
                            type="button"
                            onClick={addSpecification}
                            className="flex items-center gap-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add Specification
                        </button>
                    </div>

                    {specifications.length === 0 ? (
                        <p className="text-slate-500 text-sm">
                            No specifications added yet. Click "Add Specification" to get started.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {specifications.map((spec) => (
                                <div key={spec.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g., Power Output"
                                        value={spec.spec_key}
                                        onChange={(e) =>
                                            updateSpecification(
                                                spec.id,
                                                "spec_key",
                                                e.target.value
                                            )
                                        }
                                        className="w-1/3 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="e.g., 450W"
                                        value={spec.spec_value}
                                        onChange={(e) =>
                                            updateSpecification(
                                                spec.id,
                                                "spec_value",
                                                e.target.value
                                            )
                                        }
                                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSpecification(spec.id)}
                                        className="text-red-600 hover:bg-red-50 p-3 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Section */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading || uploadedImages.length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        {loading ? "Saving..." : "Create Product"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/admin/products")}
                        className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
