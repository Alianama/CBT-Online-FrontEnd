"use client";
import Layout from "@/components/sidebar/Layout.tsx";
import { useContext } from "react";
import LangContext from "@/context/LangContext.tsx";
import ProfileComponent from "@/components/profile/profileComponent.tsx";

export default function ProfilePage() {
  const pagedata = {
    id: { name: "Profil", url: "/profile" },
    en: { name: "Profile", url: "/profile" },
  };
  const { locale } = useContext(LangContext);
  return (
    <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
      <title>Profile</title>
      <ProfileComponent />
    </Layout>
  );
}
