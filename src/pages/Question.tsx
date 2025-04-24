// import Layout from "@/components/sidebar/Layout.tsx";
// import { useContext } from "react";
// import LanguageContext from "@/context/LanguageContext.tsx";
// // import Question from "@/components/exam/QuestionPage.tsx"
import Question from "@/components/exam/questionComponent/index.tsx"
// type Locale = "id" | "en";
//
// type PageInfo = {
//   name: string;
//   url: string;
// };
//
// const pageMeta: Record<Locale, PageInfo[]> = {
//   id: [
//     { name: "Jadwal Ujian", url: "/exam" },
//     { name: "Ujian", url: "/#" },
//   ],
//   en: [
//     { name: "Exam Schedule", url: "/exam" },
//     { name: "Exam", url: "/#" },
//   ],
// };

export default function QuestionPage() {
  // const { locale } = useContext(LanguageContext);
  // const pages = pageMeta[(locale as Locale) || "id"];

  return (
    // <Layout data={pages}>
      <Question />
    // </Layout>
  );
}
