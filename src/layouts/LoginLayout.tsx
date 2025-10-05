
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";


export default function LoginLayout() {
  return (
    <div>
      <LoginPage />
       <Outlet />
    </div>
  )
}
