import { useState } from "react"
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/session";
import { useModal } from "../../context/Modal";
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = e => {
    e.preventDefault();
    setErrors({});

    return dispatch(loginUser({ credential, password }))
      .then(closeModal)
      .catch(async res => {
        const data = await res.json();
        console.log(data)
        if (data?.message) setErrors(data);
        console.log(errors)
      });
  };

  return (
    <div className="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.message && (<p className="err">{errors.message}</p>)}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginFormModal;
