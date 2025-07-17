import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Search from "./Components/Search/search";
import AddressDropdown from "./Components/test";
import SignupTest from "./pages/Singup";
import RoomList from "./Components/Room/RoomList";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignupTest />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home1"
          element={
            <Search setFilter={() => {}} />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/Article" element={<RoomList filter={null} />} />

      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
