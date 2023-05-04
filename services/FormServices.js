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
    }),
};

export default FormServices;
