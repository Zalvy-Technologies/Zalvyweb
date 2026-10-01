"use client";

interface AreaChartProps {
  data: { label: string; value: number; secondaryValue?: number }[];
  height?: number;
}

function formatCoord(value: number): string {
  return String(value);
}

export function AreaChart({ data, height = 220 }: AreaChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.flatMap((d) => [d.value, d.secondaryValue ?? 0])) * 1.15 || 100;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = 600;
  const chartHeight = height;
  const xDenominator = Math.max(data.length - 1, 1);

  const pointsPrimary = data.map((d, index) => {
    const x = paddingX + (index / xDenominator) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
    return `${formatCoord(x)},${formatCoord(y)}`;
  });

  const pointsSecondary = data.map((d, index) => {
    const x = paddingX + (index / xDenominator) * (chartWidth - paddingX * 2);
    const y =
      chartHeight - paddingY - ((d.secondaryValue ?? 0) / maxValue) * (chartHeight - paddingY * 2);
    return `${formatCoord(x)},${formatCoord(y)}`;
  });

  const areaPrimary = `${formatCoord(paddingX)},${formatCoord(chartHeight - paddingY)} ${pointsPrimary.join(" ")} ${formatCoord(chartWidth - paddingX)},${formatCoord(chartHeight - paddingY)}`;
  const areaSecondary = `${formatCoord(paddingX)},${formatCoord(chartHeight - paddingY)} ${pointsSecondary.join(" ")} ${formatCoord(chartWidth - paddingX)},${formatCoord(chartHeight - paddingY)}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${formatCoord(chartWidth)} ${formatCoord(chartHeight)}`}
        className="h-auto w-full overflow-visible"
      >
        <defs>
          <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="gradientSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
          return (
            <line
              key={i}
              x1={paddingX}
              y1={y}
              x2={chartWidth - paddingX}
              y2={y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeDasharray="4 4"
            />
          );
        })}

        {data[0]?.secondaryValue !== undefined && (
          <>
            <polygon points={areaSecondary} fill="url(#gradientSecondary)" />
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsSecondary.join(" ")}
            />
          </>
        )}

        <polygon points={areaPrimary} fill="url(#gradientPrimary)" />
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsPrimary.join(" ")}
        />

        {data.map((d, index) => {
          const x = paddingX + (index / xDenominator) * (chartWidth - paddingX * 2);
          const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
          return (
            <g key={index} className="group">
              <circle
                cx={x}
                cy={y}
                r="4.5"
                className="group-hover:r-6 cursor-pointer fill-white stroke-indigo-600 stroke-[2.5] transition-all"
              />
              <text
                x={x}
                y={chartHeight - 6}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-medium dark:fill-slate-500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function BarChart({ data, height = 200 }: BarChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value)) * 1.15 || 100;
  const paddingX = 30;
  const paddingY = 25;
  const chartWidth = 500;
  const chartHeight = height;
  const barWidth = Math.min(32, (chartWidth - paddingX * 2) / data.length - 12);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${formatCoord(chartWidth)} ${formatCoord(chartHeight)}`}
        className="h-auto w-full"
      >
        {data.map((d, index) => {
          const x = paddingX + index * ((chartWidth - paddingX * 2) / data.length) + 6;
          const barH = (d.value / maxValue) * (chartHeight - paddingY * 2);
          const y = chartHeight - paddingY - barH;

          return (
            <g key={index} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="6"
                className={`${d.color ?? "fill-indigo-600 dark:fill-indigo-500"} cursor-pointer transition-opacity group-hover:opacity-85`}
              />
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-slate-600 text-[10px] font-bold dark:fill-slate-300"
              >
                {d.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight - 6}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-medium dark:fill-slate-500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((d, idx) => {
    const segmentLength = (d.value / total) * circumference;
    const previousSum = data.slice(0, idx).reduce((sum, item) => sum + item.value, 0);
    const strokeDashoffset = -((previousSum / total) * circumference);
    return {
      ...d,
      strokeDasharray: `${formatCoord(segmentLength)} ${formatCoord(circumference)}`,
      strokeDashoffset,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
      <div className="relative h-36 w-36 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {segments.map((d, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={d.strokeDasharray}
              strokeDashoffset={d.strokeDashoffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-80"
            />
          ))}
        </svg>
        {(centerLabel ?? centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <span className="text-sm leading-none font-bold text-slate-900 dark:text-white">
                {centerValue}
              </span>
            )}
            {centerLabel && (
              <span className="mt-0.5 text-[10px] text-slate-400">{centerLabel}</span>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-2 text-xs">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="font-medium text-slate-600 dark:text-slate-300">{d.label}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              {d.value} ({Math.round((d.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
