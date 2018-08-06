# html5-drop-details

Takes a `DragEvent` object and returns information about the dragged content.

The returned object has the shape

```
export interface IDropDetails {
  files: FileList;
  links: string[];
  images: string[];
  text: string;
  html: string;
}
```
