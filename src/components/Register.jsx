import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const { addToast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = register(email.trim(), password.trim());

    if (result.error) {
      setError(result.error);
      addToast(result.error, { type: 'error' });
      return;
    }

    addToast('Registration successful. You are now logged in.', { type: 'success' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p>
          Use <strong>@brandstore.com</strong> for an admin account, or any other email for a customer account.
        </p>

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
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary">Register</button>
        </form>
      </div>
    </section>
  );
}

export default Register;
