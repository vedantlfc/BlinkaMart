import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BottomCartBar } from "../components/BottomCartBar";
import { Button } from "../components/Button";
import { CategoryChip } from "../components/CategoryChip";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProductCartCard } from "../components/ProductCartCard";
import { SearchInput } from "../components/SearchInput";
import { Toast } from "../components/Toast";
import { categories, products, type CategoryId } from "../data/catalog";
import { useCart } from "../state/cart";
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
  }

  function handleSearchChange(value: string) {
    updateParams(value.trim() ? "all" : selectedCategoryId, value, true);
  }

  function showCartToast(message: string) {
    setToastMessage(message);
  }

  function handleCartAction() {
    navigate("/cart");
  }

  return (
    <div className={["products-page", cart.totals.totalQuantity > 0 ? "page-with-bottom-cart" : ""].filter(Boolean).join(" ")}>
      <PageHeader
        title="Browse the shelf."
        subtitle="Add cravings, then let the ritual catch them."
        trailing={<span className="status-dot">Cart ritual</span>}
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
          <h2 id="filter-title">
            {normalizedQuery ? "Searching all shelves" : "Choose a shelf"}
          </h2>
          <p>
            {normalizedQuery
              ? `${filteredProducts.length} results across all shelves.`
              : `${filteredProducts.length} products visible.`}
          </p>
        </div>
        <div className="chip-list" aria-label="Product category filters">
          <CategoryChip
            label="All"
            active={Boolean(normalizedQuery) || selectedCategoryId === "all"}
            onClick={() => handleCategorySelect("all")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              active={!normalizedQuery && selectedCategoryId === category.id}
              onClick={() => handleCategorySelect(category.id)}
            />
          ))}
        </div>
      </section>

      <section className="product-shelf" aria-labelledby="products-title">
        <div className="section-heading">
          <span className="section-kicker">Dopamine aisle</span>
          <h2 id="products-title">
            {normalizedQuery ? "Search results" : "Products currently auditioning"}
          </h2>
          <p>
            {normalizedQuery
              ? `Showing catalog matches for "${searchQuery.trim()}".`
              : "Tap Add for the ritual. Future you remains unbothered."}
          </p>
        </div>

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
                  onAdd={() => {
                    cart.addItem(product.id);
                    showCartToast(`${product.name} joined the cart.`);
                  }}
                  onIncrement={() => {
                    cart.incrementItem(product.id);
                    showCartToast(`${product.name} quantity increased.`);
                  }}
                  onDecrement={() => {
                    cart.decrementItem(product.id);
                    showCartToast(
                      quantity === 1
                        ? `${product.name} removed from the cart.`
                        : `${product.name} quantity decreased.`,
                    );
                  }}
                  onRemove={() => {
                    cart.removeItem(product.id);
                    showCartToast(`${product.name} removed from the cart.`);
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
          variant="ghost"
          size="compact"
          onClick={() => {
            cart.clearCart();
            showCartToast("Cart cleared. Character development added.");
          }}
        >
          Clear Cart
        </Button>
      ) : null}

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
      <BottomCartBar
        totalQuantity={cart.totals.totalQuantity}
        totalPrice={cart.totals.totalPrice}
        totalCalories={cart.totals.totalCalories}
        averageRegretScore={cart.totals.averageRegretScore}
        showCalories={settings.showCalories}
        onAction={handleCartAction}
        actionLabel="Review Cart"
      />
    </div>
  );
}
