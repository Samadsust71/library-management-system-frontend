import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getBookColor = (index: number) => {
    const colors = [
      "from-emerald-400 to-emerald-500",
      "from-cyan-500 to-cyan-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-blue-500 to-blue-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[index % colors.length];
  };