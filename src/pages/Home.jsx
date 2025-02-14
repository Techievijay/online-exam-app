
import { Link } from 'react-router-dom';
import { examCategories } from '../data/categories';


const categories = examCategories;
const Home = () => {
  return (
    <div className="home">
      
      <h2 className="text-xl font-bold text-blue-500">Online Exam Dashboard</h2>

      <div className="categories">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h2>{category.title}</h2>
            <p>Questions: {category.questions.length}</p>
            <p>Duration: {category.duration} minutes</p>
            <Link to={`/exam/${category.id}`} className="start-button">
              Start Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
