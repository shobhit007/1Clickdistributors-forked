export const roles = [
  "superAdmin",
  "businessAdmin",
  "salesMember",
  "salesManager",
  "accountsManager",
  "accountsMember",
  "serviceMember",
  "serviceManager",
];

export const panelRoles = [
  { department: "management", hierarchy: ["superAdmin", "admin"] },
  {
    department: "sales",
    hierarchy: ["manager", "executive"],
  },
];

export const panels = [
  {
    panel: "allocate_leads",
  },
  {
    panel: "sales_panel",
  },
  {
    panel: "manage_users",
  },
  {
    panel: "roles_and_permissions",
  },
  {
    panel: "panel_settings",
  },
];

export const panelNames = {
  allocate_leads: "allocate leads",
  sales_panel: "sales",
  manage_users: "manage users",
  roles_and_permissions: "roles and permissions",
  panel_settings: "panel settings",
};

export const panelPermissions = [
  {
    panelName: "sales_panel",
    permissions: ["view", "update", "delete", "re-update"],
  },
  {
    panelName: "allocate_leads",
    permissions: ["view", "update", "delete", "allocate_leads"],
  },
  {
    panelName: "HRMS",
    permissions: [
      "view_attendance",
      "view_allusers_attendance",
      "manipulate_attendance",
    ],
  },
  {
    panelName: "manage_users",
    permissions: ["view_users", "edit_users", "edit_password"],
  },
];

export const dispositions = [
  "Not Open",
  "No Response",
  "Call Back",
  "Presentation",
  "FollowUp",
  "Prospect",
  "Payment",
  "Not Interested",
  "Presentation NI",
  "Prospect NI",
  "No Contactable",
  "Become Distributor",
  "Deal Done",
];

export const subDispositions = {
  "Not Open": ["Hot Lead"],
  "No Response": ["Ringing", "S.Off", "Not Reachable", "Hung Up"],
  "Call Back": ["Call Back"],
  Presentation: [
    "Present-Digi Pro",
    "Present-Grow Max",
    "Present-SMM",
    "Present-Website",
    "Present-Other",
  ],
  FollowUp: ["Presentation-Followup"],
  Prospect: ["Prospect-Followup"],
  Payment: ["Payment-Followup"],
  "Not Interested": ["Opted for Competition", "Price Issue", "Not Now"],
  "Presentation NI": ["Opted for Competition", "Price Issue", "Not Now"],
  "Prospect NI": ["Opted for Competition", "Price Issue", "Not Now"],
  "Become Distributor": ["None"],
  "No Contactable": ["None"],
  "Deal Done": [
    "Present - Digi Pro",
    "Present - Grow Max",
    "Present - SMM",
    "Present - Website",
    "Present - Other",
  ],
};

export const salesPanelColumns = {
  created_time: "Created Time",
  city: "City",
  source: "Source",
  "whats_is_your_requirement_?_write_in_brief": "Query",
  adType: "Ad Type",
  full_name: "Full Name",
  looking_for: "Looking For",
  company_name: "Company Name",
  your_mobile_number: "Mobile Number",
  phone_number: "Phone Number",
  email: "Email",
  leadId: "Lead Id",
  assignedAt: "Assigned At",
  createdAt: "Created At",
  updatedAt: "Updated At",
  disposition: "Disposition",
  subDisposition: "Sub Disposition",
  followUpDate: "Follow Up Date",
  salesExecutiveName: "Executive",
  remarks: "Remarks",
  "whats_is_your_requirement_?_write_in_brief": "Query",
};

export const designations = [
  "Owner",
  "Founder",
  "Co-founder",
  "Director",
  "Proprietor",
  "Partner",
  "Sales officer",
  "Executive",
  "AM",
  "Marketing Manager",
  "Manager",
  "Business Head",
];

export const cellColors = {
  "Not Open": "#D8433A", // Deeper Coral
  "No Response": "#D4880F", // Deeper Orange
  "Call Back": "#6D3590", // Deep Purple
  Presentation: "#2A80B9", // Deeper Blue
  FollowUp: "#129575", // Deep Turquoise
  Prospect: "#239B56", // Darker Green
  Payment: "#C0392B", // Deep Red
  "Not Interested": "#5D6D7E", // Darker Gray Teal
  "Presentation NI": "#7D3C98", // Dark Violet
  "Prospect NI": "#13856D", // Dark Aqua Green
  "No Contactable": "#2C3E50", // Deeper Steel Blue
  "Become Distributor": "#D35400", // Rich Amber
  "Deal Done": "#1E8449", // Deep Vibrant Green
  Today_Followup: "#AF7AC5", // Bold Lavender
  "Presentation-Followup": "#2874A6", // Deep Sky Blue
  "Prospect-Followup": "#117A65", // Dark Teal Green
};
