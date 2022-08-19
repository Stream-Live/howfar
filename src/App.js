/*
 * @Author: Wjh
 * @Date: 2022-07-26 09:30:34
 * @LastEditors: Wjh
 * @LastEditTime: 2022-08-17 09:54:15
 * @FilePath: \howfar\src\App.js
 * @Description: 
 * 
 */

import { HashRouter as Router,Route, Switch} from 'react-router-dom'
import MainPage from './MainPage/MainPage';
import EditPage from './MainPage/EditPage';
import ShaderStudy from './MainPage/ShaderStudy';

function App() {
  
  return (
    <Router>
        {/* react是包容性路由,引入Switch标签，把路由变成排他性的 */}
      <Switch>
        <Route exact path="/" component={MainPage}/>
        <Route exact path="/EditPage" component={EditPage}/>
        <Route exact path="/ShaderStudy" component={ShaderStudy}/>
      </Switch>
    </Router>
  );
}

export default App;
