"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  showMascot?: boolean;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  showMascot = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4">
      {showMascot ? (
        <div className="relative h-24 w-24 opacity-90 animate-in zoom-in-95 duration-300">
          <Image
            src="/images/mascot.png"
            alt="Zylo Mascot Empty State"
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
      ) : (
        icon && (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            {icon}
          </div>
        )
      )}

      <div className="space-y-1.5 max-w-sm">
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
