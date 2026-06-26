import {
  getAllBrands as getAllBrandsRepo,
  getCategories as getCategoriesRepo,
} from "@/lib/repositories/content.repository";
import {
  getBrandByProductSlug,
  getDealProducts as getDealProductsRepo,
  getMyOrders as getMyOrdersRepo,
  getProductBySlug as getProductBySlugRepo,
  getProductsByBrandSlug as getProductsByBrandSlugRepo,
} from "@/lib/repositories/commerce.repository";

const getCategories = async (quantity?: number) => {
  try {
    return await getCategoriesRepo(quantity);
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

const getAllBrands = async () => {
  try {
    return await getAllBrandsRepo();
  } catch (error) {
    console.error("Error fetching all brands:", error);
    return [];
  }
};

const getDealProducts = async () => {
  try {
    return await getDealProductsRepo();
  } catch (error) {
    console.error("Error fetching deal products:", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    return await getProductBySlugRepo(slug);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

const getBrand = async (slug: string) => {
  try {
    const brand = await getBrandByProductSlug(slug);
    if (!brand) return null;
    return [{ brandName: brand.title }];
  } catch (error) {
    console.error("Error fetching brand by product slug:", error);
    return null;
  }
};

const getProductsByBrandSlug = async (slug: string) => {
  try {
    return await getProductsByBrandSlugRepo(slug);
  } catch (error) {
    console.error("Error fetching products by brand slug:", error);
    return [];
  }
};

const getMyOrders = async (userId: string) => {
  try {
    return await getMyOrdersRepo(userId);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export {
  getCategories,
  getAllBrands,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getProductsByBrandSlug,
  getMyOrders,
};
