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

export function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>(categories[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(
    "Fake shelf stocked. Real orders still very cancelled.",
  );
  const navigate = useNavigate();
  const cart = useCart();
  const settings = useSettings();

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const greeting = getTimeGreeting(new Date());

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
    setToastMessage("Shelf switched. Still fake, still safer than checkout.");
  }

  function handleBuildFakeCart() {
    navigate("/products");
  }

  function handleEmergencyMode() {
    setToastMessage("Emergency Craving Mode is warming up for a later phase.");
  }

  return (
    <div className="home-page">
      <PageHeader
        title={greeting}
        subtitle="Fake ordering for real cravings."
        trailing={<span className="status-dot">Open for fake business</span>}
      />

      <section className="hero-panel" aria-labelledby="home-hero-title">
        <div className="hero-copy">
          <span className="hero-tag">No delivery. Full drama.</span>
          <h2 id="home-hero-title">Add to cart. Not to stomach.</h2>
          <p>
            Build a cart. Save the money. Skip the regret. No delivery, no
            payment, no actual snacks.
          </p>
        </div>

        <div className="hero-ticket" aria-label="Fake order preview">
          <span className="ticket-label">Delivery partner</span>
          <strong>Self Control</strong>
          <span>ETA: never</span>
        </div>
      </section>

      <div className="cta-row" aria-label="Fake cart actions">
        <Button
          type="button"
          onClick={handleBuildFakeCart}
        >
          Build Fake Cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleEmergencyMode}
        >
          Emergency Craving Mode
        </Button>
      </div>

      <SearchInput
        label="Search the fake shelf"
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search chips, cola, emotional support Maggi..."
        aria-label="Search fake products"
      />

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <h2 id="category-title">Pick your almost-mistake</h2>
          <p>Tap a shelf. Browse the craving. No real order can escape.</p>
        </div>
        <div className="category-grid" aria-label="Fake product categories">
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
            {normalizedQuery ? "Search results" : "Tonight's fake shelf"}
          </h2>
          <p>
            {normalizedQuery
              ? `Showing fake items that match "${searchQuery.trim()}".`
              : `${selectedCategory?.name} products are ready to be admired, not delivered.`}
          </p>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-list">
            {visibleProducts.map((product) => (
              <ProductCartCard
                key={product.id}
                product={product}
                categoryName={categoryNames.get(product.categoryId) ?? "Fake shelf"}
                quantity={cart.getQuantity(product.id)}
                showCalories={settings.showCalories}
                onAdd={() => {
                  cart.addItem(product.id);
                  setToastMessage(`${product.name} joined the fake cart.`);
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
                      ? `${product.name} removed from the fake cart.`
                      : `${product.name} quantity decreased.`,
                  );
                }}
                onRemove={() => {
                  cart.removeItem(product.id);
                  setToastMessage(`${product.name} removed from the fake cart.`);
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
          <p>No address needed. No payment needed. No awkward doorbell at 1 AM.</p>
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
