import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

// /market 접속 시 /market/supplies로 리다이렉트
export default async function MarketPage() {
    const locale = await getLocale();
    redirect(`/${locale}/market/supplies`);
}
