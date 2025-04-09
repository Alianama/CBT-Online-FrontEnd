import Layout from "@/components/sidebar/Layout.tsx";
// import Question from "@/components/exam/Question.tsx";
import ExamList from "@/components/exam/ExamList.tsx";

const pagedata = {
    name: "Ujian",
    url: "/ujian",
};
export default function Exam() {
    return (
        <Layout data={[pagedata]}>
            {/*<Question />*/}
            <ExamList/>
        </Layout>
    );
}
