import { useSyncExternalStore } from "react";

/** Values read every animation frame by the 3D scene (mutable, no React re-render). */
export const live = {
  /** Camera position along the section path: 0 = hero, 1 = about, ... (float). */
  section: 0,
  /** Pointer in normalised device coords (-1..1). */
  px: 0,
  py: 0,
};

export type Tier = "low" | "mid" | "high";

export interface UIState {
  entered: boolean; // preloader finished
  sceneReady: boolean; // WebGL canvas created
  focus: string | null; // project id whose overlay is open
  hover: string | null; // project id hovered in 3D or DOM
  soundOn: boolean;
}

let state: UIState = { entered: false, sceneReady: false, focus: null, hover: null, soundOn: false };
const listeners = new Set<() => void>();

export function setUI(patch: Partial<UIState>) {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof UIState)[]) {
    if (state[k] !== patch[k]) { changed = true; break; }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getUI(): UIState { return state; }

function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

export function useUI<T>(sel: (s: UIState) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(state));
}
