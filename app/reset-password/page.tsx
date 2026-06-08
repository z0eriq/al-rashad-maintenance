import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  redirect(token ? `/admin/reset-password?token=${token}` : "/admin/reset-password");
}
