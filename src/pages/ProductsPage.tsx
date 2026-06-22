import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BottomCartBar } from "../components/BottomCartBar";
import { Button } from "../components/Button";
import { CategoryChip } from "../components/CategoryChip";
import { CategoryTile } from "../components/CategoryTile";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductCartCard } from "../components/ProductCartCard";
import { SearchInput } from "../components/SearchInput";
import { Toast } from "../components/Toast";
import { categories, products, type CategoryId, type Product } from "../data/catalog";
import {
  cartTotalsAnalyticsProperties,
  productAnalyticsProperties,
  trackEvent,
} from "../lib/analytics";
import { getCartTotals, getCartUpdatePreview, useCart } from "../state/cart";
import { useSettings } from "../state/settings";

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const categoryIds = new Set(categories.map((category) => category.id));

function getValidCategoryId(value: string | null): CategoryId | "all" {
  if (value && categoryIds.has(value as CategoryId)) {
    return value as CategoryId;
  }

  return "all";
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("Shelf open. The cravings are rehearsing.");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const cart = useCart();
  const settings = useSettings();

  const selectedCategoryId = getValidCategoryId(searchParams.get("category"));
  const searchQuery = searchParams.get("q") ?? "";
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = categoryNames.get(product.categoryId) ?? "";
      const matchesCategory =
        normalizedQuery ||
        selectedCategoryId === "all" ||
        product.categoryId === selectedCategoryId;
      const searchable = [
        product.name,
        product.fullName,
        product.brandName,
        product.subcategory,
        product.subtitle,
        product.originalCategory,
        product.tag ?? "",
        categoryName,
        product.searchKeywords.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return Boolean(matchesCategory) && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [normalizedQuery, selectedCategoryId]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function updateParams(
    nextCategoryId: CategoryId | "all",
    nextSearchQuery: string,
    replace = false,
  ) {
    const params = new URLSearchParams(searchParams);

    if (nextCategoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", nextCategoryId);
    }

    if (nextSearchQuery.trim()) {
      params.set("q", nextSearchQuery);
    } else {
      params.delete("q");
    }

    setSearchParams(params, { replace });
  }

  function handleCategorySelect(categoryId: CategoryId | "all") {
    updateParams(categoryId, "");
    trackEvent("category selected", {
      category_id: categoryId,
      location: "products",
    });
  }

  function handleSearchChange(value: string) {
    updateParams(value.trim() ? "all" : selectedCategoryId, value, true);
  }

  function showCartToast(message: string) {
    setToastMessage(message);
  }

  function handleCartAction() {
    trackEvent("cart opened", {
      location: "products_bottom_bar",
      selected_category_id: selectedCategoryId,
      search_active: Boolean(normalizedQuery),
      visible_product_count: filteredProducts.length,
      ...cartTotalsAnalyticsProperties(cart.totals),
    });
    navigate("/cart");
  }

  function handleProductDetailsOpen(product: Product) {
    setSelectedProduct(product);
    trackEvent("product details opened", {
      location: "products",
      quantity_in_cart: cart.getQuantity(product.id),
      selected_category_id: selectedCategoryId,
      search_active: Boolean(normalizedQuery),
      show_calories: settings.showCalories,
      ...productAnalyticsProperties(product),
    });
  }

  function handleProductDetailsClose() {
    if (selectedProduct) {
      trackEvent("product details closed", {
        location: "products",
        quantity_in_cart: cart.getQuantity(selectedProduct.id),
        selected_category_id: selectedCategoryId,
        search_active: Boolean(normalizedQuery),
        show_calories: settings.showCalories,
        ...productAnalyticsProperties(selectedProduct),
      });
    }

    setSelectedProduct(null);
  }

  return (
    <div className={["products-page", cart.totals.totalQuantity > 0 ? "page-with-bottom-cart" : ""].filter(Boolean).join(" ")}>
      <PageHeader
        title="Browse the shelf."
        subtitle="Add cravings, then let the ritual catch them."
      />

      <SearchInput
        label="Search products"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search momos, coffee, cable, stress..."
        aria-label="Search products"
      />

      <section className="filter-panel" aria-labelledby="filter-title">
        <div className="section-heading">
          <h2 id="filter-title">Categories</h2>
        </div>
        <div className="chip-list chip-list--reset" aria-label="Product category reset">
          <CategoryChip
            label="All shelves"
            active={Boolean(normalizedQuery) || selectedCategoryId === "all"}
            onClick={() => handleCategorySelect("all")}
          />
        </div>
        <div
          className="category-rail category-rail--browse"
          aria-label="Scrollable product category filters"
          role="region"
          tabIndex={0}
        >
          <div
            className="category-grid category-grid--browse"
            aria-label="Product category filters"
          >
            {categories.map((category) => (
              <CategoryTile
                key={category.id}
                category={category}
                active={!normalizedQuery && selectedCategoryId === category.id}
                onClick={() => handleCategorySelect(category.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="product-shelf"
        aria-label={normalizedQuery ? "Search results" : "Product grid"}
      >
        {filteredProducts.length > 0 ? (
          <div className="product-list">
            {filteredProducts.map((product) => {
              const quantity = cart.getQuantity(product.id);

              return (
                <ProductCartCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNames.get(product.categoryId) ?? "Shelf"}
                  quantity={quantity}
                  showCalories={settings.showCalories}
                  onOpenDetails={() => handleProductDetailsOpen(product)}
                  onAdd={() => {
                    const nextCart = getCartUpdatePreview(
                      cart.items,
                      product.id,
                      (currentQuantity) => currentQuantity + 1,
                    );
                    cart.addItem(product.id);
                    showCartToast(`${product.name} joined the cart.`);
                    trackEvent("product added", {
                      location: "products",
                      quantity_after: nextCart.quantity,
                      selected_category_id: selectedCategoryId,
                      search_active: Boolean(normalizedQuery),
                      ...productAnalyticsProperties(product),
                      ...cartTotalsAnalyticsProperties(nextCart.totals),
                    });
                  }}
                  onIncrement={() => {
                    const quantity = cart.getQuantity(product.id);
                    const nextCart = getCartUpdatePreview(
                      cart.items,
                      product.id,
                      (currentQuantity) => currentQuantity + 1,
                    );
                    cart.incrementItem(product.id);
                    showCartToast(`${product.name} quantity increased.`);
                    trackEvent("product quantity increased", {
                      location: "products",
                      quantity_before: quantity,
                      quantity_after: nextCart.quantity,
                      selected_category_id: selectedCategoryId,
                      search_active: Boolean(normalizedQuery),
                      ...productAnalyticsProperties(product),
                      ...cartTotalsAnalyticsProperties(nextCart.totals),
                    });
                  }}
                  onDecrement={() => {
                    const nextCart = getCartUpdatePreview(
                      cart.items,
                      product.id,
                      (currentQuantity) => currentQuantity - 1,
                    );
                    cart.decrementItem(product.id);
                    showCartToast(
                      quantity === 1
                        ? `${product.name} removed from the cart.`
                        : `${product.name} quantity decreased.`,
                    );
                    trackEvent(quantity === 1 ? "product removed" : "product quantity decreased", {
                      location: "products",
                      quantity_before: quantity,
                      quantity_after: nextCart.quantity,
                      selected_category_id: selectedCategoryId,
                      search_active: Boolean(normalizedQuery),
                      ...productAnalyticsProperties(product),
                      ...cartTotalsAnalyticsProperties(nextCart.totals),
                    });
                  }}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No products found."
            message="Try a different craving. This shelf is emotionally out of stock."
          />
        )}
      </section>

      {cart.totals.totalQuantity > 0 ? (
        <Button
          type="button"
          analyticsName="cart_clear"
          variant="ghost"
          size="compact"
          onClick={() => {
            cart.clearCart();
            showCartToast("Cart cleared. Character development added.");
            trackEvent("cart cleared", {
              location: "products",
              ...cartTotalsAnalyticsProperties(getCartTotals({})),
            });
          }}
        >
          Clear Cart
        </Button>
      ) : null}

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
      {selectedProduct ? (
        <ProductDetailModal
          product={selectedProduct}
          categoryName={categoryNames.get(selectedProduct.categoryId) ?? "Shelf"}
          quantity={cart.getQuantity(selectedProduct.id)}
          showCalories={settings.showCalories}
          onClose={handleProductDetailsClose}
          onAdd={() => {
            const nextCart = getCartUpdatePreview(
              cart.items,
              selectedProduct.id,
              (currentQuantity) => currentQuantity + 1,
            );
            cart.addItem(selectedProduct.id);
            showCartToast(`${selectedProduct.name} joined the cart.`);
            trackEvent("product added", {
              location: "products_detail_modal",
              quantity_after: nextCart.quantity,
              selected_category_id: selectedCategoryId,
              search_active: Boolean(normalizedQuery),
              ...productAnalyticsProperties(selectedProduct),
              ...cartTotalsAnalyticsProperties(nextCart.totals),
            });
          }}
          onIncrement={() => {
            const quantity = cart.getQuantity(selectedProduct.id);
            const nextCart = getCartUpdatePreview(
              cart.items,
              selectedProduct.id,
              (currentQuantity) => currentQuantity + 1,
            );
            cart.incrementItem(selectedProduct.id);
            showCartToast(`${selectedProduct.name} quantity increased.`);
            trackEvent("product quantity increased", {
              location: "products_detail_modal",
              quantity_before: quantity,
              quantity_after: nextCart.quantity,
              selected_category_id: selectedCategoryId,
              search_active: Boolean(normalizedQuery),
              ...productAnalyticsProperties(selectedProduct),
              ...cartTotalsAnalyticsProperties(nextCart.totals),
            });
          }}
          onDecrement={() => {
            const quantity = cart.getQuantity(selectedProduct.id);
            const nextCart = getCartUpdatePreview(
              cart.items,
              selectedProduct.id,
              (currentQuantity) => currentQuantity - 1,
            );
            cart.decrementItem(selectedProduct.id);
            showCartToast(
              quantity === 1
                ? `${selectedProduct.name} removed from the cart.`
                : `${selectedProduct.name} quantity decreased.`,
            );
            trackEvent(quantity === 1 ? "product removed" : "product quantity decreased", {
              location: "products_detail_modal",
              quantity_before: quantity,
              quantity_after: nextCart.quantity,
              selected_category_id: selectedCategoryId,
              search_active: Boolean(normalizedQuery),
              ...productAnalyticsProperties(selectedProduct),
              ...cartTotalsAnalyticsProperties(nextCart.totals),
            });
          }}
        />
      ) : null}
      <BottomCartBar
        totalQuantity={cart.totals.totalQuantity}
        totalPrice={cart.totals.totalPrice}
        totalCalories={cart.totals.totalCalories}
        averageRegretScore={cart.totals.averageRegretScore}
        showCalories={settings.showCalories}
        onAction={handleCartAction}
        actionLabel="Review Cart"
        actionAnalyticsName="cart_open"
      />
    </div>
  );
}
