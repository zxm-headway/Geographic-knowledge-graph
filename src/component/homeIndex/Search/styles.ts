import styled from "styled-components";

export const Center = styled.div`
  margin: 18% 25%;
  transition: margin-top 0.5s, margin-bottom 0.5s;
`;

export const Container = styled.div<{ collapsed: boolean }>`
  position:relative;
 
  
  width: 100%;
  transition: height 0.5s;
  height: ${(props) => (props.collapsed ? "64px" : "calc(85vh - 64px)")};
  background-image: url(https://images.unsplash.com/photo-1581252584837-95f73fd23574?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80);
  background-size: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  ${Center} {
    margin-top: ${(props) => (props.collapsed ? "12px" : "18%")};
    margin-bottom: ${(props) => (props.collapsed ? "12px" : "18%")};
  }
`;

export const SearchContainer = styled.div`
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.9);
  input {
    color: #fff;
  }
`;
