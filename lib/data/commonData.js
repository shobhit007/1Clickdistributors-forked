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
    hierarchy: [
      "assistantManager",
      "GM/AVP",
      "VP",
      "director",
      "manager",
      "teamLead",
      "member",
    ],
  },
  {
    department: "service",
    hierarchy: ["CRMhead"],
  },
];

export const panels = [
  {
    panel: "dashboard",
  },
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

export const salesPanelColumns = [
  "created_time",
  "city",
  "source",
  "whats_is_your_requirement_?_write_in_brief",
  "adType",
  "full_name",
  "looking_for",
  "company_name",
  "your_mobile_number",
  "phone_number",
  "email",
  "leadId",
  "assignedAt",
  "createdAt",
  "updatedAt",
  "disposition",
  "subDisposition",
  "FollowUpDate",
];
