import { Routes, Route } from "react-router-dom";
import Layout from "./components/navigation/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Contact from "./pages/Contact";
import About from "./pages/About";
import CheckOut from "./pages/CheckOut";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route index element={<Home />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
