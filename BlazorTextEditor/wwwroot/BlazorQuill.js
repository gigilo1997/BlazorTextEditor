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
                    toolbar: toolbar ? toolbarOptions : false,
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