import React from 'react';
import { Menu, Container } from 'semantic-ui-react';

const Navigation = ({ isLoggedIn, onLoginClick, onSignupClick, onLogout }) => {
  return (
    <Menu fixed="top" inverted color="blue" size="large">
      <Container>
        <Menu.Item header>Trivia Master</Menu.Item>
        <Menu.Item 
          onClick={() => window.location.href = '/'}
        >
          Home
        </Menu.Item>

        <Menu.Menu position="right">
          {isLoggedIn ? (
            <Menu.Item
              onClick={onLogout}
            >
              Logout
            </Menu.Item>
          ) : (
            <>
              <Menu.Item
                onClick={onLoginClick}
              >
                Login
              </Menu.Item>
              <Menu.Item
                onClick={onSignupClick}
              >
                Sign Up
              </Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default Navigation;