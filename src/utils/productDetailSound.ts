const POP_THROTTLE_MS = 120;
const POP_DURATION_SECONDS = 0.13;

let audioContext: AudioContext | null = null;
let lastPopAt = 0;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (audioContext) {
    return audioContext;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext = new AudioContextConstructor();
  return audioContext;
}

function shouldSkipSound() {
  return (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function schedulePopSound(context: AudioContext) {
  const startAt = context.currentTime;
  const endAt = startAt + POP_DURATION_SECONDS;
  const filter = context.createBiquadFilter();
  const body = context.createOscillator();
  const snap = context.createOscillator();
  const bodyGain = context.createGain();
  const snapGain = context.createGain();
  const masterGain = context.createGain();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, startAt);
  filter.frequency.exponentialRampToValueAtTime(620, endAt);

  body.type = "sine";
  body.frequency.setValueAtTime(360, startAt);
  body.frequency.exponentialRampToValueAtTime(170, endAt);

  bodyGain.gain.setValueAtTime(0.0001, startAt);
  bodyGain.gain.exponentialRampToValueAtTime(0.07, startAt + 0.014);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  snap.type = "triangle";
  snap.frequency.setValueAtTime(760, startAt);
  snap.frequency.exponentialRampToValueAtTime(430, startAt + 0.05);

  snapGain.gain.setValueAtTime(0.0001, startAt);
  snapGain.gain.exponentialRampToValueAtTime(0.025, startAt + 0.006);
  snapGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.05);

  masterGain.gain.setValueAtTime(0.82, startAt);

  body.connect(bodyGain).connect(filter);
  snap.connect(snapGain).connect(filter);
  filter.connect(masterGain).connect(context.destination);

  body.start(startAt);
  snap.start(startAt);
  body.stop(endAt);
  snap.stop(startAt + 0.055);

  body.onended = () => {
    body.disconnect();
    snap.disconnect();
    bodyGain.disconnect();
    snapGain.disconnect();
    filter.disconnect();
    masterGain.disconnect();
  };
}

export function playProductDetailPopSound() {
  if (shouldSkipSound()) {
    return;
  }

  const now = window.performance.now();
  if (now - lastPopAt < POP_THROTTLE_MS) {
    return;
  }

  lastPopAt = now;
  const context = getAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    void context.resume()
      .then(() => schedulePopSound(context))
      .catch(() => undefined);
    return;
  }

  schedulePopSound(context);
}
