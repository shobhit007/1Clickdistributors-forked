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

export const panels = [
  {
    panel: "allocate_leads",
  },
  {
    panel: "sales_panel",
  },
  {
    panel: "HRMS",
  },
  {
    panel: "accounts",
  },
  {
    panel: "manage_users",
  },
];

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
};
