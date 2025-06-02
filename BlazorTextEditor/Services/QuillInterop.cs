using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BlazorTextEditor.Services;

public class QuillInterop
{
    private readonly IJSRuntime jSRuntime;

    public QuillInterop(IJSRuntime jSRuntime)
    {
        this.jSRuntime = jSRuntime;
    }

    public ValueTask<object> CreateQuill(
        ElementReference quillElement,
        bool showToolbar)
    {
        return jSRuntime.InvokeAsync<object>(
            "QuillFunctions.createQuill",
            quillElement,
            showToolbar);
    }
}
