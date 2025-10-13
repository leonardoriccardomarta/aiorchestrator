import React, { useState } from 'react';
import styled from 'styled-components';

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MobileNavContainer>
      <MobileNavHeader>
        <Title>AI Orchestrator</Title>
        <MenuButton onClick={toggleMenu}>
          <MenuIcon isOpen={isOpen}>
            <span></span>
            <span></span>
            <span></span>
          </MenuIcon>
        </MenuButton>
      </MobileNavHeader>

      <MobileNavMenu isOpen={isOpen}>
        <NavItem>Dashboard</NavItem>
        <NavItem>Analytics</NavItem>
        <NavItem>Marketing</NavItem>
        <NavItem>Settings</NavItem>
      </MobileNavMenu>
    </MobileNavContainer>
  );
};

const MobileNavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
`;

const MenuIcon = styled.div<{ isOpen: boolean }>`
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: #1f2937;
    transition: all 0.3s ease;
    transform-origin: center;
  }

  ${({ isOpen }) =>
    isOpen &&
    `
    span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }
    span:nth-child(2) {
      opacity: 0;
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }
  `}
`;

const MobileNavMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease;
  overflow: hidden;
`;

const NavItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  color: #1f2937;
  font-size: 1rem;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export default MobileNavigation; 