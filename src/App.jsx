import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import { getRegisteredAccounts } from "./services/storage";

function hasRegisteredSession() {
  try {
    const raw = localStorage.getItem("mindrush-user");
    if (!raw) return false;
    const user = JSON.parse(raw);
    const email = String(user?.email || "")
      .trim()
      .toLowerCase();
    return Boolean(
      email &&
      getRegisteredAccounts().some((account) => account.email === email),
    );
  } catch {
    return false;
  }
}
function RequireAuth({ children }) {
  const location = useLocation();
  if (!hasRegisteredSession())
    return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
function PublicOnly({ children }) {
  return hasRegisteredSession() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Signup />
            </PublicOnly>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/categories"
          element={
            <RequireAuth>
              <Categories />
            </RequireAuth>
          }
        />
        <Route
          path="/quiz/:category"
          element={
            <RequireAuth>
              <Quiz />
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        /> */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
