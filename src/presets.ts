import { PresetInput } from "./types";

// Custom vector SVGs representing civic issues, encoded as safe inline data URLs
export const POTHOLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="100%" height="100%" fill="%232e3033" />
  <!-- Road lines -->
  <line x1="0" y1="150" x2="120" y2="150" stroke="%23ffc72c" stroke-width="12" stroke-dasharray="25,15" />
  <line x1="280" y1="150" x2="400" y2="150" stroke="%23ffc72c" stroke-width="12" stroke-dasharray="25,15" />
  <!-- Pothole crater background -->
  <ellipse cx="200" cy="150" rx="75" ry="40" fill="%23141517" stroke="%2345494e" stroke-width="6" />
  <!-- Deep inner cracks -->
  <ellipse cx="190" cy="155" rx="40" ry="20" fill="%230b0c0d" />
  <!-- Cracks on the asphalt -->
  <path d="M 125 150 L 110 160 L 95 155 M 275 150 L 290 140 L 310 145 M 200 110 L 195 90 L 205 75 M 200 190 L 210 215 L 200 230" stroke="%23141517" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Hazard indicator -->
  <circle cx="200" cy="150" r="15" fill="%23ea4335" opacity="0.3" />
  <circle cx="200" cy="150" r="6" fill="%23ea4335" />
  <text x="20" y="50" fill="%23ffffff" font-family="monospace" font-size="14" font-weight="bold">CIVIC_REF: ROAD_INCIDENT_09</text>
  <text x="20" y="270" fill="%23ea4335" font-family="monospace" font-size="14" font-weight="bold">WARNING: SURFACE DEFORMATION</text>
</svg>`;

export const WATER_LEAK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="100%" height="100%" fill="%231a2636" />
  <!-- Concrete Sidewalk -->
  <path d="M 0 200 L 400 200" stroke="%234a5d78" stroke-width="10" />
  <!-- Water Main Pipe -->
  <rect x="0" y="190" width="400" height="20" fill="%232d3d52" />
  <!-- Pipe Joint -->
  <rect x="180" y="180" width="40" height="40" fill="%23435873" rx="4" />
  <!-- Sprays and Splashes -->
  <path d="M 200 180 C 170 110, 130 90, 100 120 C 130 130, 160 140, 200 180" fill="%234285f4" opacity="0.8" />
  <path d="M 200 180 C 230 100, 270 70, 310 100 C 280 120, 250 145, 200 180" fill="%234285f4" opacity="0.8" />
  <path d="M 200 180 Q 210 50, 230 40 Q 215 90, 200 180" fill="%23a0c3ff" opacity="0.9" />
  <!-- Water puddles on pavement -->
  <ellipse cx="140" cy="225" rx="70" ry="15" fill="%234285f4" opacity="0.6" />
  <ellipse cx="270" cy="235" rx="90" ry="20" fill="%234285f4" opacity="0.5" />
  <!-- Splashes -->
  <circle cx="210" cy="80" r="5" fill="%23a0c3ff" />
  <circle cx="160" cy="100" r="7" fill="%23a0c3ff" />
  <circle cx="260" cy="90" r="6" fill="%234285f4" />
  <text x="20" y="50" fill="%23a0c3ff" font-family="monospace" font-size="14" font-weight="bold">CIVIC_REF: WATER_SYS_44</text>
  <text x="20" y="270" fill="%234285f4" font-family="monospace" font-size="14" font-weight="bold">SUB_SURFACE PRESSURE: HIGH</text>
</svg>`;

export const STREET_LIGHT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="100%" height="100%" fill="%23111317" />
  <!-- Ground -->
  <line x1="0" y1="260" x2="400" y2="260" stroke="%232c3038" stroke-width="8" />
  <!-- Pole -->
  <line x1="150" y1="260" x2="150" y2="80" stroke="%23484f5c" stroke-width="12" />
  <path d="M 150 80 Q 150 50, 190 45" fill="none" stroke="%23484f5c" stroke-width="12" stroke-linecap="round" />
  <!-- Lamp Head -->
  <rect x="180" y="40" width="40" height="20" fill="%2330353f" rx="5" />
  <ellipse cx="200" cy="60" rx="15" ry="8" fill="%2322252c" />
  <!-- Dead light cross indicators -->
  <path d="M 190 55 L 210 65 M 210 55 L 190 65" stroke="%23ea4335" stroke-width="3" />
  <!-- Contrast warning -->
  <circle cx="200" cy="60" r="30" fill="none" stroke="%23ea4335" stroke-dasharray="6,4" stroke-width="2" opacity="0.8" />
  <!-- Moon/Dark Ambient elements -->
  <path d="M 330 60 A 25 25 0 0 0 310 100 A 30 30 0 1 1 330 60" fill="%23484f5c" opacity="0.3" />
  <text x="20" y="50" fill="%238a95a5" font-family="monospace" font-size="14" font-weight="bold">GRID: ZONE_D_LITE_82</text>
  <text x="20" y="275" fill="%23ea4335" font-family="monospace" font-size="14" font-weight="bold">GRID STATUS: OFFLINE</text>
</svg>`;

export const GARBAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="100%" height="100%" fill="%231d241d" />
  <!-- Forest Trail background -->
  <path d="M 0 240 C 100 230, 200 250, 400 240 L 400 300 L 0 300 Z" fill="%232e3a2e" />
  <!-- Trees Silhouette -->
  <path d="M 30 240 L 45 150 L 55 240 M 350 240 L 365 130 L 380 240" stroke="%231b211b" stroke-width="15" stroke-linecap="round" />
  <!-- Overflow Dump Dumpster -->
  <rect x="120" y="150" width="160" height="100" fill="%232c3d30" rx="8" stroke="%234a624f" stroke-width="4" />
  <line x1="120" y1="180" x2="280" y2="180" stroke="%231b211b" stroke-width="4" />
  <rect x="150" y="130" width="45" height="20" fill="%231b211b" rx="2" />
  <rect x="205" y="130" width="45" height="20" fill="%231b211b" rx="2" />
  <!-- Scattered trash bags / cardboard boxes -->
  <path d="M 90 250 C 70 230, 60 260, 90 260 Z" fill="%233c4043" />
  <path d="M 80 255 C 70 245, 60 265, 80 265 Z" fill="%231a1c1e" />
  <rect x="260" y="230" width="35" height="30" fill="%23b08e62" transform="rotate(15, 260, 230)" />
  <path d="M 290 250 C 310 240, 320 265, 290 265 Z" fill="%232b5078" />
  <!-- Spilling trash details -->
  <circle cx="160" cy="140" r="10" fill="%23ea4335" opacity="0.8" />
  <circle cx="230" cy="140" r="12" fill="%23ffc72c" opacity="0.8" />
  <text x="20" y="50" fill="%237ca37c" font-family="monospace" font-size="14" font-weight="bold">RESERVE_ID: PARKS_N_07</text>
  <text x="20" y="285" fill="%23ea4335" font-family="monospace" font-size="14" font-weight="bold">ECOLOGICAL CRITICAL: DETECTED</text>
</svg>`;

export const PRESETS: PresetInput[] = [
  {
    id: "preset-pothole",
    name: "Indiranagar 100 Ft Rd Pothole",
    description: "Multi-layered visual and transcript hazard report of deep asphalt degradation on a major artery.",
    issue_type: "pothole",
    text: "There is a massive, deep crater in the middle of the northbound lane. It's causing cars to swerve dangerously to avoid it.",
    voiceTranscript: "Hi, I'm calling about a huge hole on 100 Feet Road, right near Indiranagar. It looks like it's about 8 inches deep and has sharp jagged edges. Someone is going to pop their tire or crash their car soon.",
    image: POTHOLE_SVG,
    locationName: "100 Feet Road, Indiranagar, Bengaluru",
    severity: "high",
  },
  {
    id: "preset-water",
    name: "Connaught Place Water Leak",
    description: "Pressurized sub-surface pipe rupture leaking clean drinking water onto sidewalks.",
    issue_type: "water_leak",
    text: "Clean drinking water has been gushing out of the sidewalk pavement for the past 4 hours. It's starting to flood the curb.",
    voiceTranscript: "Yeah, there's a major water main break here on Connaught Place, right outside Block E. It is flooding the gutter, wasting so much clean water, and starting to block the pedestrian crosswalk.",
    image: WATER_LEAK_SVG,
    locationName: "Block E, Connaught Place, New Delhi",
    severity: "medium",
  },
  {
    id: "preset-light",
    name: "Marine Drive Dead Streetlight",
    description: "Local community pathway lamp grid outage creating safety concerns at night.",
    issue_type: "street_light_failure",
    text: "The street light in front of the promenade has been completely dark for over a week, making the pathway unsafe at night.",
    voiceTranscript: "Hello, the street lamp right in front of Marine Drive Promenade Pillar 112 is completely dead. It's pitch black here in the evenings, which is a safety issue for walkers and runners.",
    image: STREET_LIGHT_SVG,
    locationName: "Marine Drive Promenade Pillar 112, Mumbai",
    severity: "low",
  },
  {
    id: "preset-garbage",
    name: "Anna Nagar Tower Park Dump",
    description: "Eco-hazardous construction debris and furniture dump on public nature reserve trial.",
    issue_type: "garbage_dump",
    text: "Several bags of construction debris, toxic paint containers, and old furniture have been illegally dumped on the park trail.",
    voiceTranscript: "Someone has dumped a bunch of old wooden furniture and toxic trash bags right at the Anna Nagar Tower Park back alley. It is totally blocking the walkway and looks terrible.",
    image: GARBAGE_SVG,
    locationName: "Anna Nagar Tower Park Back Alley, Chennai",
    severity: "medium",
  },
];

// Pre-populate sample historic reported items to build a pristine layout from the very start
export const INITIAL_HISTORIC_REPORTS = [
  {
    id: "rep-001",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    issue_type: "drainage_issue" as const,
    title: "Clogged storm drain flooding 10th St",
    description: "The storm drain is heavily clogged with autumn leaves and plastic waste, causing water to pool up to 6 inches deep on the roadway.",
    location_hint: "10th Street & Bellevue Avenue intersection",
    severity: "medium" as const,
    confidence: 0.95,
    tags: ["drainage", "stormwater", "public safety"],
    user_text: "Clogged storm drain flooding 10th St",
    user_voice: "Storm drain is backed up at 10th and Bellevue, it's starting to flood the sidewalk.",
    status: "investigating" as const,
    assigned_department: "Municipal Drainage and Sewerage Dept",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    admin_notes: "Dispatched drainage response team. Scheduled clearing by tonight.",
  },
  {
    id: "rep-002",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hours ago
    issue_type: "tree_fall" as const,
    title: "Large pine branch blocking bike lane",
    description: "A major pine branch has fallen off a city-owned park tree during the storm, completely obstructing the bike lane and sidewalk.",
    location_hint: "Elm Road, near entrance of Washington Park",
    severity: "medium" as const,
    confidence: 0.98,
    tags: ["parks & rec", "bike safety", "tree maintenance"],
    status: "assigned" as const,
    assigned_department: "Urban Forestry and Tree Care Team",
    coordinates: { lat: 37.7833, lng: -122.4167 },
    admin_notes: "Assigned to Team 3. Chainsaw crew scheduled for morning clearing.",
  },
  {
    id: "rep-003",
    timestamp: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
    issue_type: "water_leak" as const,
    title: "Burst water valve on Broad St",
    description: "An underground water valve ruptured causing a constant stream of water pouring down the road from the curb.",
    location_hint: "Broad St & 14th Ave, near the fire hydrant",
    severity: "high" as const,
    confidence: 0.92,
    tags: ["water leak", "utility rupture", "emergency response"],
    status: "resolved" as const,
    assigned_department: "City Water Works Agency",
    coordinates: { lat: 37.7682, lng: -122.4245 },
    admin_notes: "Water main shutoff successfully completed, valve replaced, sidewalk patched.",
  },
  {
    id: "rep-004",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
    issue_type: "pothole" as const,
    title: "Deep pothole in high-speed zone",
    description: "A wide, deep pothole in the left lane of Lincoln Highway, creating immediate vehicle collision hazards.",
    location_hint: "Lincoln Highway Eastbound, Mile Marker 12.4",
    severity: "high" as const,
    confidence: 0.89,
    tags: ["pothole", "high speed road", "asphalt care"],
    status: "resolved" as const,
    assigned_department: "State Highways Maintenance Dept",
    coordinates: { lat: 37.7599, lng: -122.4368 },
    admin_notes: "Cold patch applied temporarily. Permanent hot-mix repaving completed on June 25.",
  },
];
