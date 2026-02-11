"use client";

import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";

// PigMoney 헤더 (테마 토글만 유지)
const PigMoneyHeader = () => {
  return (
    <div className="bg-background-primary flex items-center justify-end border-b px-6 py-2">
      <ThemeToggleButton />
    </div>
  );
};

export default PigMoneyHeader;
