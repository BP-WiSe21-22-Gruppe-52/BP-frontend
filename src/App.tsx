import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import { useAppSelector } from "./redux/hooks";

// Basic App that is just used to Route to different pages
function App() : JSX.Element {

  const token = useAppSelector((state) => state.token.token);

  // TODO: check token validity 

  if (!token) {
    return (
      <Login />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
