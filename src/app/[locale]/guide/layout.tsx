import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "가이드 - 사육 팁 & 유전학",
    description: "초보자를 위한 크레스티드 게코 사육 꿀팁 및 유전학 백과사전.",
    openGraph: {
        title: "Crestia Guide - 사육 가이드",
        description: "초보자를 위한 크레스티드 게코 사육 꿀팁 및 유전학 백과사전.",
    },
};

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
