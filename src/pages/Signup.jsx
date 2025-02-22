import './Signup.module.css';

const Signup = () => (
  <div className='signup-container'>
    <h2>Signup</h2>
    <input type='text' placeholder='Name' />
    <input type='email' placeholder='Email' />
    <input type='password' placeholder='Password' />
    <button>Signup</button>
  </div>
);

export default Signup;
