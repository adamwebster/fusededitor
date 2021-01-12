import { useContext, useState } from 'react';
import { SiteContext } from '../../context/site';
import { useFetch } from '../../hooks/useFetch';
import { useDrag, useDrop } from 'react-dnd';
import {
  StyledDateModified,
  StyledDocument,
  StyledDocumentItem,
} from './styles';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const DocumentItem = ({ document, documents, getDocuments, ...rest }) => {
  const { dispatchSite } = useContext(SiteContext);
  const [dragging, setDragging] = useState(false);
  const handleDrop = item => {
    if (document._id !== item.id) {
      dispatchSite({ type: 'SET_LOADING', payload: true });
      useFetch('combineDocumentsIntoFolder', {
        name: 'New folder',
        documents: [item.id, document._id],
      }).then(res => {
        if (res.status === 'saved') {
          getDocuments();
          dispatchSite({ type: 'SET_LOADING', payload: false });
        }
      });
    }
  };

  const [collectedProps, drag] = useDrag({
    item: { id: document._id, type: 'document' },
    begin: () => setDragging(true),
    end: () => {
      setDragging(false);
    },
  });
  const [{ isActive }, drop] = useDrop({
    accept: 'document',
    options: { id: document._id },
    drop: (item, monitor) => handleDrop(item),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
  });

  return (
    <StyledDocumentItem ref={drag} {...rest}>
      <div ref={drop}>
        <StyledDocument hasLink isDraggingOver={isActive} isDragging={dragging}>
          <Link href={`/editor/${document._id}`} passHref>
            <a>
              <FontAwesomeIcon icon={faFile} />
              <div>
                {document.name}
                <StyledDateModified>
                  Date Modified:{' '}
                  {dayjs(document.dateModified).format('DD/MM/YYYY')}
                </StyledDateModified>
              </div>
            </a>
          </Link>
        </StyledDocument>
      </div>
    </StyledDocumentItem>
  );
};

export default DocumentItem;
