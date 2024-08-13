type ChartVisibility =
  | 'Display Chart and Report Data'
  | 'Display Chart and Chart Data'
  | 'Display Chart Only'
  | 'Display Chart Data Only';

type ChartMode = 'Simple' | 'Advanced';

type ChartType = 'Bar' | 'Column';

const DisplayOptionLabels = {
  showValues: 'Show Values',
  threeD: '3D',
  rotateLabels: 'Rotate Labels',
  singlePlotColor: 'Single Plot Color',
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
        { name: DisplayOptionLabels.showValues, status: showValues },
        { name: DisplayOptionLabels.threeD, status: threeD },
        { name: DisplayOptionLabels.singlePlotColor, status: singlePlotColor },
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
        { name: DisplayOptionLabels.showValues, status: showValues },
        { name: DisplayOptionLabels.threeD, status: threeD },
        { name: DisplayOptionLabels.rotateLabels, status: rotateLabels },
        { name: DisplayOptionLabels.singlePlotColor, status: singlePlotColor },
      ],
    });
  }
}
