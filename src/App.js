import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    const data = {
      userId: "61fac23a87c445711250f2b6",
      id: "61fac28387c445711250f2bd",
      changes: {
        subject: "sport",
        school: "morde",
      },
    };
    axios
      .delete(
        process.env.REACT_APP_SERVER +
          "/substitutes/works/61fac23a87c445711250f2b6/61fac28387c445711250f2bd"
      )
      .then((res) => console.log(res));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
