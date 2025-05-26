import React, { useEffect, useState } from 'react'; // Ensure useState and useEffect are imported
import './App.css';
import { supabase } from './supabaseClient'; // Ensure supabase client is imported

function App() {
  // --- STATE DECLARATIONS ---
  const [todos, setTodos] = useState([]); // State to hold our todo items
  const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State to handle errors
  const [newTask, setNewTask] = useState(''); // State for the new todo input field
  // --- END STATE DECLARATIONS ---

  // --- EFFECT HOOK FOR FETCHING TODOS ---
  useEffect(() => {
    async function getTodos() {
      try {
        setLoading(true); // Set loading to true before fetching
        setError(null); // Clear any previous errors

        // Select all columns from the 'todos' table, ordered by 'created_at' in ascending order
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: true }); // Order by creation time
          console.log('Got some todos');
        if (error) {
          throw error; // Throw error to be caught by the catch block
        }

        setTodos(data); // Set the fetched data to our todos state
      } catch (error) {
        console.error('Error fetching todos:', error.message);
        setError(error.message); // Set error state
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or error)
      }
    }

    getTodos(); // Call the async function
  }, []); // The empty array ensures this effect runs only once on mount
  // --- END EFFECT HOOK ---

  // ... (keep the useState and useEffect hooks from above)

async function addTodo() {
  if (!newTask.trim()) { // Prevent adding empty todos
    alert('Todo task cannot be empty!');
    return;
  }
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        { task: newTask } // Insert a new row with the task text
      ])
      .select(); // Request the newly inserted data back

    if (error) {
      throw error;
    }

    // Add the new todo to our local state
    // Supabase returns an array for 'insert', so we take the first item
    setTodos((prevTodos) => [...prevTodos, data[0]]);
    setNewTask(''); // Clear the input field after adding
  } catch (error) {
    console.error('Error adding todo:', error.message);
    setError(error.message); // Set error state
    alert('Failed to add todo: ' + error.message); // Alert user to the error
  }
}

// ... (after your addTodo function)

async function toggleTodoComplete(id, currentIsComplete) {
  try {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !currentIsComplete }) // Toggle the boolean value
      .eq('id', id); // Identify the specific row to update by its ID

    if (error) {
      throw error;
    }

    // Optimistically update the UI: find the todo and flip its is_complete status
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, is_complete: !currentIsComplete } : todo
      )
    );
  } catch (error) {
    console.error('Error toggling todo:', error.message);
    setError(error.message);
    alert('Failed to update todo: ' + error.message);
  }
}

async function deleteTodo(id) {
  try {
    const { error } = await supabase
      .from('todos')
      .delete() // Use the delete method
      .eq('id', id); // Identify the specific row to delete by its ID

    if (error) {
      throw error;
    }

    // Optimistically update the UI: remove the deleted todo from our local state
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    setError(error.message);
    alert('Failed to delete todo: ' + error.message);
  }
}

// ... rest of your App component (return statement)
  // --- JSX (RETURN STATEMENT) ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Todo App</h1>
      </header>
      <main>
        <div className="add-todo-section" style={{padding: '10px 10px 10px 0px'}}>
          <input
            type="text"
            size="30"
            placeholder="Type a new todo..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)} // Update newTask state as user types
            onKeyPress={(e) => e.key === 'Enter' && addTodo()} // Allow adding with Enter key
          />
          &nbsp; &nbsp;<button onClick={addTodo}>Add Todo</button>
        </div>

        {loading && <p>Loading todos...</p>} {/* Show loading message */}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* Show error message */}

        {/* This is the block that was commented out, now it's active! */}
        {!loading && !error && (
          <div className="todo-list">
            {todos.length === 0 ? (
              <p>No todos yet! Add one above.</p> // Message if no todos
            ) : (
             <table border="1" bordercolor="black">
              
                {todos.map((todo) => (
                  <tr key={todo.id} style={{ textDecoration: todo.is_complete ? 'line-through' : 'none' }}>
                    <td>
                      <input
                      type="checkbox"
                      checked={todo.is_complete}
                      onChange={() => toggleTodoComplete(todo.id, todo.is_complete)}
                    />
                    </td>
                    <td style={{padding: '0px 50px 0px 10px'}}>                      
                    {todo.task}
                    </td>
                    <td style={{padding: '10px 10px 10px 0px'}}>

                    <button
                      onClick={() => deleteTodo(todo.id)}
                      style={{ marginLeft: '10px', background: 'lightgrey', color: 'black', border: 'none', padding: '5px', cursor: 'pointer', aligh: 'right'}}
                    >
                      Delete
                    </button>
                  </td></tr>
                ))}
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
  // --- END JSX (RETURN STATEMENT) ---
}

export default App;