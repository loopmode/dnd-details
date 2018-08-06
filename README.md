# dnd-details

Takes a `DragEvent` object and returns information about the dropped content.

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

### Dragging from desktop

When files were dragged in from the local filesystem, the `files` list will be populated.
None of the other values will be populated.

### Dragging from other browser windows

When dragging content from other browser windows, the `files` list will always be empty, but several of the other values will be populated.

-   When a single link is dragged, `text` should contain the displayed text of the link, and `links` should have one entry with the `href` URL of the link
-   When a single image is dragged, `images` should have one entry with the `src` URL of the image
-   When a linked image is dragged, both `links` and `images` should be populated
-   When dragging in entire websites, e.g. `Ctrl+A` then drag and drop, you might have the data for many images and links
-   The `links` and `images` arrays will always exist, even if they're empty. So it's safe write code like `if (details.images.length > 0)` and you don't need `if (details.images && details.images.length > 0)`
