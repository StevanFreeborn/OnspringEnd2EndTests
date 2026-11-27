export type SurveyCampaignType = 'Targeted Recipients' | 'Public';

export type SurveyCampaignStatus = 'Pre-Launch' | 'Running' | 'Complete' | 'Complete (Archived)';

export type SurveyCampaignActionButtons = {
  saveProgress?: string;
  next?: string;
  completeAndSubmit?: string;
  previous?: string;
};

type SurveyCampaignObject = {
  id?: number;
  name: string;
  type?: SurveyCampaignType;
  description?: string;
  endDate?: string;
  allowPageSkipping?: boolean;
  actionButtons?: SurveyCampaignActionButtons;
};

export class SurveyCampaign {
  id: number;
  name: string;
  type: SurveyCampaignType;
  description: string;
  endDate?: string;
  allowPageSkipping: boolean;
  actionButtons?: SurveyCampaignActionButtons;

  constructor({
    id = 0,
    name,
    type = 'Targeted Recipients',
    description = '',
    endDate,
    allowPageSkipping = true,
    actionButtons,
  }: SurveyCampaignObject) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.endDate = endDate;
    this.allowPageSkipping = allowPageSkipping;
    this.actionButtons = actionButtons;
  }
}
