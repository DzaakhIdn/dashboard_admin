import { useState, useCallback } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { useTheme, alpha as hexAlpha } from "@mui/material/styles";

import { fShortenNumber } from "@/utils/format-number";
import { Chart, useChart, ChartSelect, ChartLegends } from "@/components/chart";

// ----------------------------------------------------------------------

interface BookingStatisticsProps {
  title: string;
  subheader: string;
  chart: {
    series: {
      name: string;
      categories: string[];
      data: { name: string; value: number[] }[];
    }[];
    colors?: string[];
    options?: Record<string, unknown>;
  };
  sx?: Record<string, unknown>;
}

export function BookingStatistics({ title, subheader, chart, sx, ...other }: BookingStatisticsProps) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState("Yearly");

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const chartColors = [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.error.main, 0.48),
  ];

  const chartOptions = useChart({
  colors: chartColors,
  stroke: { width: 2, colors: ["transparent"] },
  xaxis: { categories: currentSeries?.categories },
  tooltip: { y: { formatter: (value: number) => `${value}` } },
  ...chart.options,
});

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  return (
    <Card sx={sx} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors ?? []}
        labels={chart.series[0].data.map((item) => item.name)}
        values={[fShortenNumber(6789), fShortenNumber(1234)]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="bar"
        series={currentSeries?.data}
        options={chartOptions}
        slotProps={{ loading: { p: 2.5 } }}
        sx={{
          pl: 1,
          py: 2.5,
          pr: 2.5,
          height: 320,
        }}
      />
    </Card>
  );
}
