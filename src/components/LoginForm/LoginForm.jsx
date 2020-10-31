import React, { useContext, useState } from 'react';
import bemCssModules from 'bem-css-modules';

import Modal from '../Modal/Modal';
import { StoreContext } from '../../store/StoreProvider';
import request from '../../helpers/request';

import { default as LoginFormStyles } from './LoginForm.module.scss';

const style = bemCssModules(LoginFormStyles);

const LoginForm = ({ handleOnClose, isModalOpen }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [validateMessage, setValidateMessage] = useState('');

  const { setUser } = useContext(StoreContext);

  const handleOnChangeLogin = e => setLogin(e.target.value);
  const handleOnChangePassword = e => setPassword(e.target.value);
  const handleOnCloseModal = e => {
    e.preventDefault();
    handleOnClose();
    resetStateOfInputs();
  };

  const resetStateOfInputs = () => {
    setLogin('');
    setPassword('');
    setValidateMessage('');
  }

  const handleOnSubmit = async event => {
    event.preventDefault();
    const { data, status } = await request.post(
      '/users',
      { login, password }
    );

    if (status === 200) {
      setUser(data.user);
      resetStateOfInputs();
      handleOnClose();
    } else {
      setValidateMessage(data.message);
    };
  };

  const validateMessageComponent = validateMessage.length
    ? <p className={style('validate-message')}>{validateMessage}</p>
    : null;

  return ( 
    <Modal handleOnClose={handleOnClose} isOpen={isModalOpen} shouldBeCloseOnOutsideClick={true}>
      {validateMessageComponent}
      <form className={style()} method='post' onSubmit={handleOnSubmit}>
        <div className={style('row')}>
          <label>
            Login: 
            <input type="text" value={login} onChange={handleOnChangeLogin}/>
          </label>
        </div>
        <div className={style('row')}>
          <label>
            Hasło: 
            <input type="password" value={password} onChange={handleOnChangePassword}/>
          </label>
        </div>
        <div className={style('row')}>
          <button type='submit'>Zaloguj</button>
          <button type='button' onClick={handleOnCloseModal}>Anuluj</button>
        </div>
      </form>
    </Modal>
   );
}
 
export default LoginForm;
