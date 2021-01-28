import { inject, observer } from 'mobx-react';

import { FilesStore } from 'stores/Files';

import style from './style.module.scss';

type Props = {
  filesStore?: FilesStore;
}

const Toolbar = ({ filesStore }: Props) => {
  const { multipleSelection, setMultipleSelection } = filesStore;

  return (
    <div className={style.toolbar}>
      { !multipleSelection && <>
        <button onClick={() => setMultipleSelection(true)}>Mehrfachauswahl</button>
      </> }
      { multipleSelection && <>
        <button onClick={() => setMultipleSelection(false)}>Abbrechen</button>
      </> }
    </div>
  )
};

export default inject('filesStore')(observer(Toolbar));
