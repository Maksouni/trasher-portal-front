import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.scss";

interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, username: "admin", password: "admin", role: "admin" },
  { id: 2, username: "user1", password: "admin", role: "user" },
  { id: 3, username: "user2", password: "admin", role: "user" },
];

// const roles = ["user", "admin"];

const UserManagement = () => {
  // const [users, setUsers] = useState<User[]>(mockUsers);
  const users = mockUsers;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleEdit = (userId: number) => {
    navigate(`edit/${userId}`);
  };

  return (
    <div className="user-management-page">
      {/* удалить потмо */}
      <nav>
        <Link
          style={{
            position: "fixed",
            top: 2,
            left: 8,
          }}
          to="/"
        >
          На главную
        </Link>
      </nav>
      <div className="container">
        <div className="users-page">
          <h1>Управление пользователями</h1>
          <div className="search-wrapper">
            <input
              type="email"
              id="email"
              value={searchQuery}
              placeholder="Поиск пользователей"
              maxLength={50}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button">Найти</button>
            <Link to="add">Добавить</Link>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя пользователя</th>
                <th>Роль</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user.id)}>
                      Изменить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
