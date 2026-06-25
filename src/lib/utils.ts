import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageSrc(src?: string | null) {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  return `/images/products/${src.replace(/^\.?\/?/, "")}`;
}
