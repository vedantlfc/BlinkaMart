import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomCartBar } from "../components/BottomCartBar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CategoryTile } from "../components/CategoryTile";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProductCartCard } from "../components/ProductCartCard";
import { SearchInput } from "../components/SearchInput";
import { Toast } from "../components/Toast";
import { categories, products, type CategoryId } from "../data/catalog";
import { useCart } from "../state/cart";
import { getReceiptProgressSummary, useReceiptProgress } from "../state/receiptProgress";
import { useSettings } from "../state/settings";

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

function getTimeGreeting(date: Date) {
  const hour = date.getHours();

  if (hour >= 23 || hour < 5) {
    return "Dangerous time to be opening food apps.";
  }

  if (hour < 12) {
    return "Last night's version of you would like a word.";
  }

  if (hour < 18) {
    return "Snack thoughts detected.";
  }

  return "Prime cart-building danger zone.";
}

function getOrderLabel(totalOrders: number) {
  return totalOrders === 1 ? "1 order avoided" : `${totalOrders} orders avoided`;
}

function getCurrentStreakCopy(currentStreak: number) {
  return currentStreak > 0
    ? `Current streak: ${currentStreak}.`
    : "Current streak paused.";
}

export function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>(categories[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("Shelf stocked. The ritual may begin.");
  const navigate = useNavigate();
  const cart = useCart();
  const settings = useSettings();
  const receiptProgress = useReceiptProgress();

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const greeting = getTimeGreeting(new Date());
  const progressSummary = useMemo(
    () => getReceiptProgressSummary(receiptProgress.progress),
    [receiptProgress.progress],
  );
  const hasProgress = progressSummary.totalOrders > 0 || progressSummary.recentOrders.length > 0;

  const visibleProducts = useMemo(() => {
    if (normalizedQuery) {
      return products.filter((product) => {
        const categoryName = categoryNames.get(product.categoryId) ?? "";
        const searchable = [
          product.name,
          product.subtitle,
          product.tag ?? "",
          categoryName,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      });
    }

    return products.filter((product) => product.categoryId === selectedCategoryId);
  }, [normalizedQuery, selectedCategoryId]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3600);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const productCountByCategory = useMemo(() => {
    return categories.reduce<Record<CategoryId, number>>((counts, category) => {
      counts[category.id] = products.filter(
        (product) => product.categoryId === category.id,
      ).length;
      return counts;
    }, {} as Record<CategoryId, number>);
  }, []);

  function handleCategorySelect(categoryId: CategoryId) {
    setSelectedCategoryId(categoryId);
    setSearchQuery("");
    setToastMessage("Shelf switched. Still safer than checkout.");
  }

  function handleBuildCart() {
    navigate("/products");
  }

  return (
    <div className="home-page">
      <PageHeader
        title={greeting}
        subtitle="Parody ordering for real cravings."
        trailing={<span className="status-dot">Open for restraint</span>}
      />

      <section className="hero-panel" aria-labelledby="home-hero-title">
        <div className="hero-copy">
          <span className="hero-tag">Full drama. Tiny pause.</span>
          <h2 id="home-hero-title">Add to cart. Not to stomach.</h2>
          <p>
            Build a cart. Save the money. Skip the regret. Let Self Control take
            the wheel.
          </p>
        </div>

        <div className="hero-ticket" aria-label="Order preview">
          <span className="ticket-label">Delivery partner</span>
          <strong>Self Control</strong>
          <span>ETA: never</span>
        </div>
      </section>

      <div className="cta-row" aria-label="Cart actions">
        <Button
          type="button"
          onClick={handleBuildCart}
        >
          Build Cart
        </Button>
      </div>

      {hasProgress ? (
        <section className="home-progress-panel" aria-labelledby="home-progress-title">
          <div>
            <span className="section-kicker">Local progress</span>
            <h2 id="home-progress-title">{getOrderLabel(progressSummary.totalOrders)}</h2>
            <p>
              Rs {progressSummary.totalMoneySaved} stayed with you.{" "}
              {getCurrentStreakCopy(progressSummary.currentStreak)}
              {settings.showCalories
                ? ` Calories avoided: ${progressSummary.totalCaloriesAvoided}.`
                : ""}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={() => navigate("/progress")}
          >
            View
          </Button>
        </section>
      ) : null}

      <SearchInput
        label="Search the shelf"
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search chips, cola, emotional support Maggi..."
        aria-label="Search products"
      />

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <h2 id="category-title">Pick your almost-mistake</h2>
          <p>Tap a shelf. Every craving gets a little stage time.</p>
        </div>
        <div className="category-grid" aria-label="Product categories">
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              category={category}
              productCount={productCountByCategory[category.id]}
              active={!normalizedQuery && selectedCategoryId === category.id}
              onClick={() => handleCategorySelect(category.id)}
            />
          ))}
        </div>
      </section>

      <section
        className="product-shelf"
        aria-labelledby="shelf-title"
      >
        <div className="section-heading">
          <span className="section-kicker">
            {normalizedQuery ? "Search mode" : selectedCategory?.vibe}
          </span>
          <h2 id="shelf-title">
            {normalizedQuery ? "Search results" : "Tonight's shelf"}
          </h2>
          <p>
            {normalizedQuery
              ? `Showing items that match "${searchQuery.trim()}".`
              : `${selectedCategory?.name} products are ready to be admired, debated, and left onstage.`}
          </p>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-list">
            {visibleProducts.map((product) => (
              <ProductCartCard
                key={product.id}
                product={product}
                categoryName={categoryNames.get(product.categoryId) ?? "Shelf"}
                quantity={cart.getQuantity(product.id)}
                showCalories={settings.showCalories}
                onAdd={() => {
                  cart.addItem(product.id);
                  setToastMessage(`${product.name} joined the cart.`);
                }}
                onIncrement={() => {
                  cart.incrementItem(product.id);
                  setToastMessage(`${product.name} quantity increased.`);
                }}
                onDecrement={() => {
                  const quantity = cart.getQuantity(product.id);
                  cart.decrementItem(product.id);
                  setToastMessage(
                    quantity === 1
                      ? `${product.name} removed from the cart.`
                      : `${product.name} quantity decreased.`,
                  );
                }}
                onRemove={() => {
                  cart.removeItem(product.id);
                  setToastMessage(`${product.name} removed from the cart.`);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No regret found."
            message="Try another craving. This one seems emotionally out of stock."
          />
        )}
      </section>

      <section className="proof-grid" aria-label="BlinkaMart reminders">
        <Card>
          <span className="card-kicker">Reminder</span>
          <h3>Your delivery partner is Self Control.</h3>
          <p>Self Control arrives with a clipboard and suspiciously good timing.</p>
        </Card>
        <Card>
          <span className="card-kicker">Current cart</span>
          <h3>Emotionally loaded, physically empty.</h3>
          <p>This could have been a real order. Thankfully, it is only theatre.</p>
        </Card>
      </section>

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
      <BottomCartBar
        totalQuantity={cart.totals.totalQuantity}
        totalPrice={cart.totals.totalPrice}
        totalCalories={cart.totals.totalCalories}
        averageRegretScore={cart.totals.averageRegretScore}
        showCalories={settings.showCalories}
        actionLabel="Review Cart"
        onAction={() => navigate("/cart")}
      />
    </div>
  );
}
