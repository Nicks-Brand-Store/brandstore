import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { addToast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const loggedInUser = login(email.trim(), password.trim());

    if (!loggedInUser) {
      setError('Invalid email or password. If you are new, please register first.');
      addToast('Login failed. Please try again or register if you are new.', { type: 'error' });
      return;
    }

    addToast(`Welcome back, ${loggedInUser.email}!`, { type: 'success' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p>Use <strong>admin@brandstore.com</strong> for admin or any registered customer email.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="auth-note">
          New here? <Link to="/register">Register an account</Link> first.
        </p>
      </div>
    </section>
  );
}

export default Login;
