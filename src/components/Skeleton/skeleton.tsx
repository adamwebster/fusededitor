import styled from 'styled-components';

const StyledSkeleton = styled.div`
  box-shadow: 0 4px 10px 0 rgba(33, 33, 33, 0.15);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  background-color: #383838;
  &&:before {
    content: '';
    display: block;
    position: absolute;
    left: -600px;
    top: 0;
    height: 100%;
    width: 600px;
    background: linear-gradient(
      45deg,
      transparent 0%,
      transparent 10%,
      #e8e8e8 50%,
      transparent 90%,
      transparent 100%
    );
    animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  @keyframes load {
    from {
      left: -600px;
    }
    to {
      left: 100%;
    }
  }
`;

const Skeleton = ({ ...rest }) => {
  return <StyledSkeleton {...rest} />;
};

export default Skeleton;
