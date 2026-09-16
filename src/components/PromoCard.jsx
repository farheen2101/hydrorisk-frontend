// Swapped out the original "water tanks" illustration for a photo of the
// Charminar, so the card reads as distinctly Hyderabad. Swap the `src`
// below for a local asset (e.g. import from ../assets) if you'd rather
// bundle the image than load it from Wikimedia Commons.
const CHARMINAR_IMAGE_URL =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Charminar_front_view.JPG?width=600";

export default function PromoCard() {
  return (
    <div className="promo-card">
      <div className="promo-card-image">
        <img src={CHARMINAR_IMAGE_URL} alt="Charminar, Hyderabad" loading="lazy" />
        <div className="promo-card-overlay" />
      </div>
      <div className="promo-card-text">
        <span className="promo-card-title">Safer Streets</span>
        <span className="promo-card-subtitle">Stronger Communities</span>
      </div>
    </div>
  );
}
