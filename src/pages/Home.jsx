import "../App.css";
import ArticleSection from "../components/ArticleSection";
import TutorialSection from "../components/TutorialSection";
import Newsletter from "../components/Newsletter";


function Home() {
  return (
    <>
      <h1>DEV@Deakin</h1>
      <ArticleSection />
      <TutorialSection />
      <Newsletter />
    </>
  );
}

export default Home;
