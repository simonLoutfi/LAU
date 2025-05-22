import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message,setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post('http://localhost:5000/login',{email,password});
            setMessage(`Success! Welcome ${res.data.message}`);
        }catch(err){
            if (err.response) {
                setMessage(`Error: ${err.response.data.message}`);
            } else {
                setMessage('Network error.');
            }
        }

    }
  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}> 
            <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
            <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            <button type='submit'>Login</button>
            {message && <p>{message}</p>}
        </form>
        
      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')}>
          Signup
        </button>
      </p>
    </div>
  );
}

export default Login;