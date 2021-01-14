import { useContext, useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import {
  StyledGalleryHeading,
  StyledDateModified,
  StyledSkeleton,
  StyledGalleryList,
} from './styles';
import GalleryItem from './GalleryItem';
import { SiteContext } from '../../context/site';

const GalleryList = () => {
  const [galleries, setGalleries] = useState<Array<any>>([]);
  const [galleriesLoading, setGalleriesLoading] = useState(false);
  const numberOfDocSkeletons = 5;

  const getGalleries = () => {
    setGalleriesLoading(true);
    useFetch('getGalleries', {}).then(resp => {
      setGalleries(resp.galleries);
      setGalleriesLoading(false);
      console.log('resp', resp);
    });
  };

  useEffect(() => {
    getGalleries();
  }, []);
  return (
    <>
      <StyledGalleryList>
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
