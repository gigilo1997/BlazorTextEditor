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
                                        const reader = new FileReader();
                                        reader.onload = async () => {
                                            const base64 = reader.result.split(',')[1];
                                            const imageName = file.name;
                                            try {
                                                const imageUrl = await dotNetHelper.invokeMethodAsync('UploadImage', base64, imageName);
                                                const range = quill.getSelection();
                                                quill.insertEmbed(range.index, 'image', imageUrl);
                                            } catch (err) {
                                                alert('Upload failed');
                                            }
                                        };
                                        reader.readAsDataURL(file);
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