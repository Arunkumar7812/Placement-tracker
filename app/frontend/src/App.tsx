import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Tasks from "./pages/Tasks";
import PlacementPrep from "./pages/PlacementPrep";
import WeeklyGoals from "./pages/WeeklyGoals";

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/projects"
            element={
              <Protected>
                <Projects />
              </Protected>
            }
          />
          <Route
            path="/skills"
            element={
              <Protected>
                <Skills />
              </Protected>
            }
          />
          <Route
            path="/tasks"
            element={
              <Protected>
                <Tasks />
              </Protected>
            }
          />
          <Route
            path="/placement-prep"
            element={
              <Protected>
                <PlacementPrep />
              </Protected>
            }
          />
          <Route
            path="/weekly-goals"
            element={
              <Protected>
                <WeeklyGoals />
              </Protected>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
