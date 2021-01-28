import logo from '../../public/logo.svg';

import style from './style.module.scss';

const Header = () => {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logo} />
    </header>
  );
}

export default Header;
