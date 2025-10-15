import { Routes, Route } from "react-router-dom"; // chỉ cần Routes, Route
import Nav from "./components/NavBar";
import { useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TreeView from "./pages/TreeView";
import FamilyTree from "./pages/FamilyTree";
import Dashboard from "./pages/Dashboard";
import MemberEditor from "./pages/MemberEdit";
import Admin from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/UserManager";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Nav user={user} />
      <main className="container py-4 app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tree" element={<TreeView />} />
          <Route path="/tree/:treeId" element={<FamilyTree />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/member/edit"
            element={
              <RequireAuth>
                <MemberEditor />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth role="admin">
                <AdminUsers />
              </RequireAuth>
            }
          />

          <Route path="*" element={<div className="p-3">Trang không tìm thấy</div>} />
        </Routes>
      </main>
    </div>
  );
}
