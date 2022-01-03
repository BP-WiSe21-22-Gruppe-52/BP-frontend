import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import api from "./util/api";
import Helper from "./util/helper";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import CreateUser from "./pages/createUser";
import AutoLogin from "./pages/autoLogin";
import Settings from "./pages/settings";
import EditPlan from "./pages/manage/editPlan";
import ManagePlans from "./pages/manage/plans";
import Exercises from "./pages/exercises";
import Leaderboard from "./pages/leaderboard";

// Basic App that is just used to Route to different pages
function App(): JSX.Element {
  const token = useAppSelector((state) => state.token.token);
  const refreshToken = useAppSelector((state) => state.token.refreshToken);

  useEffect(() => {
    api.setToken(token || "");
    api.setRefreshToken(refreshToken || "");
  }, [refreshToken, token]);

  const useQuery = new URLSearchParams(useLocation().search);
  const new_user_token = useQuery.get("new_user_token");

  // It is probably enough to just pass the token to Register directly as a prop

  if (new_user_token) {
    return <Register registerToken={new_user_token} />;
  }

  if (
    !Helper.isRefreshTokenValid(refreshToken) &&
    !Helper.isSessionTokenValid(token)
  ) {
    return <Login />;
  }

  if (!Helper.isSessionTokenValid(token)) {
    return <AutoLogin />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/createuser" element={<CreateUser />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/manage">
        {/* TODO: route to 404 maybe? */}
        <Route path="plans" element={<ManagePlans />} />
        <Route path="plans/:planId" element={<EditPlan />} />
        <Route path="user" element={<>not yet implemented</>} />
      </Route>
      <Route
        path="*"
        element={
          <div style={{ fontSize: 180, textAlign: "center" }}> 404 </div>
        }
      />
    </Routes>
  );
}

export default App;
