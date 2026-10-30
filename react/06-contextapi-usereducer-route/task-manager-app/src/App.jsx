import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext.jsx';
import Header from './component/Header.jsx';
import TaskListPage from './component/TaskListPage.jsx';
import TaskDetailPage from './component/TaskDetailPage.jsx';
import './App.css';

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TaskListPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;
