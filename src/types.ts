export type CivicCategory =
  | "pothole"
  | "water_leak"
  | "street_light_failure"
  | "garbage_dump"
  | "road_damage"
  | "tree_fall"
  | "drainage_issue"
  | "other";

export interface CivicIssueReport {
  id: string;
  timestamp: string;
  issue_type: CivicCategory;
  title: string;
  description: string;
  location_hint: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  tags: string[];
  
  // User input metadata
  user_text?: string;
  user_voice?: string;
  user_image?: string; // Base64 or placeholder
  
  // Simulated operational status
  status: "open" | "investigating" | "assigned" | "resolved";
  assigned_department: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  admin_notes?: string;
}

export interface PresetInput {
  id: string;
  name: string;
  description: string;
  issue_type: CivicCategory;
  text: string;
  voiceTranscript: string;
  image: string; // Placeholder key or Base64 sample
  locationName: string;
  severity: "low" | "medium" | "high";
}
