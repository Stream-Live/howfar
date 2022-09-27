/*
 * @Author: Wjh
 * @Date: 2022-07-26 09:30:34
 * @LastEditors: Wjh
 * @LastEditTime: 2022-09-26 13:13:34
 * @FilePath: \howfar\src\App.js
 * @Description: 
 * 
 */

import { HashRouter as Router,Route, Switch} from 'react-router-dom'
import MainPage from './MainPage/MainPage';
import EditPage from './MainPage/EditPage';
import ShaderStudy from './MainPage/ShaderStudy';
import ShaderStudy2 from './MainPage/ShaderStudy2';

function App() {
  
  return (
    <Router>
        {/* react是包容性路由,引入Switch标签，把路由变成排他性的 */}
      <Switch>
        <Route exact path="/" component={MainPage}/>
        <Route exact path="/EditPage" component={EditPage}/>
        <Route exact path="/ShaderStudy" component={ShaderStudy}/>
        <Route exact path="/ShaderStudy2" component={ShaderStudy2}/>
      </Switch>
    </Router>
  );
}

export default App;
