import { SavedReportAsChart } from './report';

type ChartVisibility =
  | 'Display Chart and Report Data'
  | 'Display Chart and Chart Data'
  | 'Display Chart Only'
  | 'Display Chart Data Only';

type ChartMode = 'Simple' | 'Advanced';

type ChartType =
  | 'Bar'
  | 'Column'
  | 'Pie'
  | 'Donut'
  | 'Line'
  | 'Spline'
  | 'Funnel'
  | 'Pyramid'
  | 'Stacked Bar'
  | 'Column Plus Line'
  | 'Stacked Column'
  | 'Stacked Column Plus Line'
  | 'Bubble'
  | 'Heat Map'
  | 'Radar';

export const DisplayOptionLabel = {
  showValues: 'Show Values',
  threeD: '3D',
  rotateLabels: 'Rotate Labels',
  singlePlotColor: 'Single Plot Color',
  showSlices: 'Show Slices',
  viewUsingPercentages: 'View using percentages',
  viewUsingProgression: 'View using progression',
  showLegend: 'Show Legend',
  stackAllTo100Percent: 'Stack all to 100%',
  showStackTotals: 'Show Stack Totals',
  dualYAxis: 'Dual Y Axis',
  rotateValues: 'Rotate Values',
  displayVerticalLine: 'Display a vertical line at the current date/time',
  markerClustering: 'Enable marker clustering on map zoom out',
  showAnchorPoints: 'Show Anchor Points',
  showAxisValues: 'Show Axis Values',
  customOpacity: 'Custom Opacity',
} as const;

export type ChartDisplayOption = {
  name: string;
  status: boolean;
};

type ChartObject = {
  visibility?: ChartVisibility;
  groupData: string;
  summaryData?: string;
  type: ChartType;
  mode: ChartMode;
  displayOptions?: ChartDisplayOption[];
};

export abstract class Chart {
  visibility: ChartVisibility;
  groupData: string;
  summaryData: string;
  type: ChartType;
  mode: ChartMode;
  displayOptions: ChartDisplayOption[];

  constructor({
    visibility = 'Display Chart and Report Data',
    groupData,
    summaryData = 'Record Count',
    type,
    mode,
    displayOptions = [],
  }: ChartObject) {
    this.visibility = visibility;
    this.groupData = groupData;
    this.summaryData = summaryData;
    this.type = type;
    this.mode = mode;
    this.displayOptions = displayOptions;
  }
}

type AdvancedChartObject = ChartObject & { seriesData: string };

export abstract class AdvancedChart extends Chart {
  seriesData: string;

  constructor({ visibility, groupData, summaryData, seriesData, type, mode, displayOptions }: AdvancedChartObject) {
    super({ visibility, groupData, summaryData, type, mode, displayOptions });
    this.seriesData = seriesData;
  }
}

type BarChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  threeD?: boolean;
  singlePlotColor?: boolean;
};

export class BarChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    showValues = false,
    threeD = false,
    singlePlotColor = false,
  }: BarChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Bar',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type ColumnChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  threeD?: boolean;
  rotateLabels?: boolean;
  singlePlotColor?: boolean;
};

export class ColumnChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    showValues = false,
    threeD = false,
    rotateLabels = false,
    singlePlotColor = false,
  }: ColumnChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Column',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type PieChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  threeD?: boolean;
  showSlices?: boolean;
  viewUsingPercentages?: boolean;
  showLegend?: boolean;
  singlePlotColor?: boolean;
};

export class PieChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    threeD = false,
    showSlices = false,
    viewUsingPercentages = false,
    showLegend = false,
    singlePlotColor = false,
  }: PieChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Pie',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.showSlices, status: showSlices },
        { name: DisplayOptionLabel.viewUsingPercentages, status: viewUsingPercentages },
        { name: DisplayOptionLabel.showLegend, status: showLegend },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type DonutChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  threeD?: boolean;
  showSlices?: boolean;
  viewUsingPercentages?: boolean;
  showLegend?: boolean;
  singlePlotColor?: boolean;
};

export class DonutChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    threeD = false,
    showSlices = false,
    viewUsingPercentages = false,
    showLegend = false,
    singlePlotColor = false,
  }: DonutChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Donut',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.showSlices, status: showSlices },
        { name: DisplayOptionLabel.viewUsingPercentages, status: viewUsingPercentages },
        { name: DisplayOptionLabel.showLegend, status: showLegend },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type LineChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  rotateLabels?: boolean;
  singlePlotColor?: boolean;
};

export class LineChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    showValues = false,
    rotateLabels = false,
    singlePlotColor = false,
  }: LineChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Line',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type SplineChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  rotateLabels?: boolean;
  singlePlotColor?: boolean;
};

export class SplineChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    showValues = false,
    rotateLabels = false,
    singlePlotColor = false,
  }: SplineChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Spline',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type FunnelChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  threeD?: boolean;
  showSlices?: boolean;
  viewUsingPercentages?: boolean;
  viewUsingProgression?: boolean;
  singlePlotColor?: boolean;
};

export class FunnelChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    threeD = false,
    showSlices = false,
    viewUsingPercentages = false,
    viewUsingProgression = false,
    singlePlotColor = false,
  }: FunnelChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Funnel',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.showSlices, status: showSlices },
        { name: DisplayOptionLabel.viewUsingPercentages, status: viewUsingPercentages },
        { name: DisplayOptionLabel.viewUsingProgression, status: viewUsingProgression },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type PyramidChartObject = Omit<ChartObject, 'type' | 'mode'> & {
  threeD?: boolean;
  showSlices?: boolean;
  viewUsingPercentages?: boolean;
  viewUsingProgression?: boolean;
  singlePlotColor?: boolean;
};

export class PyramidChart extends Chart {
  constructor({
    visibility,
    groupData,
    summaryData,
    threeD = false,
    showSlices = false,
    viewUsingPercentages = false,
    viewUsingProgression = false,
    singlePlotColor = false,
  }: PyramidChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      type: 'Pyramid',
      mode: 'Simple',
      displayOptions: [
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.showSlices, status: showSlices },
        { name: DisplayOptionLabel.viewUsingPercentages, status: viewUsingPercentages },
        { name: DisplayOptionLabel.viewUsingProgression, status: viewUsingProgression },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}

type StackedBarChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  threeD?: boolean;
  stackAllTo100Percent?: boolean;
  showStackTotals?: boolean;
};

export class StackedBarChart extends AdvancedChart {
  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    showValues = false,
    threeD = false,
    stackAllTo100Percent = false,
    showStackTotals = false,
  }: StackedBarChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Stacked Bar',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.stackAllTo100Percent, status: stackAllTo100Percent },
        { name: DisplayOptionLabel.showStackTotals, status: showStackTotals },
      ],
    });
  }
}

type ColumnPlusLineChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  lineChart: LineChart | SplineChart | SavedReportAsChart;
  showValues?: boolean;
  threeD?: boolean;
  rotateLabels?: boolean;
  dualYAxis?: boolean;
  singlePlotColor?: boolean;
};

export class ColumnPlusLineChart extends AdvancedChart {
  lineChart: LineChart | SplineChart | SavedReportAsChart;
  dualYAxis: boolean;

  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    lineChart,
    showValues = false,
    threeD = false,
    rotateLabels = false,
    dualYAxis = false,
    singlePlotColor = false,
  }: ColumnPlusLineChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Column Plus Line',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.dualYAxis, status: dualYAxis },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
    this.lineChart = lineChart;
    this.dualYAxis = dualYAxis;
  }
}

export type StackedColumnChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  rotateValues?: boolean;
  threeD?: boolean;
  rotateLabels?: boolean;
  stackAllTo100Percent?: boolean;
  showStackTotals?: boolean;
};

export class StackedColumnChart extends AdvancedChart {
  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    showValues = false,
    rotateValues = false,
    threeD = false,
    rotateLabels = false,
    stackAllTo100Percent = false,
    showStackTotals = false,
  }: StackedColumnChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Stacked Column',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.rotateValues, status: rotateValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.stackAllTo100Percent, status: stackAllTo100Percent },
        { name: DisplayOptionLabel.showStackTotals, status: showStackTotals },
      ],
    });
  }
}

type StackedColumnPlusLineChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  lineChart: LineChart | SplineChart | SavedReportAsChart;
  showValues?: boolean;
  rotateValues?: boolean;
  threeD?: boolean;
  rotateLabels?: boolean;
  showStackTotals?: boolean;
  dualYAxis?: boolean;
};

export class StackedColumnPlusLineChart extends AdvancedChart {
  lineChart: LineChart | SplineChart | SavedReportAsChart;
  dualYAxis: boolean;

  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    lineChart,
    showValues = false,
    rotateValues = false,
    threeD = false,
    rotateLabels = false,
    showStackTotals = false,
    dualYAxis = false,
  }: StackedColumnPlusLineChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Stacked Column Plus Line',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.rotateValues, status: rotateValues },
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.showStackTotals, status: showStackTotals },
        { name: DisplayOptionLabel.dualYAxis, status: dualYAxis },
      ],
    });
    this.lineChart = lineChart;
    this.dualYAxis = dualYAxis;
  }
}

type BubbleChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  additionalGroupData: string;
  threeD?: boolean;
  rotateLabels?: boolean;
  singlePlotColor?: boolean;
};

export class BubbleChart extends AdvancedChart {
  additionalGroupData: string;

  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    additionalGroupData,
    threeD = false,
    rotateLabels = false,
    singlePlotColor = false,
  }: BubbleChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Bubble',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.threeD, status: threeD },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
      ],
    });
    this.additionalGroupData = additionalGroupData;
  }
}

export type ColorStop = { value: number; color: string };

type HeatMapChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  rotateLabels?: boolean;
  colorStops: ColorStop[];
};

export class HeatMapChart extends AdvancedChart {
  colorStops: ColorStop[];

  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    showValues = false,
    rotateLabels = false,
    colorStops,
  }: HeatMapChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Heat Map',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.rotateLabels, status: rotateLabels },
      ],
    });
    this.colorStops = colorStops;

    if (this.colorStops.length < 2) {
      throw new Error('Heat map chart must have at least 2 color stops');
    }
  }
}

export type RadarChartObject = Omit<AdvancedChartObject, 'type' | 'mode'> & {
  showValues?: boolean;
  showAnchorPoints?: boolean;
  showAxisValues?: boolean;
  showLegend?: boolean;
  singlePlotColor?: boolean;
  customOpacity?: boolean;
};

export class RadarChart extends AdvancedChart {
  constructor({
    visibility,
    groupData,
    summaryData,
    seriesData,
    showValues = false,
    showAnchorPoints = false,
    showAxisValues = false,
    showLegend = false,
    singlePlotColor = false,
    customOpacity = false,
  }: RadarChartObject) {
    super({
      visibility,
      groupData,
      summaryData,
      seriesData,
      type: 'Radar',
      mode: 'Advanced',
      displayOptions: [
        { name: DisplayOptionLabel.showValues, status: showValues },
        { name: DisplayOptionLabel.showAnchorPoints, status: showAnchorPoints },
        { name: DisplayOptionLabel.showAxisValues, status: showAxisValues },
        { name: DisplayOptionLabel.showLegend, status: showLegend },
        { name: DisplayOptionLabel.singlePlotColor, status: singlePlotColor },
        { name: DisplayOptionLabel.customOpacity, status: customOpacity },
      ],
    });
  }
}
