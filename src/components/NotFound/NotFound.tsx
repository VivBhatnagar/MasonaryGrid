import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist. Please go to Home Page</p>
      <Link to="/">Home Page</Link>
    </div>
  );
};

export default NotFound;
