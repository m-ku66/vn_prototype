import ReactDOM from "react-dom/client";
import TestComponent from "./components/TestComponent";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TestComponent />);

console.log(process.env.NODE_ENV);
