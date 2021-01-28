import { inject, observer } from 'mobx-react';
import { FormEvent, useState } from 'react';
import Modal from 'react-modal';
import { ActionMeta, OptionsType, OptionTypeBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { FilesStore } from 'stores/Files';

import style from './style.module.scss';

Modal.setAppElement('#__next');

type Props = {
  file: UploadImage,
  filesStore?: FilesStore,
  open: boolean,
  onClose: () => unknown
}

const FileModal = ({ file, filesStore, open, onClose }: Props) => {
  // Editor values
  const [headline, setHeadline] = useState<string>(file.meta.headline);
  const [caption, setCaption] = useState<string>(file.meta.caption);
  const [tags, setTags] = useState<OptionsType<OptionTypeBase>>(file.meta.tags.map(tag => ({ value: tag, label: tag })));
  const [copyright, setCopyright] = useState<string>(file.meta.copyright);

  const { update } = filesStore;

  const onTagsChange = (value: OptionsType<OptionTypeBase>, actionMeta: ActionMeta<OptionTypeBase>) => {
    setTags(value);
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    file.meta = {
      caption,
      copyright,
      headline,
      tags: tags.map(tag => tag.value)
    };

    update(file);
    onClose();
  }

  return (
    <Modal isOpen={open} onRequestClose={onClose} contentLabel="Datei vor Upload bearbeiten">
      <h2>Datei vor Upload bearbeiten</h2>
      <form className={style.form} onSubmit={onSubmit}>
        <div className={style.row}>
          <label htmlFor="headline">Überschrift</label>
          <input type="text" name="headline" id="headline" defaultValue={file.meta.headline} onChange={e => setHeadline(e.target.value)} />
        </div>
        <div className={style.row}>
          <label htmlFor="caption">Beschriftung</label>
          <textarea name="caption" id="caption" defaultValue={file.meta.caption} onChange={e => setCaption(e.target.value)}></textarea>
        </div>
        <div className={style.row}>
          <label htmlFor="tags">Tags</label>
          <CreatableSelect isMulti onChange={onTagsChange} options={[]} value={tags} id="tags" name="tags[]" />
        </div>
        <div className={style.row}>
          <label htmlFor="copyright">Copyright</label>
          <input type="text" name="copyright" id="copyright" defaultValue={file.meta.copyright} onChange={e => setCopyright(e.target.value)} />
        </div>

        <button type="submit">Speichern</button>
      </form>
    </Modal>
  )
}

export default inject('filesStore')(observer(FileModal));
