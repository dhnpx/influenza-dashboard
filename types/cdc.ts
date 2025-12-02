// CDC RESP-NET - Respiratory Virus Hospitalization Surveillance Network
// Dataset: mpgq-jmmr (https://data.cdc.gov/resource/mpgq-jmmr.json)
// This dataset tracks hospital admissions and bed utilization for respiratory viruses

export interface CDCRespNetData {
  // Core fields
  weekendingdate: string;
  jurisdiction: string; // State code (e.g., "AK", "AL") or "USA" for national

  // Hospital bed capacity
  numinptbeds?: string; // Total inpatient beds
  numinptbedsadult?: string;
  numinptbedsped?: string;
  numinptbedsocc?: string; // Occupied inpatient beds
  pctinptbedsocc?: string; // Percentage occupied

  // ICU capacity
  numicubeds?: string;
  numicubedsocc?: string;
  pcticubedsocc?: string;

  // Flu hospitalization - Current patients
  numconffluhosppatsadult?: string;
  numconffluhosppatsped?: string;
  totalconffluhosppats?: string; // Total current flu patients
  pctconffluinptbeds?: string; // % of inpatient beds with flu patients

  // Flu hospitalization - ICU patients
  numconffluicupatsadult?: string;
  numconffluicupatsped?: string;
  totalconffluicupats?: string;
  pctconffluicubeds?: string;

  // Flu admissions - New this week by age group
  numconfflunewadmped0to4?: string;
  numconfflunewadmped5to17?: string;
  totalconfflunewadmped?: string;
  numconfflunewadmadult18to49?: string;
  numconfflunewadmadult50to64?: string;
  numconfflunewadmadult65to74?: string;
  numconfflunewadmadult75plus?: string;
  totalconfflunewadmadult?: string;
  totalconfflunewadm?: string; // Total new flu admissions this week

  // Per capita rates (per 100,000 population)
  totalconfflunewadmpedper100k?: string;
  totalconfflunewadmadultper100k?: string;
  totalconfflunewadmper100k?: string; // Total admission rate per 100k

  // Hospital reporting metrics
  numinptbedshosprep?: string; // Number of hospitals reporting
  totalconffluhosppatshosprep?: string;
  totalconfflunewadmhosprep?: string;

  // COVID-19 and RSV data (also included in dataset)
  totalconfc19hosppats?: string;
  totalconfc19newadm?: string;
  totalconfrsvhosppats?: string;
  totalconfrsvnewadm?: string;
}

// Processed data with proper types for calculations
export interface ProcessedCDCData {
  weekEndDate: Date;
  jurisdiction: string;

  // Bed utilization
  totalInpatientBeds: number;
  occupiedInpatientBeds: number;
  percentBedsOccupied: number;

  // Flu metrics
  totalFluPatients: number;
  newFluAdmissions: number;
  percentFluBeds: number;
  admissionsPerCapita: number; // Per 100k

  // Age breakdowns
  fluAdmissionsPediatric: number;
  fluAdmissionsAdult: number;

  // ICU
  totalFluICUPatients: number;
  percentFluICU: number;
}

// State-level aggregated data for mapping
export interface CDCByState {
  [stateCode: string]: {
    jurisdiction: string;
    weekEndDate: string;
    totalFluPatients: number;
    newFluAdmissions: number;
    admissionsPerCapita: number;
    percentFluBeds: number;
    hospitalsReporting: number;
  };
}
