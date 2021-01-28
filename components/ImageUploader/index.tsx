import exifr from 'exifr';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, DragEvent, MouseEvent, useRef, useState } from 'react';

import { FilesStore } from 'stores/Files';

import Grid from './Grid';

import style from './style.module.scss';

type Props = {
  filesStore?: FilesStore
}

const ImageUploader = ({ filesStore }: Props) => {
  const inputRef = useRef<HTMLInputElement>();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const { files } = e.dataTransfer;
    if (files.length) handleFiles(Array.from(files) as UploadImage[]);
  };

  const onDropzoneClick = (e: MouseEvent<HTMLInputElement>) => {
    inputRef.current.click();
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files.length) handleFiles(Array.from(files) as UploadImage[]);
  }

  const handleFiles = async (files: UploadImage[]) => {
    const { length } = files;

    for(let i = 0; i < length; i += 1) {
      if (validateFile(files[i])) {
        const iptc: IPTC = await exifr.parse(files[i], { iptc: true });
        files[i].invalid = false;
        files[i].source = await getFileUrl(files[i]);
        files[i].meta = {
          caption: iptc.Caption || '',
          copyright: iptc.CopyrightNotice || '',
          headline: iptc.Headline || '',
          tags: iptc.Keywords || []
        };
        filesStore.add(files[i]);
      } else {
        files[i].invalid = true;
        filesStore.add(files[i]);
        setErrorMessage('File type not permitted');
      }
    }
  }

  const getFileUrl = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result.toString());
      }

      reader.readAsDataURL(file);
    });
  }

  const validateFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) return false;
    return true;
  }

  return <>
    <div className={style.container}>
      <input type="file" multiple className={style.input} ref={inputRef} onChange={onInputChange} />
      <div className={style.dropContainer} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onDropzoneClick}>
        <div className={style.dropMessage}>
          <div className={style.uploadIcon} />
          Drag & Drop file(s) here or click to upload
        </div>
      </div>

      <Grid />
    </div>
  </>;
}

export default inject('filesStore')(observer(ImageUploader));
