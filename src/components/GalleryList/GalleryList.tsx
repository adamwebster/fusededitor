import { useContext, useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  StyledGalleryHeading,
  StyledSkeleton,
  StyledGalleryList,
} from './styles';
import GalleryItem from './GalleryItem';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledDocumentMobileItems } from '../DocumentList/styles';
import { SiteContext } from '../../context/site';

const GalleryList = () => {
  const [galleries, setGalleries] = useState<Array<any>>([]);
  const [galleriesLoading, setGalleriesLoading] = useState(false);
  const numberOfDocSkeletons = 5;
  const { siteState, dispatchSite } = useContext(SiteContext);

  const getGalleries = () => {
    setGalleriesLoading(true);
    useFetch('getGalleries', {}).then(resp => {
      setGalleries(resp.galleries);
      setGalleriesLoading(false);
    });
  };

  useEffect(() => {
    getGalleries();
  }, []);
  return (
    <>
      <StyledDocumentMobileItems>
        <FontAwesomeIcon
          onClick={() =>
            dispatchSite({
              type: 'SET_SHOW_MOBILE_MENU',
              payload: !siteState.showMobileMenu,
            })
          }
          icon={faBars}
        />
      </StyledDocumentMobileItems>
      <StyledGalleryList showMobileMenu={siteState.showMobileMenu}>
        {galleriesLoading ? (
          <>
            {[...Array(numberOfDocSkeletons)].map((x, i) => (
              <StyledSkeleton key={i} />
            ))}
            <StyledSkeleton />
          </>
        ) : (
          <>
            <StyledGalleryHeading>Galleries</StyledGalleryHeading>
            {galleries.length === 0 && <div>No galleries</div>}
            {galleries.map((gallery, index) => {
              return <GalleryItem gallery={gallery} key={gallery._id} />;
            })}
          </>
        )}
      </StyledGalleryList>
    </>
  );
};

export default GalleryList;
