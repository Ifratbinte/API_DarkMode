import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";

type Todos = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export function App() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const fetchUrl = "https://jsonplaceholder.typicode.com/todos";

  // Dark mode
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");
  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    const abortController = new AbortController();

    fetch(fetchUrl, {
      signal: abortController.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network request failed");
        }
        return res.json();
      })
      .then((data: Todos[]) =>
        setTodos(
          data.map((todo) => {
            return { ...todo, completed: false };
          })
        )
      )
      .catch((e) => console.log(e));

    // cleanup function to prevent memory links if network request runs long
    return () => abortController.abort();
  }, [fetchUrl]);

  function handleToggleTodo(id: number) {
    setTodos((prevState) => {
      return prevState.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    });
  }

  return (
    <div className="app todos-container" data-theme={theme}>
      <div className="container">
        <h1>My Todo List</h1>
        <div className="row">
          <div className="col-md-7">
            <button className="btn btn-primary btn-theme" onClick={switchTheme}>
              {theme === "light" ? "dark" : "light"}Mode
            </button>
            {todos.map((todo) => {
              return (
                <div key={todo.id} className="todo-container">
                  <input className="todo-checkbox" type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} />
                  <p>{todo.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
