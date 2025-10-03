import { useState } from "react";
import "./Login.css";

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
            <h2>Welcome back!</h2>
            <p>Login to access your learning dashboard</p>
            <form onSubmit={handleSubmit}>
                <div className="email-group">
                    <label>Your Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="e.g: elon@tesla.com"
                    />
                </div>
                <div>
                    <label>YourPassword:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Sign in"}
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