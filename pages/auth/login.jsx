import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLoginContext } from 'utils/auth';
import PropTypes from 'prop-types';
import Img from 'components/Img';
import Input from 'components/Input';
import Button from 'components/Button';
import imgLogo from 'public/assets/logo.png';
import styles from 'styles/Login.module.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const { login } = useLoginContext();
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleLogin = async () => {
    setSuccess(false);
    setErrorMessage('');
    const { ok, data } = await login(form);
    if (ok) {
      setSuccess(true);
      router.push('/');
    } else {
      setErrorMessage(data);
    }
  };
  return (
    <div className={styles.main}>
      <Img src={imgLogo} alt="Logo" className={styles.logo} />
      <Input
        className={styles.input}
        label="Email"
        name="email"
        value={form.email}
        handleChange={handleChange}
        size="large"
      />
      <Input
        className={styles.input}
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        handleChange={handleChange}
        size="large"
        errorMessage={errorMessage}
      />
      {success && <p className={styles.success}>Ingreso exitoso</p>}
      <Button
        className={styles.button}
        disabled={Object.values(form).some((val) => val === '')}
        label="Iniciar sesión"
        handleClick={handleLogin}
        size="medium"
      />
    </div>
  );
};

Login.propTypes = {
  handleChange: PropTypes.func,
  handleLogin: PropTypes.func,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  success: PropTypes.bool,
};

export default Login;
