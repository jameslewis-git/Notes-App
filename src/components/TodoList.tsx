import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "./ui/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    
    setTodos([...todos, todo]);
    setNewTodo("");
    toast({
      title: "Todo added",
      description: "New todo item has been added to your list",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Todo removed",
      description: "The todo item has been removed from your list",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                {todo.text}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;