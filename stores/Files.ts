import { makeAutoObservable } from 'mobx';
import { enableStaticRendering } from 'mobx-react';

const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

type SerializedStore = {
  files: UploadImage[],
  selected: UploadImage[],
  multipleSelection: boolean
}

export class FilesStore {
  files: UploadImage[];
  selected: UploadImage[];
  multipleSelection: boolean;

  constructor() {
    makeAutoObservable(this);
  }

  hydrate(serializedStore: SerializedStore) {
    this.files = serializedStore.files != null ? serializedStore.files : [];
    this.selected = serializedStore.selected != null ? serializedStore.selected : [];
  }

  private getIndex(file: UploadImage) {
    const { length } = this.files;

    for (let i = 0; i < length; i += 1) {
      if (file.name === this.files[i].name) return i;
    }

    return NaN;
  }

  add = (file: UploadImage) => {
    this.files.push(file);
  }

  remove = (file: UploadImage) => {
    const index = this.getIndex(file);

    if (!isNaN(index)) {
      this.files.splice(index, 1);
    }
  }

  update = (file: UploadImage) => {
    const index = this.getIndex(file);

    if (!isNaN(index)) {
      this.files.splice(index, 1, file);
    }
  }

  /** Selected files **/

  isSelected = (file: UploadImage) => {
    const { length } = this.selected;

    for (let i = 0; i < length; i += 1) {
      if (this.selected[i].name === file.name) return true;
    }

    return false;
  }

  select = (file: UploadImage) => {
    if (!this.isSelected(file)) this.selected.push(file);
  }

  unselect = (file: UploadImage) => {
    const { length } = this.selected;
    let index = NaN;

    for (let i = 0; i < length; i += 1) {
      if (file.name === this.selected[i].name) {
        index = i;
        break;
      }
    }

    if (!isNaN(index)) {
      this.selected = [
        ...this.selected.slice(0, index),
        ...this.selected.slice(index + 1, length)
      ];
    }
  }

  toggleSelection = (file: UploadImage) => {
    if (!this.isSelected(file)) this.select(file);
    else this.unselect(file);
  }

  /** Options **/

  toggleMultipleSelection = () => {
    this.multipleSelection = !this.multipleSelection;

    if (this.multipleSelection === false) this.selected = [];
  }

  setMultipleSelection = (multipleSelection: boolean) => {
    this.multipleSelection = multipleSelection;

    if (this.multipleSelection === false) this.selected = [];
  }
}

export const fetchInitialStoreState = async () => {
  return {};
}
