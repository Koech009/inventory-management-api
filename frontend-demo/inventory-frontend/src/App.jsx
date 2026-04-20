import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Inventory Management System</h1>
      <p>Welcome to the Inventory Management System frontend</p>
    </div>
  );
}

export default App;
