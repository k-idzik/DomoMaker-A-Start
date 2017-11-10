const handleDomo = (e) => {
  e.preventDefault();

  $('#domoMessage').animate({width: 'hide'}, 350);
    
  if ($('#domoName').val() == '' || $('#domoAge').val() == '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
    loadDomosFromServer();
  });

  return false;
};

//Domo UI
const DomoForm = (props) => {
  return(
    <form id='domoForm' name='domoForm' onSubmit={handleDomo} action='/maker' method='POST' className='domoForm'>
      <label htmlFor='name'>Name: </label>
      <input id='domoName' type='text' name='name' placeholder='Domo Name' />
      <label htmlFor='age'>Age: </label>
      <input id='domoAge' type='text' name='age' placeholder='Domo Age' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='makeDomoSubmit' type='submit' value='Make Domo' />
    </form>
  );
};

//Determine what Domos to draw
const DomoList = function(props) {
  //No Domos
  if (props.domos.length === 0) {
    return(
      <div className='domoList'>
        <h3 className='emptyDomo'>No Domos yet</h3>
      </div>
    );
  }
  
  //Create UI for each Domo
  const domoNodes = props.domos.map(function(domo) {
    return(
      <div key={domo._id} className='domo'>
        <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
        <h3 className='domoName'>Name: {domo.name}</h3>
        <h3 className='domoAge'>Age: {domo.age}</h3>
      </div>
    );
  });
  
  //Render out the Domo UIs
  return(
    <dim className='domoList'>
      {domoNodes}
    </dim>
  );
};

//Load Domos from the server and render a DomoList
const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos} />,
      document.querySelector('#domos')
    );
  });
};

const setup = function(csrf) {
  //Render the MakeDomo UI
  ReactDOM.render(
    <DomoForm csrf={csrf} />,
    document.querySelector('#makeDomo')
  );
  
  //Render the DomoList UI
  ReactDOM.render(
    <DomoList domos={[]} />,
    document.querySelector('#domos')
  );
  
  //Load any Domos
  loadDomosFromServer();
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