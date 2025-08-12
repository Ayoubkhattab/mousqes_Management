export const endpoints = {
  // Dashboard resources
  users: "/dashboard/users",
  branches: "/dashboard/branches",

  districts: "/Districts",

  mosques: "/dashboard/mosques",
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

  workers: "/dashboard/workers",
  worker: (id: number | string) => `/dashboard/workers/${id}`,
  workerEnums: {
    jobTitles: "/dashboard/workers/enums/job-titles",
    jobStatus: "/dashboard/workers/enums/job-status",
    quranLevels: "/dashboard/workers/enums/quran-levels",
    sponsorshipTypes: "/workers/enums/sponsorship-types", // ← بدون dashboard
    educationalLevel: "workers/enums/educational-level", // ← بدون dashboard
  },
};
