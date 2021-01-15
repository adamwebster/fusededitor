import styled from 'styled-components';
import { TextInput } from '../TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePopper } from 'react-popper';

import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faCog,
  faPauseCircle,
  faPlayCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
const StyledFullScreenModal = styled.div`
  width: 100vw;
  height: 100%;
  left: 0;
  top: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-flow: column;
`;

const StyledFullScreenModalImage = styled.div`
  height: calc(100% - 56px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-height: 100%;
    max-width: 100%;
  }
`;

const StyledFullScreenModalTools = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  svg {
    margin: 0 8px;
  }
`;

const StyledPopper = styled.span`
  background-color: ${({ theme }) =>
    theme.name === 'dark' ? theme.COLORS.GREY[450] : theme.COLORS.GREY[500]};
  padding: 16px;
`;

const StyledLabel = styled.label`
  width: 100%;
  display: block;
  margin-bottom: 8px;
`;

interface Props {
  imageModal: any;
  onCloseClick: () => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}
const FullScreenImageModal = ({
  imageModal,
  onCloseClick,
  onPreviousClick,
  onNextClick,
}: Props) => {
  const [slideshowSettings, setSlideshowSettings] = useState({
    speed: { inputValue: 1, value: 1000 },
  });
  const [showSlideshowSettings, setShowSlideshowSettings] = useState(false);
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);

  const [popperElement, setPopperElement] = useState<HTMLSpanElement>(
    (null as unknown) as HTMLSpanElement
  );
  const [arrowElement, setArrowElement] = useState(null);
  const [referenceElement, setReferenceElement] = useState<HTMLSpanElement>(
    (null as unknown) as HTMLSpanElement
  );
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      { name: 'offset', options: { offset: [0, 18] } },
    ],
  });

  const handleKeydownSlideshow = (e: any) => {
    const { keyCode } = e;
    switch (keyCode) {
      case 39:
        // Right arrow
        e.preventDefault();
        onNextClick();
        break;
      case 37:
        // Left arrow
        e.preventDefault();
        onPreviousClick();
        break;
      case 32:
        // Space
        e.preventDefault();
        setSlideshowPlaying(!slideshowPlaying);
        break;
      case 27:
        // Escape
        e.preventDefault();
        setShowSlideshowSettings(false);
        setSlideshowPlaying(false);
        onCloseClick();
        break;
      default:
        return false;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (slideshowPlaying) {
        onNextClick();
      }
    }, slideshowSettings.speed.value);
    window.addEventListener('keydown', handleKeydownSlideshow);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeydownSlideshow);
    };
  }, [slideshowPlaying, imageModal, slideshowSettings]);

  return (
    <StyledFullScreenModal>
      <StyledFullScreenModalImage>
        <img src={imageModal.selectedImage} />
      </StyledFullScreenModalImage>
      <StyledFullScreenModalTools>
        <div>
          <FontAwesomeIcon
            icon={faTimesCircle}
            onClick={() => {
              onCloseClick();
              setSlideshowPlaying(false);
            }}
          />
          {!slideshowPlaying && (
            <>
              <FontAwesomeIcon
                icon={faArrowAltCircleLeft}
                onClick={() => onPreviousClick()}
              />
              <FontAwesomeIcon
                icon={faArrowAltCircleRight}
                onClick={() => onNextClick()}
              />
            </>
          )}
          <FontAwesomeIcon
            icon={slideshowPlaying ? faPauseCircle : faPlayCircle}
            onClick={() =>
              slideshowPlaying
                ? setSlideshowPlaying(false)
                : setSlideshowPlaying(true)
            }
          />
          {showSlideshowSettings && (
            <StyledPopper
              ref={(ref: HTMLSpanElement) => setPopperElement(ref)}
              style={styles.popper}
              {...attributes.popper}
            >
              <StyledLabel htmlFor="slideShowSpeed">
                Slide show speed in seconds
              </StyledLabel>
              <TextInput
                id="slideShowSpeed"
                type="number"
                min="1"
                style={{ width: '100%' }}
                value={slideshowSettings.speed.inputValue}
                onChange={(e: { target: { value: number } }) => {
                  if (
                    e.target.value.toString() === '' ||
                    e.target.value.toString() === '0'
                  ) {
                    setSlideshowSettings({
                      ...slideshowSettings,
                      speed: {
                        value: slideshowSettings.speed.value,
                        inputValue: e.target.value,
                      },
                    });
                  } else {
                    setSlideshowSettings({
                      ...slideshowSettings,
                      speed: {
                        inputValue: e.target.value,
                        value: e.target.value * 1000,
                      },
                    });
                  }
                }}
              />
            </StyledPopper>
          )}
          <span ref={(ref: HTMLSpanElement) => setReferenceElement(ref)}>
            <FontAwesomeIcon
              onClick={() => setShowSlideshowSettings(!showSlideshowSettings)}
              icon={faCog}
            />
          </span>
        </div>
      </StyledFullScreenModalTools>
    </StyledFullScreenModal>
  );
};

export default FullScreenImageModal;
