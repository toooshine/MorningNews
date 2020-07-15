import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import '../App.css';

function ScreenHome(props) {

    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const [signInEmail, setSignInEmail] = useState('');
    const [signInpPassword, setSignInpPassword] = useState('');

    const [userExists, setUserExists] = useState(false);

    const [listErrorSignIn, setListErrorSignIn] = useState([]);
    const [listErrorSignUp, setListErrorSignUp] = useState([]);

    const handleSignIn = async () => {
        const data = await fetch('sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `emailFromFront=${signInEmail}&passwordFromFront=${signInpPassword}`
        })

        const body = await data.json();
        if (body.result) {
            setUserExists(true);
            props.addToken(body.token)
        } else {
            setListErrorSignIn(body.error)
        }
    }

    const handleSignUp = async () => {
        const data = await fetch('sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `usernameFromFront=${signUpUsername}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}`
        })
        const body = await data.json();

        if (body.result) {
            setUserExists(true);
            props.addToken(body.token)
        } else {
            setListErrorSignUp(body.error)
        }
    }

    if (userExists) {
        return <Redirect to='/screensource' />
    }

    const tabErrorSignIn = listErrorSignIn.map((error, i) => {
        return (<p>{error}</p>)
    });

    const tabErrorSignUp = listErrorSignUp.map((error, i) => {
        return (<p>{error}</p>)
    });

    return (
        <div className='Login-page'>

            {/* Sign-In */}
            <div className='Sign'>
                <Input onChange={e => setSignInEmail(e.target.value)} className='Login-input' placeholder="email" />
                <Input.Password onChange={e => setSignInpPassword(e.target.value)} className='Login-input' placeholder="password" />
                {tabErrorSignIn}
                <Button onClick={() => handleSignIn()} style={{ width: '80px' }} type="primary">Sign-In</Button>
            </div>

            {/* Sign-Up */}
            <div className='Sign'>
                <Input onChange={e => setSignUpUsername(e.target.value)} className='Login-input' placeholder="username" />
                <Input onChange={e => setSignUpEmail(e.target.value)}  className='Login-input' placeholder="email" />
                <Input.Password onChange={e => setSignUpPassword(e.target.value)} className='Login-input' placeholder="password" />
                {tabErrorSignUp}
                <Button onClick={() => handleSignUp()} style={{ width: '80px' }} type="primary">Sign-up</Button>
            </div>
        </div>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        addToken: function(token) {
            dispatch({
                type: 'addToken',
                token: token
            })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(ScreenHome);
