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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./pages/Profile";
import NotAuthenticatedOnly from "./components/auth/NotAuthenticatedOnly";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          path="/login"
          element={
            <NotAuthenticatedOnly>
              <Login />
            </NotAuthenticatedOnly>
          }
        />
        <Route
          path="/register"
          element={
            <NotAuthenticatedOnly>
              <Register />
            </NotAuthenticatedOnly>
          }
        />
        <Route
          path="/verify-email"
          element={
            <NotAuthenticatedOnly>
              <VerifyEmail />
            </NotAuthenticatedOnly>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <NotAuthenticatedOnly>
              <ForgotPassword />
            </NotAuthenticatedOnly>
          }
        />
        <Route
          path="/reset-password"
          element={
            <NotAuthenticatedOnly>
              <ResetPassword />
            </NotAuthenticatedOnly>
          }
        />
        <Route path="/chat" element={<Chat />} />
        <Route index element={<Home />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/builder" element={<Builder />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
