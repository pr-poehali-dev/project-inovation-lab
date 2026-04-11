import { useState, useEffect } from "react";

const API = "https://functions.poehali.dev/ee0c9d49-3da0-4e2e-a2ab-1f68f29a1405";

let cache: Record<string, unknown> | null = null;
let fetchPromise: Promise<void> | null = null;

function loadSiteData(): Promise<void> {
  if (cache) return Promise.resolve();
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(`${API}?action=site_data`, {
    headers: { "X-Authorization": "Bearer " },
  })
    .then(r => r.json())
    .then(d => { if (d.data) cache = d.data; })
    .catch(() => {});
  return fetchPromise;
}

export function useSiteData<T>(key: string, defaultValue: T): T {
  const [data, setData] = useState<T>(() => {
    if (cache && cache[key] !== undefined) return cache[key] as T;
    return defaultValue;
  });

  useEffect(() => {
    loadSiteData().then(() => {
      if (cache && cache[key] !== undefined) {
        setData(cache[key] as T);
      }
    });
  }, [key]);

  return data;
}
