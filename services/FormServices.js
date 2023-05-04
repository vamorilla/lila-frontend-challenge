import request from '.';

const FormServices = {
  save: (payload) =>
    request('/form', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('sessionToken'),
      },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(payload),
      // ToDo: Make this a POST request and send the payload in the body.
    }),
};

export default FormServices;
