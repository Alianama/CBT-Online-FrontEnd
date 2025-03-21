"use client";
import Layout from "@/components/sidebar/Layout.tsx";
import { useContext } from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import ProfilPage from "@/components/profile/profil-page.tsx";

export default function ProfilePage() {
  const pagedata = {
    id: { name: "Profil", url: "/profile" },
    en: { name: "Profile", url: "/profile" },
  };
  const { locale } = useContext(LanguageContext);
  return (
    <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
      <title>Profile</title>
      <ProfilPage />
    </Layout>
  );
}
