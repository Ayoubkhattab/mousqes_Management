export const queryKeys = {
  users: (params?: unknown) => ["users", params] as const,
  user: (id: unknown) => ["users", id] as const,

  branches: (params?: unknown) => ["branches", params] as const,
  branch: (id: unknown) => ["branches", id] as const,
  branchesList: () => ["branches", "list"] as const,

  districts: (params?: unknown) => ["districts", params] as const,
  district: (id: unknown) => ["districts", id] as const,

  mosques: (params?: unknown) => ["mosques", params] as const,
  mosque: (id: unknown) => ["mosques", id] as const,

  mosqueAttachments: (params?: unknown) =>
    ["mosque-attachments", params] as const,

  workers: (params?: unknown) => ["workers", params] as const,
  worker: (id: unknown) => ["workers", id] as const,

  enums: (name: string) => ["enums", name] as const,
};
