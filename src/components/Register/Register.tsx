import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, registerWithEmailAndPassword, signInWithGoogle } from '../../app/firebase';
import s from './Register.module.scss';
import LinkBtn from '../LinkBtn/LinkBtn';
import useSetNotify from '../../hooks/useSetNotify';
import useInput from '../../hooks/useInput';

const Register = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const notify = useSetNotify(5000);

  const email = useInput('', {
    isEmpty: true,
    minLength: 3,
    reGex: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      text: `Это должен быть Электронная почта`,
    },
  });
  const password = useInput('', {
    isEmpty: true,
    minLength: 8,
    reGex: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,}$/,
      text: `по крайней мере одна буква, одна цифра, один специальный символ (@$!%*#?&)`,
    },
  });
  const name = useInput('', {
    isEmpty: true,
    minLength: 3,
  });

  const register = () => {
    if (!name) notify({ type: 'error', text: 'Please enter name' });
    registerWithEmailAndPassword(name.value || '', email.value || '', password.value || '');
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate('/app');
  }, [user, loading, navigate]);

  return (
    <div className={s.register}>
      <div className={s.error}>{error ? error.message : ''}</div>
      <input
        type="text"
        className={s.textBox}
        value={name.value}
        onChange={(e) => name.onChange(e)}
        onBlur={() => name.onBlur()}
        placeholder="Full Name"
      />
      {email.error && <div className={s.error}> {email.error} </div>}
      <input
        type="text"
        className={s.textBox}
        value={email.value}
        onChange={(e) => email.onChange(e)}
        onBlur={() => email.onBlur()}
        placeholder="E-mail Address"
      />
      {password.error && <div className={s.error}> {password.error} </div>}
      <input
        type="password"
        className={s.textBox}
        value={password.value}
        onChange={(e) => password.onChange(e)}
        onBlur={() => password.onBlur()}
        placeholder="Password"
      />
      <button
        disabled={!email.isValid || !password.isValid}
        type="button"
        className={s.registerBtn}
        onClick={register}
      >
        Register
      </button>
      <button type="button" className={s.registerGoogle} onClick={signInWithGoogle}>
        Register with Google
      </button>

      <div>
        Already have an account?
        <LinkBtn to="/auth/login" name="Login" className={s.login} />
      </div>
    </div>
  );
};

export default Register;
