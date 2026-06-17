import { BottomCartBar } from "../components/BottomCartBar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CategoryChip } from "../components/CategoryChip";
import { PageHeader } from "../components/PageHeader";
import { Toast } from "../components/Toast";

const categories = ["Chips", "Cold Drinks", "Ice Cream", "Maggi", "Random Stuff"];

export function HomePage() {
  return (
    <div className="home-page">
      <PageHeader
        title="It is snack o'clock somewhere."
        subtitle="Fake ordering for real cravings."
        trailing={<span className="status-dot">Open for fake business</span>}
      />

      <section className="hero-panel" aria-labelledby="home-hero-title">
        <div className="hero-copy">
          <span className="hero-tag">No delivery. Full drama.</span>
          <h2 id="home-hero-title">Add to cart. Not to stomach.</h2>
          <p>
            Build the midnight cart your brain wants, then let better judgement
            fake-deliver the dopamine.
          </p>
        </div>

        <div className="hero-ticket" aria-label="Fake order preview">
          <span className="ticket-label">Tonight's rider</span>
          <strong>Self Control</strong>
          <span>ETA: never</span>
        </div>
      </section>

      <div className="cta-row" aria-label="Phase 1 actions">
        <Button
          type="button"
          onClick={() => {
            window.alert("Phase 2 will wire the fake cart. For now, crisis noted.");
          }}
        >
          Build Fake Cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            window.alert("Emergency Craving Mode lands in a later phase.");
          }}
        >
          Emergency Craving Mode
        </Button>
      </div>

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <h2 id="category-title">Pick your almost-mistake</h2>
          <p>Visual placeholders today, fake filters tomorrow.</p>
        </div>
        <div className="chip-list" aria-label="Fake product categories">
          {categories.map((category, index) => (
            <CategoryChip
              key={category}
              label={category}
              active={index === 0}
              onClick={() => undefined}
            />
          ))}
        </div>
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

      <Toast message="Fake cart standing by. Real order avoided for now." />
      <BottomCartBar />
    </div>
  );
}
