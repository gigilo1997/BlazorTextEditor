(function () {
    const uploadUrl = 'https://localhost:7219/api/upload-image';
    const deleteUrl = 'https://localhost:7219/api/delete-image';

    function getImageUrls(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return Array.from(doc.images).map(img => img.src);
    }

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        return await response.text();
    }

    async function deleteImage(src) {
        const filename = src.split('/').pop();
        try {
            await fetch(`${deleteUrl}?name=${encodeURIComponent(filename)}`, {
                method: 'DELETE'
            });
        } catch (err) {
            console.error('Failed to delete image:', err);
        }
    }

    function handleImageUpload(quill) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            try {
                const imageUrl = await uploadImage(file);
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);
            } catch {
                alert('Image upload failed');
            }
        };
    }

    window.QuillFunctions = {
        createQuill: function (quillElement, showToolbar, dotNetHelper, initialContent) {
            Quill.register({ 'modules/table-better': QuillTableBetter }, true);

            const toolbarOptions = [
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                ['table-better'],
                [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
            ];

            const quill = new Quill(quillElement, {
                debug: 'debug',
                modules: {
                    toolbar: showToolbar ? {
                        container: toolbarOptions,
                        handlers: {
                            image: () => handleImageUpload(quill)
                        }
                    } : false,
                    'table-better': {
                        language: 'en_US',
                        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
                        toolbarTable: true
                    },
                },
                theme: 'snow',
                keyboard: {
                    bindings: QuillTableBetter.keyboardBindings
                }
            });

            quillElement.__quill = quill;

            if (initialContent) {
                quill.root.innerHTML = initialContent;
            }

            let previousHtml = initialContent || "";

            quill.on('text-change', function () {
                const currentHtml = quill.root.innerHTML;

                const previousImages = getImageUrls(previousHtml);
                const currentImages = getImageUrls(currentHtml);

                const removedImages = previousImages.filter(src => !currentImages.includes(src));
                removedImages.forEach(deleteImage);

                dotNetHelper.invokeMethodAsync('OnQuillTextChanged', currentHtml);
                previousHtml = currentHtml;
            });
        },

        getQuillHTML: function (quillElement) {
            return quillElement.__quill.root.innerHTML;
        }
    };
})();
