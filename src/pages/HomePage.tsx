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
import {
  cartTotalsAnalyticsProperties,
  productAnalyticsProperties,
  trackEvent,
} from "../lib/analytics";
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

  function handleCategorySelect(categoryId: CategoryId) {
    setSelectedCategoryId(categoryId);
    setSearchQuery("");
    setToastMessage("Shelf switched. Still safer than checkout.");
    trackEvent("category selected", {
      category_id: categoryId,
      location: "home",
    });
  }

  return (
    <div className={["home-page", cart.totals.totalQuantity > 0 ? "page-with-bottom-cart" : ""].filter(Boolean).join(" ")}>
      <PageHeader
        title={greeting}
        subtitle="Parody ordering for real cravings."
        trailing={<span className="status-dot">Open for restraint</span>}
      />

      <section className="hero-panel" aria-labelledby="home-hero-title">
        <div className="hero-copy">
          <h2 id="home-hero-title">Add to cart. Not to stomach.</h2>
        </div>

        <div className="hero-ticket" aria-label="Order preview">
          <span className="ticket-label">Delivery partner</span>
          <strong>Self Control</strong>
          <span>ETA: never</span>
        </div>
      </section>

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
            onClick={() => {
              trackEvent("progress opened", {
                location: "home_progress_panel",
                total_orders: progressSummary.totalOrders,
                current_streak: progressSummary.currentStreak,
                total_money_saved: progressSummary.totalMoneySaved,
              });
              navigate("/progress");
            }}
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
          <h2 id="category-title">Categories</h2>
        </div>
        <div
          className="category-rail"
          aria-label="Scrollable product categories"
          role="region"
          tabIndex={0}
        >
          <div className="category-grid" aria-label="Product categories">
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
        aria-label={
          normalizedQuery
            ? "Search results"
            : `${selectedCategory?.name ?? "Selected"} products`
        }
      >
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
                  trackEvent("product added", {
                    location: "home",
                    quantity_after: 1,
                    ...productAnalyticsProperties(product),
                    ...cartTotalsAnalyticsProperties(cart.totals),
                  });
                }}
                onIncrement={() => {
                  const quantity = cart.getQuantity(product.id);
                  cart.incrementItem(product.id);
                  setToastMessage(`${product.name} quantity increased.`);
                  trackEvent("product quantity increased", {
                    location: "home",
                    quantity_before: quantity,
                    quantity_after: quantity + 1,
                    ...productAnalyticsProperties(product),
                    ...cartTotalsAnalyticsProperties(cart.totals),
                  });
                }}
                onDecrement={() => {
                  const quantity = cart.getQuantity(product.id);
                  cart.decrementItem(product.id);
                  setToastMessage(
                    quantity === 1
                      ? `${product.name} removed from the cart.`
                      : `${product.name} quantity decreased.`,
                  );
                  trackEvent(quantity === 1 ? "product removed" : "product quantity decreased", {
                    location: "home",
                    quantity_before: quantity,
                    quantity_after: Math.max(0, quantity - 1),
                    ...productAnalyticsProperties(product),
                    ...cartTotalsAnalyticsProperties(cart.totals),
                  });
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

      <section className="proof-grid" aria-label="DopeCart reminders">
        <Card>
          <span className="card-kicker">Reminder</span>
          <h3>Your delivery partner is Self Control.</h3>
          <p>Self Control arrives with a clipboard and suspiciously good timing.</p>
        </Card>
        <Card>
          <span className="card-kicker">Current cart</span>
          <h3>Emotionally loaded, physically empty.</h3>
          <p>This could have become a checkout spiral. Thankfully, it stays theatre.</p>
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
        onAction={() => {
          trackEvent("cart opened", {
            location: "home_bottom_bar",
            ...cartTotalsAnalyticsProperties(cart.totals),
          });
          navigate("/cart");
        }}
      />
    </div>
  );
}
