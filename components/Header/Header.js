import React, {useContext} from 'react';
import './Header.scss';
// import siteLogo from '../../assets/img/logo1.png';
import HeaderButton from "../UI/HeaderButton";

import iconHome from '../../assets/icons/icon-home.svg';
import iconAdd from '../../assets/icons/icon-add.svg';
import iconStatistics from '../../assets/icons/icon-statistics.svg';
import iconProfile from '../../assets/icons/icon-profile.svg';
import iconAdmin from '../../assets/icons/icon-admin.svg';
import AuthContext from "../../Store/auth-context";
import iconLogin from "../../assets/icons/icon-login.svg";
import iconRegister from "../../assets/icons/icon-register.svg";
import iconLogout from "../../assets/icons/icon-logout.svg";

const Header = (props) => {
    const ctx = useContext(AuthContext);

    return (
        <header className={`top-bar${ctx.userDetails.isLogged ? ' is-logged' : '' }`}>
            <div className="site-logo">
                {/*<a href="/">*/}
                {/*    <img src={siteLogo} alt='Site Logo'/>*/}
                {/*</a>*/}
            </div>

            <div className="toolbar">
                <HeaderButton
                    clickAction={props.setHomepage}
                    text='Home'
                    imageUrl={iconHome}
                    imageAlt='Home Page'
                />
                {ctx.userDetails.isLogged && (
                    <React.Fragment>
                        <HeaderButton
                            clickAction={props.setNewExpense}
                            customClass='teal-icon'
                            text='New Expense'
                            imageUrl={iconAdd}
                            imageAlt='New Expense'
                        />
                        <HeaderButton
                            text='Statistics'
                            imageUrl={iconStatistics}
                            imageAlt='Statistics'
                            onClick=''
                        />
                        <HeaderButton
                            text='Profile'
                            imageUrl={iconProfile}
                            imageAlt='Profile'
                            onClick=''
                        />
                    </React.Fragment>
                )}
                <div className="test">
                    {ctx.userDetails.isAdmin && (
                        <HeaderButton
                            text='Admin Panel'
                            imageUrl={iconAdmin}
                            imageAlt='Admin Panel'
                            onClick=''
                        />
                    )}
                </div>
            </div>
            <div className={`login${ctx.userDetails.isLogged ? ' is-logged' : ''}`}>
                {!ctx.userDetails.isLogged && (
                    <React.Fragment>
                        <HeaderButton
                            customClass='smaller-icon teal-icon'
                            text='Login'
                            imageUrl={iconLogin}
                            imageAlt='Login'
                            clickAction={ctx.showLogin}
                        />
                        <HeaderButton
                            customClass='smaller-icon'
                            text='Register'
                            imageUrl={iconRegister}
                            imageAlt='Register'
                            clickAction={ctx.showRegister}
                        />
                    </React.Fragment>
                )}
                {ctx.userDetails.isLogged && (
                    <HeaderButton
                        customClass='smaller-icon orange-icon'
                        text='Logout'
                        imageUrl={iconLogout}
                        imageAlt='Logout'
                        clickAction={ctx.onLogout}
                    />
                )}
            </div>
        </header>
    );
}

export default Header;