import { StyledDateModified, StyledGallery, StyledGalleryItem } from './styles';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

interface Props {
  gallery?: any;
  galleries?: any;
  getGalleries?: any;
}
const GalleryItem = ({ gallery, galleries, getGalleries, ...rest }: Props) => {
  return (
    <StyledGalleryItem {...rest}>
      <div>
        <StyledGallery hasLink>
          <Link href={`/gallery/${gallery._id}`} passHref>
            <a>
              <FontAwesomeIcon icon={faImages} />
              <div>
                {gallery.name}
                <StyledDateModified>
                  Date Modified:{' '}
                  {dayjs(gallery.dateModified).format('DD/MM/YYYY')}
                </StyledDateModified>
              </div>
            </a>
          </Link>
        </StyledGallery>
      </div>
    </StyledGalleryItem>
  );
};

export default GalleryItem;
