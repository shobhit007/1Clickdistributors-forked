export const roles = [
  "superAdmin",
  "businessAdmin",
  "salesMember",
  "salesManager",
  "accountsManager",
];

export const panels = [
  {
    panel: "roles_and_permissions",
  },
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
];



export const stages = ["DNP", "Cold Lead", "Warm Lead", "Hot Lead"];
