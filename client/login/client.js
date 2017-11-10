const handleLogin = (e) => {
  e.preventDefault();
    
  $('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError('RAWR! Username or password is empty');
    return false;
  }
    
  console.log($('input[name=_csrf]').val());
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
    
  $('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }
    
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('RAWR! Passwords do not match');
    return false;
  }
  
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  
  return false;
};

//React/JSX
//Login UI
const LoginWindow = (props) => {
  return(
    <form id='loginForm' name='loginForm' onSubmit={handleLogin} action='/login' method='POST' className='mainForm'>
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username' />
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign in' />
    </form>
  );
};

//Signup UI
const SignupWindow = (props) => {
  return(
    <form id='signupForm' name='signupForm' onSubmit={handleSignup} action='/signup' method='POST' className='mainForm'>
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username' />
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password' />
      <label htmlFor='pass2'>Password: </label>
      <input id='pass2' type='password' name='pass2' placeholder='retype password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign up' />
    </form>
  );
};

//Login rendering
const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#content') //Render target
  );
};

//Signup rendering
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />, //UI element to be created
    document.querySelector('#content') //Render target
  );
};

//Button events
const setup = (csrf) => {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');
    
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
    
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
    
  createLoginWindow(csrf); //Render the login window by default
};

//Get the csrf token from the server
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

//Get the token when the page loads
$(document).ready(function() {
    getToken();
});