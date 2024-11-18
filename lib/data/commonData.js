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
  source: "Lead Source",
  createdAt: "Creation date",
  dataTag: "Data Tag",
  profileId: "Profile Id",
  looking_for: "Looking For",
  company_name: "Company Name",
  full_name: "Name",
  your_mobile_number: "Mobile Number",
  email: "Email",
  city: "City",
  "whats_is_your_requirement_?_write_in_brief": "Query",
  followUpDate: "Followup",
  disposition: "Disposition",
  remarks: "Remarks",
  adType: "Ad Type",
  phone_number: "Phone Number",
  leadId: "Lead Id",
  assignedAt: "Assigned At",
  createdAt: "Created At",
  updatedAt: "Updated At",
  subDisposition: "Sub Disposition",
  salesExecutiveName: "Executive",
  "whats_is_your_requirement_?_write_in_brief": "Query",
};

export const leadsPanelColumns = {
  source: "Lead Source",
  createdAt: "Creation date",
  dataTag: "Data Tag",
  profileId: "Profile Id",
  looking_for: "Looking For",
  company_name: "Company Name",
  full_name: "Name",
  your_mobile_number: "Mobile Number",
  email: "Email",
  city: "City",
  "whats_is_your_requirement_?_write_in_brief": "Query",
  followUpDate: "Followup",
  disposition: "Disposition",
  remarks: "Remarks",
  adType: "Ad Type",
  phone_number: "Phone Number",
  leadId: "Lead Id",
  assignedAt: "Assigned At",
  createdAt: "Created At",
  updatedAt: "Updated At",
  subDisposition: "Sub Disposition",
  salesExecutiveName: "Executive",
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
  "Not Open": "#cca0a0",
  "No Response": "#ffc491",
  "Call Back": "#8e90c6",
  Presentation: "#87c69a",
  FollowUp: "#f8bec0",
  Prospect: "#98ff99",
  Payment: "#ffeb96",
  "Not Interested": "#f8634e",
  "Presentation NI": "#7D3C98",
  "Prospect NI": "#13856D",
  "No Contactable": "#e4e0e0",
  "Become Distributor": "#f8bea5",
  "Deal Done": "#12f628",
  Today_Followup: "#AF7AC5",
  "Presentation-Followup": "#2874A6",
  "Prospect-Followup": "#117A65",
  "Video Meet": "#f690a8",
};
