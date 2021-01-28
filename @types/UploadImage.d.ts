interface UploadImage extends File {
  invalid: boolean,
  source?: string,
  meta: {
    caption?: string,
    copyright?: string,
    headline?: string,
    tags?: string[]
  }
}
