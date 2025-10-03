import { useState } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {

            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage("Login successful!");
            } else {
                setMessage(data.error || "Login failed. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please try again later.");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2>Welcome Back!</h2>
            <p>Login to access your learning dashboard</p>
                <form onSubmit={handleSubmit}>
                {/* Email field */}
                <div className="email-group">
                    <label>Your Email:</label>
                    <div className="input-group">
                    <FiUser className="input-icon user-icon" aria-hidden="true" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="e.g: elon@tesla.com"
                        aria-label="Email"
                    />
                    </div>
                </div>
                <div className="password-group">
                    <label>Your Password:</label>
                    <div className="input-group">
                    <FiLock className="input-icon lock-icon" aria-hidden="true" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="Password"
                    />
                    </div>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Sign In"}
                </button>
                <button
                    type="button"
                    className="signup-btn"
                    onClick={() => alert('Sign Up functionality coming soon!')}
                >
                    Sign Up
                </button>
            </form>
            {message && <div style={{ marginTop: 16 }}>{message}</div>}
        </div>
    );
}

export default Login;