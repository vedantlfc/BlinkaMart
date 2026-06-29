import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import type { ProductDetailTransitionRect } from "./ProductDetailModal";

const FLY_LIGHT_DURATION_MS = 520;
const FLY_LIGHT_SIZE_PX = 14;

export interface CartFlyLightRequest {
  id: number;
  sourceRect: ProductDetailTransitionRect;
}

interface CartFlyLightPosition {
  x: number;
  y: number;
}

interface CartFlyLightState {
  id: number;
  from: CartFlyLightPosition;
  phase: "start" | "end";
  to: CartFlyLightPosition;
}

interface CartFlyLightProps {
  request: CartFlyLightRequest | null;
  onComplete: (id: number) => void;
}

function getCenterPosition(rect: ProductDetailTransitionRect): CartFlyLightPosition {
  return {
    x: rect.left + rect.width / 2 - FLY_LIGHT_SIZE_PX / 2,
    y: rect.top + rect.height / 2 - FLY_LIGHT_SIZE_PX / 2,
  };
}

function getOrbStyle(state: CartFlyLightState): CSSProperties {
  const position = state.phase === "start" ? state.from : state.to;

  return {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  };
}

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CartFlyLight({ request, onComplete }: CartFlyLightProps) {
  const [flyState, setFlyState] = useState<CartFlyLightState | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    if (!request) {
      return undefined;
    }

    if (shouldReduceMotion()) {
      onCompleteRef.current(request.id);
      return undefined;
    }

    const targetElement = document.querySelector<HTMLElement>(".bottom-cart-bar__art");
    if (!targetElement) {
      onCompleteRef.current(request.id);
      return undefined;
    }

    const from = getCenterPosition(request.sourceRect);
    const to = getCenterPosition(targetElement.getBoundingClientRect());
    let firstFrame = 0;
    let secondFrame = 0;
    let completionTimeout = 0;

    setFlyState({
      id: request.id,
      from,
      phase: "start",
      to,
    });

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setFlyState((currentState) =>
          currentState?.id === request.id
            ? { ...currentState, phase: "end" }
            : currentState,
        );
      });
    });

    completionTimeout = window.setTimeout(() => {
      setFlyState((currentState) =>
        currentState?.id === request.id ? null : currentState,
      );
      onCompleteRef.current(request.id);
    }, FLY_LIGHT_DURATION_MS + 80);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(completionTimeout);
    };
  }, [request]);

  if (!flyState) {
    return null;
  }

  return createPortal(
    <div className="cart-fly-light" aria-hidden="true">
      <span
        className={[
          "cart-fly-light__orb",
          flyState.phase === "end" ? "cart-fly-light__orb--end" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={getOrbStyle(flyState)}
      >
        <span className="cart-fly-light__core" />
      </span>
    </div>,
    document.body,
  );
}
