
const Status = [
  "Draft",
  "Submitted",
  "Reviewing",
  "Update Required",
  "Approved",
  "Denied",
  "Other Resolution",
  "Admin Close",
];

const TravelType = [
  "Mainland",
  "Interisland",
];

const ExemptionCategory = [
  "CISA Federal Critical Infrastructure Sector",
  "Recreational Boat Arrival",
  "Other",
];

const Purpose = [
  "CISA Federal Critical Infrastructure Sector",
  "Military PCS",
  "Federal Government",
  "Student",
  "Negative COVID Test",
  "Positive COVID Test",
  "Other",
  "Flight Crew",
  "Transit",
  "Teacher - DOE",
  "Teacher - Private",
  "State Employee",
  "County Employee",
  "Police / Fire",
  "Pre-Travel Testing Program",
  "Change of Quarantine Location",
  "Recreational Boat Arrival",
  "End of Life",
  "Compassion",
  "Patient Visit",
  "Funeral",
  "Vacation",
];

const CISASubCategory = [
  "Healthcare / Public Health",
  "Law Enforcement / Public  Safety / First Responder",
  "Food and Agriculture",
  "Energy",
  "Water and Wastewater",
  "Transportation and Logistics",
  "Public Works / Infrastructure Support",
  "Communications and IT",
  "Community or Government-Based Operation",
  "Critical Manufacturing",
  "Hazardous Materials",
  "Financial Services",
  "Chemical",
  "Defense Industrial Base",
  "Commercial Facilities",
  "Shelter, Housing, Real Estate, and Related Services",
  "Hygiene Products and Services",
];

const DestinationIsland = [
  "Oʻahu",
  "Maui",
  "Kauaʻi",
  "Lānaʻi",
  "Hawaiʻi (Big Island)",
  "Molokaʻi",
];

const QuarantineLocationType = [
  "Hotel / Motel",
  "Private Residence",
  "Air BnB / Vacation Rental",
  "Military Base / On Post",
];

const OriginCountry = [
  "United States",
  "Canada",
  "China",
  "Europe",
  "Hong Kong",
  "Japan",
  "Oceania",
  "South East Asia",
  "South Korea",
  "Taiwan",
];

const OriginState = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const ENUM = {
  Status,
  TravelType,
  ExemptionCategory,
  Purpose,
  CISASubCategory,
  DestinationIsland,
  QuarantineLocationType,
  OriginCountry,
  OriginState,
}

export default ENUM;
