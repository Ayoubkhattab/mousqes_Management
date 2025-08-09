export const endpoints = {
  // Dashboard resources
  users: "/dashboard/users",
  branches: "/dashboard/branches",

  districts: "/Districts",

  mosques: "/Mosques",
  mosquesEnums: {
    base: "/Mosques/enums",
    currentStatus: "/Mosques/enums/current-status",
    category: "/Mosques/enums/category",
    technicalStatus: "/Mosques/enums/technical-status",
    type: "/Mosques/enums/type",
    demolitionPercentage: "/Mosques/enums/demolition-percentage",
    destructionStatus: "/Mosques/enums/destruction-status",
  },

  mosqueAttachments: "/mosque-attachments",

  workers: "/Workers",
  workersEnums: {
    base: "/Workers/enums",
    jobTitle: "/Workers/enums/job-title",
    jobStatus: "/Workers/enums/job-status",
    quranLevels: "/Workers/enums/quran-levels",
    sponsorshipTypes: "/Workers/enums/sponsorship-types",
    educationalLevel: "/Workers/enums/educational-level",
    rolesEnum: "/Workers/roles-enum",
  },
};
