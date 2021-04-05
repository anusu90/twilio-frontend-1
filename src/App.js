import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'



//importing components
import Dashboard from "./components/dashboard/dashboard"
import CreateRoom from "./components/createroom/createroom"
import JoinRoom from "./components/joinroom/joinroom"


//import context
import { AppContextProvider } from "./components/context/context"


function App() {
  return (
    <AppContextProvider>
      <Router>
        <Switch>
          <Route path="/createroom" component={CreateRoom} />
          <Route path="/joinroom" component={JoinRoom} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </Router>
    </AppContextProvider>
  );
}

export default App;
