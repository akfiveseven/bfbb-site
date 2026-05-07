"use client";

const difficultyColors: Record<string, string> = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-orange-400",
  Expert: "text-red-400",
  Experimental: "text-purple-400",
};

const Difficulty = ({ level, className }: { level: string, className?: string }) => {
  const color = difficultyColors[level] || "text-gray-400";

  return (
    <div className={`${color} ${className}`}>
      <p>{level}</p>
    </div>
  );
};

export { Difficulty };
