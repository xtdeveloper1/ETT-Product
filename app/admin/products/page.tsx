"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Grid3x3, List, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DatabaseProduct, DatabaseCategory } from "@/types/product";

interface ProductWithCategory extends DatabaseProduct {
    categories?: DatabaseCategory[];
}

type ViewType = "grid" | "list";

const STATUS_OPTIONS = ["All", "Active", "Inactive"];

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [categories, setCategories] = useState<DatabaseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [viewType, setViewType] = useState<ViewType>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            setFetchError(null);
            
            // Fetch categories first
            const { data: categoriesData, error: catError } = await supabase
                .from("categories")
                .select("id, name, parent_id")
                .order("name");

            if (catError) {
                console.error("Error fetching categories:", catError);
                setFetchError(catError.message || JSON.stringify(catError));
            } else {
                setCategories(categoriesData || []);
            }

            // Fetch products (no implicit relational join). Map categories in JS
            const { data: productsData, error: prodError } = await supabase
                .from("products")
                .select(
                    `id, category_id, subcategory_id, name, slug, description, price, old_price, rating, rating_count, discount, image_url, featured, created_at, short_description, stock, is_active`
                )
                .order("created_at", { ascending: false });

            if (prodError) {
                console.error("Error fetching products:", prodError);
                setFetchError(prodError.message || JSON.stringify(prodError));
                setProducts([]);
            } else {
                const prods = (productsData || []).map((p: any) => {
                    // attach categories array: prefer subcategory if available, otherwise category
                    const cats: any[] = [];
                    const subcat = categoriesData?.find((c: any) => String(c.id) === String(p.subcategory_id));
                    const parentcat = categoriesData?.find((c: any) => String(c.id) === String(p.category_id));

                    if (subcat) {
                        cats.push(subcat);
                        // also push its parent if exists and is different
                        const parentOfSub = categoriesData?.find((c: any) => String(c.id) === String(subcat.parent_id));
                        if (parentOfSub && String(parentOfSub.id) !== String(subcat.id)) {
                            cats.unshift(parentOfSub);
                        }
                    } else if (parentcat) {
                        cats.push(parentcat);
                    }

                    return { ...p, categories: cats };
                });

                setProducts(prods);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchesCategory =
                selectedCategoryId === "" ||
                product.category_id === parseInt(selectedCategoryId);

            let matchesStatus = true;
            if (selectedStatus === "Active") {
                matchesStatus = product.is_active;
            } else if (selectedStatus === "Inactive") {
                matchesStatus = !product.is_active;
            }

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, selectedCategoryId, selectedStatus]);

    async function deleteProduct(id: number | string) {
        try {
            // Delete related records first
            await supabase.from("product_images").delete().eq("product_id", id);
            await supabase.from("product_features").delete().eq("product_id", id);
            await supabase.from("product_specifications").delete().eq("product_id", id);

            // Delete the product
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) {
                alert("Failed to delete product");
                console.error(error);
                return;
            }

            setDeleteConfirm(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    }

    const ImageCell = ({ imageUrl, name }: { imageUrl: string; name: string }) => {
        const hasImage = imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "" && !imageUrl.includes("undefined");

        if (!hasImage) {
            return (
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-500 text-center px-1">
                    No Image
                </div>
            );
        }

        return (
            <Image
                src={imageUrl}
                alt={name}
                width={60}
                height={60}
                unoptimized
                className="rounded-lg object-cover w-16 h-16"
                onError={() => null}
            />
        );
    };

    const ProductCard = ({ product }: { product: ProductWithCategory }) => {
        const hasImage = product.image_url && typeof product.image_url === "string" && product.image_url.trim() !== "" && !product.image_url.includes("undefined");
        const categoryName = product.categories?.[0]?.name || "Uncategorized";

        return (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                    {hasImage ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            width={200}
                            height={160}
                            unoptimized
                            className="w-full h-full object-cover"
                            onError={() => null}
                        />
                    ) : (
                        <div className="flex items-center justify-center text-slate-400 text-sm">
                            No Image
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            ID #{product.id}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-slate-600">
                            <span className="font-medium">Category:</span>{" "}
                            {categoryName}
                        </p>
                        <p className="text-xs text-slate-600">
                            <span className="font-medium">Stock:</span>{" "}
                            {product.stock}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900">
                            ₹{product.price?.toLocaleString()}
                        </p>
                        {product.is_active ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                Active
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                Inactive
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Link
                            href={`/product/${product.slug}`}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <Eye size={14} />
                            View
                        </Link>
                        <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <Pencil size={14} />
                            Edit
                        </Link>
                        <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                </div>

                    {fetchError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                            <strong>Error:</strong> {fetchError}
                        </div>
                    )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border p-6">
                Loading products...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Products
                    </h1>
                    <p className="text-slate-500 mt-1">Manage all products</p>
                </div>

                <Link
                    href="/admin/products/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            {/* Filters Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Search by Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category
                        </label>
                        <select
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Status
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            View
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewType("grid")}
                                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                    viewType === "grid"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <Grid3x3 size={16} />
                                <span className="text-sm">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewType("list")}
                                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                    viewType === "list"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <List size={16} />
                                <span className="text-sm">List</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Count */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-900">
                    Showing{" "}
                    <span className="font-bold">{filteredProducts.length}</span>{" "}
                    of <span className="font-bold">{products.length}</span>{" "}
                    products
                </p>
            </div>

            {/* Grid View */}
            {viewType === "grid" && (
                <div className="space-y-6">
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                            <p className="text-slate-500">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* List View */}
            {viewType === "list" && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {filteredProducts.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                No products found
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Image
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Product Name
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Category
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Price
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Stock
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Status
                                        </th>
                                        <th className="text-left p-4 font-semibold text-slate-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => {
                                        const categoryName = product.categories?.[0]?.name || "Uncategorized";
                                        return (
                                        <tr
                                            key={product.id}
                                            className="border-b hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <ImageCell
                                                    imageUrl={product.image_url}
                                                    name={product.name}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        ID #{product.id}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {categoryName}
                                            </td>
                                            <td className="p-4 font-semibold text-slate-900">
                                                ₹{product.price?.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {product.stock}
                                            </td>
                                            <td className="p-4">
                                                {product.is_active ? (
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/edit/${product.id}`}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            setDeleteConfirm(
                                                                product.id
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            Delete Product?
                        </h2>
                        <p className="text-slate-600">
                            Are you sure you want to delete this product? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteProduct(deleteConfirm)}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}