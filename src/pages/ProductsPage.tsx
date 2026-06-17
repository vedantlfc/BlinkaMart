import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [toastMessage, setToastMessage] = useState("Fake shelf open. Nothing here can actually arrive.");
  const cart = useCart();

  const selectedCategoryId = getValidCategoryId(searchParams.get("category"));
  const searchQuery = searchParams.get("q") ?? "";
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = categoryNames.get(product.categoryId) ?? "";
      const matchesCategory =
        selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
      const searchable = [
        product.name,
        product.subtitle,
        product.tag ?? "",
        categoryName,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [normalizedQuery, selectedCategoryId]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function updateParams(nextCategoryId: CategoryId | "all", nextSearchQuery: string) {
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

    setSearchParams(params);
  }

  function handleCategorySelect(categoryId: CategoryId | "all") {
    updateParams(categoryId, searchQuery);
  }

  function handleSearchChange(value: string) {
    updateParams(selectedCategoryId, value);
  }

  function showCartToast(message: string) {
    setToastMessage(message);
  }

  function handleCartAction() {
    showCartToast("Cart review arrives in Phase 4. For now, admire the fake damage.");
  }

  return (
    <div className="products-page">
      <PageHeader
        title="Browse the fake shelf."
        subtitle="Add cravings to a fake cart. No delivery, no payment, no actual snacks."
        trailing={<span className="status-dot">No real checkout</span>}
      />

      <SearchInput
        label="Search products"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search chips, cola, momos, bad ideas..."
        aria-label="Search fake products"
      />

      <section className="filter-panel" aria-labelledby="filter-title">
        <div className="section-heading">
          <h2 id="filter-title">Filter the temptation</h2>
          <p>{filteredProducts.length} fake products visible.</p>
        </div>
        <div className="chip-list" aria-label="Product category filters">
          <CategoryChip
            label="All"
            active={selectedCategoryId === "all"}
            onClick={() => handleCategorySelect("all")}
          />
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              active={selectedCategoryId === category.id}
              onClick={() => handleCategorySelect(category.id)}
            />
          ))}
        </div>
      </section>

      <section className="product-shelf" aria-labelledby="products-title">
        <div className="section-heading">
          <span className="section-kicker">Dopamine aisle</span>
          <h2 id="products-title">Products that thankfully do not ship</h2>
          <p>Tap Add for the ritual. Future you remains unbothered.</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-list">
            {filteredProducts.map((product) => {
              const quantity = cart.getQuantity(product.id);

              return (
                <ProductCartCard
                  key={product.id}
                  product={product}
                  categoryName={categoryNames.get(product.categoryId) ?? "Fake shelf"}
                  quantity={quantity}
                  onAdd={() => {
                    cart.addItem(product.id);
                    showCartToast(`${product.name} joined the fake cart.`);
                  }}
                  onIncrement={() => {
                    cart.incrementItem(product.id);
                    showCartToast(`${product.name} quantity increased.`);
                  }}
                  onDecrement={() => {
                    cart.decrementItem(product.id);
                    showCartToast(
                      quantity === 1
                        ? `${product.name} removed from the fake cart.`
                        : `${product.name} quantity decreased.`,
                    );
                  }}
                  onRemove={() => {
                    cart.removeItem(product.id);
                    showCartToast(`${product.name} removed from the fake cart.`);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No fake products found."
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
            showCartToast("Fake cart cleared. Character development added.");
          }}
        >
          Clear Fake Cart
        </Button>
      ) : null}

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
      <BottomCartBar
        totalQuantity={cart.totals.totalQuantity}
        totalPrice={cart.totals.totalPrice}
        totalCalories={cart.totals.totalCalories}
        averageRegretScore={cart.totals.averageRegretScore}
        onAction={handleCartAction}
        actionLabel="Cart Page Next"
      />
    </div>
  );
}
