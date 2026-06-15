"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UploadedImage {
    file?: File;
    preview: string;
    url?: string;
    id?: number;
    sort_order?: number;
}

interface Feature {
    id: string;
    feature: string;
    isNew?: boolean;
}

interface Specification {
    id: string;
    name: string;
    value: string;
    isNew?: boolean;
}

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();

    const productId = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category_id: "",
        price: "",
        old_price: "",
        description: "",
        stock: "",
        is_featured: false,
        is_active: true,
    });

    const [features, setFeatures] = useState<Feature[]>([]);
    const [specifications, setSpecifications] = useState<Specification[]>([]);

    // Generate unique ID for temporary items
    const generateId = () => `temp-${Date.now()}-${Math.random()}`;

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    async function fetchProduct() {
        try {
            // Fetch product
            const { data: productData, error: productError } = await supabase
                .from("products")
                .select("*")
                .eq("id", productId)
                .single();

            if (productError || !productData) {
                console.error(productError);
                setError("Product not found");
                setLoading(false);
                return;
            }

            setFormData({
                name: productData.name || "",
                slug: productData.slug || "",
                category_id: productData.category_id?.toString() || "",
                price: productData.price?.toString() || "",
                old_price: productData.old_price?.toString() || "",
                description: productData.description || "",
                stock: productData.stock?.toString() || "",
                is_featured: productData.is_featured ?? false,
                is_active: productData.is_active ?? true,
            });

            // Fetch product images
            const { data: imagesData, error: imagesError } = await supabase
                .from("product_images")
                .select("*")
                .eq("product_id", productId)
                .order("sort_order", { ascending: true });

            if (!imagesError && imagesData) {
                const images: UploadedImage[] = imagesData.map((img) => ({
                    id: img.id,
                    preview: img.image_url,
                    url: img.image_url,
                    sort_order: img.sort_order,
                }));
                setUploadedImages(images);
                setPrimaryImageIndex(0);
            }

            // Fetch features
            const { data: featuresData, error: featuresError } = await supabase
                .from("product_features")
                .select("*")
                .eq("product_id", productId);

            if (!featuresError && featuresData) {
                setFeatures(
                    featuresData.map((f) => ({
                        id: f.id.toString(),
                        feature: f.feature || "",
                        isNew: false,
                    }))
                );
            }

            // Fetch specifications
            const { data: specsData, error: specsError } = await supabase
                .from("product_specifications")
                .select("*")
                .eq("product_id", productId);

            if (!specsError && specsData) {
                setSpecifications(
                    specsData.map((s) => ({
                        id: s.id.toString(),
                        name: s.name || "",
                        value: s.value || "",
                        isNew: false,
                    }))
                );
            }
        } catch (error) {
            console.error(error);
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    }

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
                    console.error(uploadError);
                    setError(`Failed to upload ${file.name}: ${uploadError.message}`);
                    continue;
                }

                const { data: publicData } = supabase.storage
                    .from("products")
                    .getPublicUrl(`images/${fileName}`);

                newImages.push({
                    file,
                    preview,
                    url: publicData.publicUrl,
                });
            }

            setUploadedImages([...uploadedImages, ...newImages]);
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
        setFeatures([...features, { id: generateId(), feature: "", isNew: true }]);
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
            { id: generateId(), name: "", value: "", isNew: true },
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (uploadedImages.length === 0) {
            setError("Please select at least one image");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // 1. Update product
            const { error: updateError } = await supabase
                .from("products")
                .update({
                    name: formData.name,
                    slug: formData.slug,
                    category_id: formData.category_id ? Number(formData.category_id) : null,
                    price: Number(formData.price),
                    old_price: formData.old_price ? Number(formData.old_price) : null,
                    description: formData.description,
                    image_url: uploadedImages[primaryImageIndex].url,
                    stock: Number(formData.stock),
                    featured: formData.is_featured,
                    is_active: formData.is_active,
                })
                .eq("id", productId);

            if (updateError) {
                console.error(updateError);
                setError("Failed to update product");
                return;
            }

            // 2. Handle images - delete old ones and insert new ones
            const imageIds = uploadedImages
                .filter((img) => img.id)
                .map((img) => img.id);

            // Delete images that were removed
            if (imageIds.length > 0) {
                await supabase
                    .from("product_images")
                    .delete()
                    .eq("product_id", productId)
                    .not("id", "in", `(${imageIds.join(",")})`);
            } else {
                await supabase
                    .from("product_images")
                    .delete()
                    .eq("product_id", productId);
            }

            // Insert new images
            const newImages = uploadedImages.filter((img) => !img.id);
            if (newImages.length > 0) {
                const imageRecords = newImages.map((img, index) => ({
                    product_id: productId,
                    image_url: img.url,
                    sort_order: uploadedImages.indexOf(img),
                }));

                const { error: imagesError } = await supabase
                    .from("product_images")
                    .insert(imageRecords);

                if (imagesError) {
                    console.error(imagesError);
                    setError("Failed to save product images");
                    return;
                }
            }

            // 3. Handle features
            const oldFeatures = features.filter((f) => !f.isNew);
            const newFeatures = features.filter((f) => f.isNew);

            // Delete removed features
            const oldFeatureIds = oldFeatures.map((f) => Number(f.id));
            if (oldFeatureIds.length > 0) {
                await supabase
                    .from("product_features")
                    .delete()
                    .eq("product_id", productId)
                    .not("id", "in", `(${oldFeatureIds.join(",")})`);
            } else {
                await supabase
                    .from("product_features")
                    .delete()
                    .eq("product_id", productId);
            }

            // Update old features
            for (const feature of oldFeatures) {
                if (feature.feature.trim()) {
                    await supabase
                        .from("product_features")
                        .update({ feature: feature.feature })
                        .eq("id", Number(feature.id));
                }
            }

            // Insert new features
            if (newFeatures.length > 0) {
                const featureRecords = newFeatures
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
                        console.error(featuresError);
                        setError("Failed to save product features");
                        return;
                    }
                }
            }

            // 4. Handle specifications
            const oldSpecs = specifications.filter((s) => !s.isNew);
            const newSpecs = specifications.filter((s) => s.isNew);

            // Delete removed specs
            const oldSpecIds = oldSpecs.map((s) => Number(s.id));
            if (oldSpecIds.length > 0) {
                await supabase
                    .from("product_specifications")
                    .delete()
                    .eq("product_id", productId)
                    .not("id", "in", `(${oldSpecIds.join(",")})`);
            } else {
                await supabase
                    .from("product_specifications")
                    .delete()
                    .eq("product_id", productId);
            }

            // Update old specs
            for (const spec of oldSpecs) {
                if (spec.name.trim() && spec.value.trim()) {
                    await supabase
                        .from("product_specifications")
                        .update({
                            name: spec.name,
                            value: spec.value,
                        })
                        .eq("id", Number(spec.id));
                }
            }

            // Insert new specs
            if (newSpecs.length > 0) {
                const specRecords = newSpecs
                    .filter((s) => s.name.trim() && s.value.trim())
                    .map((s) => ({
                        product_id: productId,
                        name: s.name,
                        value: s.value,
                    }));

                if (specRecords.length > 0) {
                    const { error: specsError } = await supabase
                        .from("product_specifications")
                        .insert(specRecords);

                    if (specsError) {
                        console.error(specsError);
                        setError("Failed to save product specifications");
                        return;
                    }
                }
            }

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            setError("Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border p-6">
                Loading product...
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Edit Product
                </h1>
                <p className="text-slate-500 mt-2">
                    Update product information, images, features, and specifications
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
                            value={formData.name || ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug || ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category *
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id || ""}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="1">Solar Panels</option>
                            <option value="2">
                                Solar Street Lights
                            </option>
                            <option value="3">
                                Solar Water Pumps
                            </option>
                            <option value="4">
                                Road Safety Products
                            </option>
                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
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
                                value={formData.old_price || ""}
                                onChange={handleChange}
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
                                value={formData.stock || ""}
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
                                        name="is_featured"
                                        checked={formData.is_featured}
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
                            value={formData.description || ""}
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
                                        value={feature.feature || ""}
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
                                        value={spec.name || ""}
                                        onChange={(e) =>
                                            updateSpecification(
                                                spec.id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="w-1/3 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="e.g., 450W"
                                        value={spec.value || ""}
                                        onChange={(e) =>
                                            updateSpecification(
                                                spec.id,
                                                "value",
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
                        disabled={saving || uploadedImages.length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        {saving ? "Updating..." : "Update Product"}
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