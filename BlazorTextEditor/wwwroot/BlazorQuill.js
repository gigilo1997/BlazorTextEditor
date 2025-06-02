(function () {
    window.QuillFunctions = {
        createQuill: function (quillElement, toolbar) {
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
            
            quillElement.__quill = new Quill(quillElement, options);
        }
    }
})();