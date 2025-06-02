(function () {
    window.QuillFunctions = {
        createQuill: function (quillElement, toolbar, dotNetHelper, initialContent) {
            Quill.register({
                'modules/table-better': QuillTableBetter
            }, true);

            let toolbarOptions = [
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                ['table-better'],
                [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
            ];
            let options = {
                debug: 'debug',
                modules: {
                    toolbar: toolbar ? {
                        container: toolbarOptions,
                        handlers: {
                            image: function () {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');
                                input.click();

                                input.onchange = async () => {
                                    const file = input.files[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('file', file);

                                        // Url should not be here
                                        const response = await fetch('https://localhost:7219/api/upload-image', {
                                            method: 'POST',
                                            body: formData
                                        });

                                        if (response.ok) {
                                            const imageUrl = await response.text(); // or JSON if you return { url: "..." }
                                            const range = quill.getSelection();
                                            quill.insertEmbed(range.index, 'image', imageUrl);
                                        } else {
                                            alert('Image upload failed');
                                        }
                                    }
                                };
                            }
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
            }
            
            const quill = new Quill(quillElement, options);
            quillElement.__quill = quill;

            if (initialContent) {
                quill.root.innerHTML = initialContent;
            }

            quill.on('text-change', function () {
                const html = quill.root.innerHTML;
                dotNetHelper.invokeMethodAsync('OnQuillTextChanged', html);
            });
        },
        getQuillHTML: function (quillElement) {
            return quillElement.__quill.root.innerHTML;
        },
    }
})();