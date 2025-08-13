"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  username: z.string().min(1, "مطلوب"),
  password: z.string().min(1, "مطلوب"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await login(values.username, values.password);
  };

  return (
    <div className="min-h-screen grid place-items-center  ">
      <Card className="w-full max-w-md p-0 rounded-md shadow-md min-h-[65%]">
        <CardHeader>
          <CardTitle className="text-center bg-primary rounded-t-md py-4 text-white">
            تسجيل الدخول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-4 mt-10"
          >
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input id="username" {...register("username")} placeholder="" />
              {errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="py-4  flex justify-center ">
              <Button type="submit" className="w-[50%]" disabled={loading}>
                {loading ? "جارٍ الدخول..." : "دخول"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
