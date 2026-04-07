const getAudioContext = (): AudioContext | null => {
  const AC =
    window.AudioContext ||
    (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  return new AC();
};

export function playClickSound() {
  const ac = getAudioContext();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(900, ac.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ac.currentTime + 0.06);
  g.gain.setValueAtTime(0.18, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.1);
  setTimeout(() => ac.close(), 200);
}
