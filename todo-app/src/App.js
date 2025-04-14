import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

const getInitialTasks = () => {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
};

function App() {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [input, setInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dueDate, setDueDate] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [priority, setPriority] = useState("보통");
  const [category, setCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("전체 우선순위");
  const [filterCategory, setFilterCategory] = useState("전체 카테고리");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const formatDate = (dateStr) => {
    try {
      const parsed = parseISO(dateStr);
      return isValid(parsed) ? format(parsed, "yyyy-MM-dd HH:mm") : null;
    } catch {
      return null;
    }
  };

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = {
      id: uuidv4(),
      text: input,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      category,
      progress: 0,
    };
    setTasks([...tasks, newTask]);
    setInput("");
    setDueDate("");
    setPriority("보통");
    setCategory("");
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : 0 }
          : task
      )
    );
  };
  

  const updateProgress = (id, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              progress: value,
              completed: value === 100,
            }
          : task
      )
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const priorityValue = (p) => {
    if (p === "높음") return 3;
    if (p === "보통") return 2;
    if (p === "낮음") return 1;
    return 0;
  };

  const filteredTasks = tasks
    .filter((task) => task.text?.toLowerCase().includes(searchText.toLowerCase()))
    .filter(
      (task) =>
        (filterPriority === "전체 우선순위" || task.priority === filterPriority) &&
        (filterCategory === "전체 카테고리" || task.category === filterCategory)
    );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "priority") {
      return priorityValue(b.priority) - priorityValue(a.priority);
    }
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="App">
      <h1>📝 나의 할 일</h1>
      <button className="dark-mode-btn" onClick={toggleDarkMode}>
        {isDarkMode ? "☀️ 다크모드 해제" : "🌙 다크모드 활성화"}
      </button>

      <div className="filters">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="검색"
        />
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option>전체 우선순위</option>
          <option>높음</option>
          <option>보통</option>
          <option>낮음</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option>전체 카테고리</option>
          {[...new Set(tasks.map((t) => t.category).filter(Boolean))].map((cat) => (
  <option key={cat}>{cat}</option>
))}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="priority">우선순위순</option>
        </select>
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="높음">높음</option>
          <option value="보통">보통</option>
          <option value="낮음">낮음</option>
        </select>
        <input
          type="text"
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={addTask}>추가</button>
      </div>

      <ul className="task-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <div className="task-top">
              <span className="task-text">{task.text}</span>
              {task.dueDate && <small className="due-date">📅 {formatDate(task.dueDate)}</small>}
            </div>
            <div className="task-middle">
              <span className="timestamp">🕒 {formatDate(task.createdAt)}</span>
              {task.category && <span className="category-tag">🏷 {task.category}</span>}
              <span
                className={
                  task.priority === "높음"
                    ? "priority priority-high"
                    : task.priority === "낮음"
                    ? "priority priority-low"
                    : "priority priority-medium"
                }
              >
                🔥 {task.priority}
              </span>
            </div>
            <div className="task-bottom">
              <div className="progress-container">
                진행률:
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={task.progress}
                  onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                />
                {task.progress}%
              </div>
              <div className="task-actions">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <button onClick={() => removeTask(task.id)}>삭제</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
