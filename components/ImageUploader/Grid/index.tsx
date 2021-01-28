import { inject, observer } from 'mobx-react';
import { useState } from 'react';

import { FilesStore } from 'stores/Files';

import File from './File';
import Toolbar from './Toolbar';

import style from './style.module.scss';

interface Props {
  filesStore?: FilesStore
}

const Grid = ({ filesStore }: Props) => {
  const { files } = filesStore;

  return (
    <>
      <Toolbar />
      <div className={style.grid}>
        { files.map(file => <File key={file.name} file={file} />) }
      </div>
    </>
  );
}

export default inject('filesStore')(observer(Grid));
