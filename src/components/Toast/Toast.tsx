import { useState, useEffect, useCallback, ReactElement, useRef } from 'react';
import styled from 'styled-components';

interface StyledToastProps {
  toastStyle: 'info' | 'danger' | 'warning' | 'success' | null | undefined;
  removing?: boolean;
  timer?: any;
  icon?: string;
}
const StyledToast = styled.div<StyledToastProps>`
  width: 500px;
  min-height: 50px;
  margin: 0 auto;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[400] : theme.COLORS.GREY[600]};
  padding: 16px;
  transition: all;
  margin-bottom: 10px;
  border-top: solid 4px
    ${({ toastStyle, theme }) => {
      switch (toastStyle) {
        case 'info':
          return theme.COLORS.INFO;
        case 'danger':
          return theme.COLORS.DANGER;
        case 'warning':
          return theme.COLORS.WARNING;
        case 'success':
          return theme.COLORS.SUCCESS;
        default:
          return theme.COLORS.GREY[300];
      }
    }};

  animation: ${(props): string =>
    !props.removing
      ? 'fadeinToast 0.5s ease-in-out'
      : 'fadeoutToast 0.5s ease-in-out'};
  @keyframes fadeinToast {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes fadeoutToast {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
`;

const StyledToastTitle = styled.div`
  font-weight: 300;
  margin-bottom: 16px;
  font-size: 1.5rem;
`;
export interface Props {
  /** The title of the toast item */
  title: string | null | undefined,
  /** The style for the toast */
  style?: 'info' | 'danger' | 'warning' | 'success' | null;
  children?: string;
  /** The icon for the toast */
  icon?: string;
  /** how long the toast should be shown in seconds */
  duration?: number;
  theme?: unknown;
}
export const Toast = ({
  title,
  style,
  children,
  icon,
  duration = 4,
  theme,
}: Props): ReactElement => {
  const [visible, setVisible] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [timer, setTimer] = useState('0');
  const [intervalFunc, setIntervalFunc] = useState(0);
  const isMounted = useRef(true);
  const startTimer = useCallback(
    countNumber => {
      let count = countNumber;
      function timer(): void {
        count--;

        let countNumber = (count / 100).toString().slice(2);
        if (countNumber.length === 1) {
          countNumber = countNumber + '0';
        }
        if (countNumber.length === 0) {
          countNumber = '0';
        }
        if (countNumber === '0') {
          if (isMounted.current) {
            setRemoving(true);
            setTimeout(() => setVisible(false), 400);
          }
        }

        if (isMounted.current) setTimer(countNumber);
      }
      const counter = setInterval(timer, duration * 10); //10 will  run it every 100th of a second

      if (count <= 0) {
        clearInterval(counter);
        return;
      }
      setIntervalFunc((counter as unknown) as number);
    },
    [duration]
  );

  useEffect(() => {
    startTimer(100);
  }, [startTimer]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  const mouseOverToast = (): void => {
    clearInterval(intervalFunc);
    const time = timer;
    setTimer(time);
  };

  const mouseOutToast = (): void => {
    startTimer(timer);
  };

  return (
    <>
      {visible && (
        <StyledToast
          timer={timer}
          onMouseOver={(): void => mouseOverToast()}
          onMouseOut={(): void => mouseOutToast()}
          removing={removing}
          icon={icon}
          toastStyle={style}
          role="alert"
        >
          {title && (
            <StyledToastTitle>{title}</StyledToastTitle>
          )}
          {children && (
            <span
              dangerouslySetInnerHTML={{
                __html: children,
              }}
            />
          )}
        </StyledToast>
      )}
    </>
  );
};
