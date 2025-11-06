import { Routes, Route } from "react-router-dom";
import Nav from "./components/NavBar";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocialProvider } from "./contexts/SocialContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/theme.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TreeView from "./pages/TreeView";
import FamilyTree from "./pages/FamilyTree";
import Dashboard from "./pages/Dashboard";
import MemberEditor from "./pages/MemberEdit";
import Admin from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/UserManager";
import AdminTrees from "./pages/Admin/TreesManager";
import AdminReports from "./pages/Admin/Reports";
import RequireAuth from "./components/RequireAuth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocialProvider>
          <div className="app-container">
            <Nav user={user} />
            <main className="container py-4 app-main">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/tree" element={<TreeView />} />
                  <Route path="/tree/:treeId" element={<FamilyTree />} />
                  <Route path="/tree/:treeId/member/:memberId" element={<MemberEditor />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<Admin />}>
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="trees" element={<AdminTrees />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SocialProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}