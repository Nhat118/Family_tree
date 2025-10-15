import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../services/userService";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function load() {
      const u = await fetchUsers();
      setUsers(u);
    }
    load();
  }, []);
  return (
    <div className="container py-4">
      <div className="page-card">
        <h3 className="h5">Quản lý người dùng</h3>
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tên</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge bg-secondary text-uppercase">{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
