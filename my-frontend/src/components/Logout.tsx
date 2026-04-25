import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";
import { Button } from "./ui/button"; // Import your new reusable button
import { LogOut } from "lucide-react"; // For a professional icon

interface LogoutProps {
  redirectPath?: string;
  variant?: "danger" | "ghost" | "outline"; // Allow flexibility
  className?: string;
}

const Logout: React.FC<LogoutProps> = ({
  redirectPath = "/login",
  variant = "danger",
  className = ""
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // 1. Clear Redux state (Token & User)
    dispatch(clearCredentials());
    
    // 2. Optional: If you use localStorage for persistence, clear it here
    // localStorage.removeItem('token');

    // 3. Redirect to login
    navigate(redirectPath);
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout} 
      className={className}
      size="sm"
    >
      <LogOut size={16} className="mr-2" />
      LOG OUT
    </Button>
  );
};

export default Logout;