interface FictionalDeliveryMapProps {
  routeSeed: number;
  progress: number;
  darkStoreName: string;
  stage: string;
  isLost?: boolean;
}

interface RouteLabel {
  x: number;
  y: number;
  text: string;
}

interface RouteVariant {
  points: Array<[number, number]>;
  labels: RouteLabel[];
}

const routeVariants: RouteVariant[] = [
  {
    points: [
      [36, 138],
      [74, 112],
      [118, 124],
      [164, 88],
      [214, 96],
      [260, 52],
    ],
    labels: [
      { x: 25, y: 164, text: "Craving Store" },
      { x: 102, y: 150, text: "Snack Flyover" },
      { x: 170, y: 72, text: "Self Control Signal" },
      { x: 242, y: 34, text: "Your Sofa" },
    ],
  },
  {
    points: [
      [42, 48],
      [82, 78],
      [122, 58],
      [168, 104],
      [222, 92],
      [268, 142],
    ],
    labels: [
      { x: 20, y: 32, text: "Craving Store" },
      { x: 86, y: 96, text: "Snack Flyover" },
      { x: 158, y: 128, text: "Self Control Signal" },
      { x: 236, y: 164, text: "Your Sofa" },
    ],
  },
  {
    points: [
      [36, 126],
      [78, 76],
      [126, 88],
      [166, 48],
      [216, 76],
      [270, 118],
    ],
    labels: [
      { x: 22, y: 152, text: "Craving Store" },
      { x: 78, y: 58, text: "Snack Flyover" },
      { x: 162, y: 32, text: "Self Control Signal" },
      { x: 238, y: 142, text: "Your Sofa" },
    ],
  },
];

function clampProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

function getPointAtProgress(points: Array<[number, number]>, progress: number) {
  const safeProgress = clampProgress(progress);
  const segmentCount = points.length - 1;
  const rawSegment = safeProgress * segmentCount;
  const segmentIndex = Math.min(segmentCount - 1, Math.floor(rawSegment));
  const segmentProgress = rawSegment - segmentIndex;
  const [startX, startY] = points[segmentIndex];
  const [endX, endY] = points[segmentIndex + 1];

  return {
    x: startX + (endX - startX) * segmentProgress,
    y: startY + (endY - startY) * segmentProgress,
  };
}

function getRouteVariant(routeSeed: number) {
  return routeVariants[Math.abs(routeSeed) % routeVariants.length];
}

function pointsToString(points: Array<[number, number]>) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export function FictionalDeliveryMap({
  routeSeed,
  progress,
  darkStoreName,
  stage,
  isLost = false,
}: FictionalDeliveryMapProps) {
  const route = getRouteVariant(routeSeed);
  const markerProgress = isLost ? Math.min(0.86, clampProgress(progress)) : progress;
  const marker = getPointAtProgress(route.points, markerProgress);
  const storePoint = route.points[0];
  const homePoint = route.points[route.points.length - 1];
  const selfControlLabel = route.labels.find((label) =>
    label.text.includes("Self Control"),
  );

  return (
    <section className="fictional-map" aria-label="Fictional delivery route">
      <div className="fictional-map__header">
        <div>
          <span className="section-kicker">Fictional map</span>
          <h2>{stage}</h2>
        </div>
        <span className="fictional-map__badge">{isLost ? "Signal found" : "Route active"}</span>
      </div>

      <svg
        className="fictional-map__canvas"
        viewBox="0 0 320 190"
        role="img"
        aria-labelledby="fictional-map-title fictional-map-description"
      >
        <title id="fictional-map-title">DopeCart fictional delivery route</title>
        <desc id="fictional-map-description">
          A playful map showing the delivery partner moving from {darkStoreName} toward Your Sofa.
        </desc>
        <rect className="fictional-map__block fictional-map__block--one" x="12" y="16" width="82" height="52" rx="8" />
        <rect className="fictional-map__block fictional-map__block--two" x="110" y="132" width="80" height="42" rx="8" />
        <rect className="fictional-map__block fictional-map__block--three" x="204" y="24" width="82" height="54" rx="8" />
        <polyline className="fictional-map__route-shadow" points={pointsToString(route.points)} />
        <polyline className="fictional-map__route" points={pointsToString(route.points)} />

        {route.labels.map((label) => (
          <g className="fictional-map__label" key={label.text}>
            <rect x={label.x - 4} y={label.y - 13} width={label.text.length * 5.9 + 8} height="18" rx="5" />
            <text x={label.x} y={label.y}>{label.text}</text>
          </g>
        ))}

        <g className="fictional-map__pin fictional-map__pin--store" transform={`translate(${storePoint[0]} ${storePoint[1]})`}>
          <circle r="10" />
          <text y="4">S</text>
        </g>
        <g className="fictional-map__pin fictional-map__pin--home" transform={`translate(${homePoint[0]} ${homePoint[1]})`}>
          <circle r="10" />
          <text y="4">H</text>
        </g>
        {selfControlLabel ? (
          <circle
            className="fictional-map__signal"
            cx={selfControlLabel.x + 18}
            cy={selfControlLabel.y + 10}
            r="9"
          />
        ) : null}
        <g className={["fictional-map__marker", isLost ? "fictional-map__marker--lost" : ""].filter(Boolean).join(" ")} transform={`translate(${marker.x} ${marker.y})`}>
          <circle r="12" />
          <path d="M-4 2h8l-2-7h-4z" />
        </g>
      </svg>
    </section>
  );
}
