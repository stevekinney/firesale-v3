document.addEventListener('dragstart', (event) => event.preventDefault());
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('dragleave', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());

const getDraggedFile = (event: DragEvent) => {
  return event.dataTransfer?.items?.[0];
};

const getDroppedFile = (event: DragEvent) => {
  return event.dataTransfer?.files?.[0];
};

const fileTypeIsSupported = (file: File | DataTransferItem): boolean => {
  if (file.type === 'text/markdown') return true;
  if (file.type === 'text/plain') return true;
  return false;
};

export const addDragAndDropListeners = (
  element: HTMLTextAreaElement,
  onDropCallback: (path: string, content: string) => void,
) => {
  element.addEventListener('dragover', (event) => {
    const file = getDraggedFile(event);
    if (!file) return;

    if (fileTypeIsSupported(file)) {
      element.classList.add('drag-over');
    } else {
      element.classList.add('drag-error');
    }
  });

  element.addEventListener('dragleave', () => {
    element.classList.remove('drag-over');
    element.classList.remove('drag-error');
  });

  element.addEventListener('drop', async (event) => {
    element.classList.remove('drag-over');
    element.classList.remove('drag-error');

    const file = getDroppedFile(event);

    if (!file) return;

    if (!fileTypeIsSupported(file)) {
      return;
    }

    const content = await file.text();

    element.value = content;
    if (typeof onDropCallback === 'function')
      onDropCallback(file.path, content);
  });
};
