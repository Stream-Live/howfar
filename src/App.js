
import { HashRouter as Router,Route, Switch} from 'react-router-dom'
import MainPage from './MainPage/MainPage';
import EditPage from './MainPage/EditPage';

function App() {
  
  return (
    <Router>
        {/* react是包容性路由,引入Switch标签，把路由变成排他性的 */}
      <Switch>
        <Route exact path="/" component={MainPage}/>
        <Route exact path="/EditPage" component={EditPage}/>
      </Switch>
    </Router>
  );
}

export default App;
