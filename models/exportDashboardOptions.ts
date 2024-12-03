import { Orientation } from '../utils';

type ContentOption = 'Include first 25 records per report' | 'Include all content per report';
type PaperSizeOption =
  | 'Letter (8.5" x 11")'
  | 'Legal (8.5" x 14")'
  | 'Tabloid (11" x 17")'
  | 'A3 (297 mm x 420 mm)'
  | 'A4 (210 mm x 297 mm)'
  | 'A5 (148 mm x 210 mm)'
  | 'B5 (176 mm x 250 mm)';

type ExportDashboardOptionsObject = {
  content?: ContentOption;
  paperSize?: PaperSizeOption;
  margins?: number;
  includeFooter?: boolean;
  orientation?: Orientation;
  scalePercentage?: number;
};

export class ExportDashboardOptions {
  content: ContentOption;
  paperSize: PaperSizeOption;
  margins: number;
  includeFooter: boolean;
  orientation: Orientation;
  scalePercentage: number;

  constructor({
    content = 'Include first 25 records per report',
    paperSize = 'Letter (8.5" x 11")',
    margins = 0.5,
    includeFooter = true,
    orientation = 'Portrait',
    scalePercentage = 100,
  }: ExportDashboardOptionsObject) {
    this.content = content;
    this.paperSize = paperSize;
    this.margins = margins;
    this.includeFooter = includeFooter;
    this.scalePercentage = scalePercentage;
    this.orientation = orientation;
  }
}
