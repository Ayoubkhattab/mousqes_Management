// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import UserForm from "@/components/users/UserForm";
// import { useCreateUser } from "@/features/users/queries";
// import type { CreateUserDto } from "@/features/users/api";

// export default function NewUserPage() {
//   const router = useRouter();
//   const createMut = useCreateUser();

//   return (
//     <div className="space-y-4">
//       <h2 className="text-lg font-semibold">Create User</h2>
//       <UserForm
//         mode="create"
//         submitLabel={createMut.isPending ? "Creating..." : "Create"}
//         onSubmitCreate={async (values) => {
//           try {
//             await createMut.mutateAsync({
//               username: values.username!,
//               password: values.password!,
//               name: values.name!,
//               role: values.role!,
//               branch_id: values.branch_id,
//             } satisfies CreateUserDto);

//             toast.success("User created");
//             router.push("/dashboard/users");
//           } catch (e: any) {
//             toast.error(e?.response?.data?.message ?? "Create failed");
//           }
//         }}
//       />
//     </div>
//   );
// }
