import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';

import { FilesStore } from 'stores/Files';

import Modal from './Modal';

import style from './style.module.scss';

type Props = {
  filesStore?: FilesStore,
  file: UploadImage
}

const File = ({ file, filesStore }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const { isSelected, multipleSelection, toggleSelection } = filesStore;
  
  const classNames = classnames(style.file, {
    [style.selected]: isSelected(file)
  });

  const onClick = () => {
    if (multipleSelection === true) toggleSelection(file);
    else setModalOpen(true);
  }

  const closeModal = () => setModalOpen(false);

  return (
    <>
      <div className={classNames} style={{ backgroundImage: `url(${file.source})` }} onClick={onClick}>
        <div className={style.fileInfo}>
          <p>Name: { file.name }</p>
          <p>Dateigröße: { prettyBytes(file.size, { locale: 'de' }) }</p>
        </div>
      </div>

      <Modal file={file} open={modalOpen} onClose={closeModal} />
    </>
  );
};

export default inject('filesStore')(observer(File));
