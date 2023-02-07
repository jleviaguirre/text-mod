//this file takes care of the configuration widget that allows the text mod to 
//allow html and highlighting comma separated keywords

//helper function that inverst the hex code (for custom theme)
function invertHex(hex) {
    hex = hex.slice(1, hex.length)
    return "#" + (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

//adds a floating placeholder icon to configure the textArea
//you can later append stuff to the configDialog right after the configDialogCloseBtn
//like configDialog.appendChild(yourDomElement)

function createConfigButton(context, configDialogContents, keywords) {

    //can't find a proper way to check if its dark or white canvas from the API
    let bgColor = context.styling.general.backgroundColor;
    let isDark = bgColor == "#2A2A2A";
    let isLight = bgColor == "#FFFFFF";

    let fillColor = isDark ? "rgba(124, 124, 124, 1.5)" : isLight ? "rgba(68, 68, 68, 0.5)" : invertHex(bgColor);
    let fillHoverColor = isDark ? "rgba(143, 143, 143, 1.5)" : isLight ? "rgba(68, 68, 68, .5)" : invertHex(bgColor);

    _gearIcon = `<svg class="configIcon" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 16 16"><path d="M16 10.66a2.078 2.078 0 0 1-3.63.34h-.47v3.9H9.15l.29-.3-.36-.66-.06-.11-.07-.13-.02-.03a.21.21 0 0 0-.04-.06 1.088 1.088 0 0 0 .08-.31c.03-.01.07-.03.11-.04h.93v-3.15l-.83-.15a3.964 3.964 0 0 1-.43-.11 1.748 1.748 0 0 1 .11-.18l.1-.15.04-.05.02-.05.06-.11.36-.66-.53-.54-.92-.91-.54-.54-.66.37-.11.06-.37.19c-.04-.12-.08-.22-.11-.3l-.01-.02v-.97H2.91v.98l-.1.33-.52-.28-.22-.12H2V5h4v-.26a2.027 2.027 0 0 1-.94-2.25A2.003 2.003 0 1 1 8 4.73V5h3.9v4h.47a1.972 1.972 0 0 1 1.73-1 2.01 2.01 0 0 1 1.9 2.66z"></path><path d="M8.65 10.88c-.1-.03-.21-.06-.34-.1l-.52-.16a2.044 2.044 0 0 0-.28-.64l.33-.58c.05-.09.11-.19.17-.28l.04-.06.08-.12.06-.11-.91-.91-.11.06-.13.07-.95.5a2.99 2.99 0 0 0-.63-.29l-.11-.57a1.275 1.275 0 0 0-.12-.41l-.05-.17V7H3.92v.11l-.33 1.15c-.23.11-.41.17-.64.29l-.28-.18-.01-.01-.05-.02L2 8.02l-.19-.1h-.05l-.51.56-.34.3.06.11.56 1.09a2.39 2.39 0 0 0-.22.58l-.62.16a3.771 3.771 0 0 1-.69.24v1.27l.11.05 1.2.33c.05.19.16.41.22.58l-.56 1.1-.06.11.85.86h.05l.69-.38.45-.22a2.041 2.041 0 0 0 .58.22l.34 1.02.04.07.01.03h1.26l.05-.1.33-1.02a2.594 2.594 0 0 0 .64-.28l.51.28.68.36.61-.63.19-.19-.06-.11-.05-.05a4.025 4.025 0 0 0-.24-.46l-.28-.58a2.242 2.242 0 0 0 .28-.63l.54-.17a3.388 3.388 0 0 0 .51-.17H9v-1.29a3.502 3.502 0 0 1-.35-.08zm-4.12 2.44a1.82 1.82 0 0 1 0-3.64 1.82 1.82 0 0 1 0 3.64z"></path></svg>`

    _magnifierIcon = `<svg class="configIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#9999FF55" stroke="${fillHoverColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
     `
    configIcon = _magnifierIcon

    configDialogButton = `<div id="configButton" onclick="document.getElementById('configDialog').hidden = false" style="position:fixed;right:10px">${configIcon}</div>`

    configDialog = `<div id="configDialog" hidden xstyle="height:200px;width:200px;"> 
     <span id="configDialogCloseBtn" onclick="this.parentElement.hidden=true">
         <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve" class="closeSvg" style="width: 16px; height: 16px;"><g id="Lager_1"><g><g>
             <rect x="0.286" y="7.229" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.3137 8)" fill="#000" width="15.428" height="1.543"></rect></g></g><g><g>
             <rect x="7.229" y="0.286" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.3137 8)" fill="#000" width="1.543" height="15.428"></rect></g></g></g>
         </svg>
     </span>`


    configButtonFill = fillColor;
    configButtonFillHover = fillHoverColor;

    css = `<style>
     #configButton {
        fill: ${configButtonFill}; 
        top: 0px !important;
        right: 10px !important;
        position: fixed !important;
    }
    
    #configButton svg:hover {
        fill: ${configButtonFillHover}; 
    }
    
    
    /* config dialog */
    #configDialog {
        position: fixed;
        z-index: 10;
        right: 0px;
        top: 0px;
    
        width: fit-content;
        background: white;
        border: 1px solid black;
        border-top-width: 1px;
        border-right-width: 1px;
        border-bottom-width: 1px;
        border-left-width: 1px;
        border-top-color: #D8D9DC;
        border-right-color: #D8D9DC;
        border-bottom-color: #D8D9DC;
        border-left-color: #D8D9DC;
        background-color: #FFFFFF;
    
        padding-top: 20px;
        padding-left: 20px;
        padding-bottom: 10px;
        padding-right: 10px;
    
        font-size: 15px !important;
        font-family: "Roboto", Arial, Helvetica, sans-serif !important;
        font-weight: normal !important;
    
        box-shadow: 0 3px 11px 0 rgba(0, 0, 0, .16), 0 3px 6px 0 rgba(0, 0, 0, .16);
        border-radius: 6px;
    
    }
    #configDialogCloseBtn {
        position: absolute;
        right: 0px;
        top: 5px;
        margin-right: 5px;
        cursor: default;
        z-index: 30;
    }
    </style>`

    //inserts the popup to the dom
    //add the config dialog icon 
    document.body.insertAdjacentHTML("beforeBegin", configDialogButton)

    //add the config dialog when the config dialog icons is clicked
    document.body.insertAdjacentHTML("beforeBegin", configDialog)

    //inserts configuration options after the config dialog close button
    configDialogCloseBtn = document.getElementById("configDialogCloseBtn");
    configDialogCloseBtn.after(configDialogContents);

    //unhide form
    document.getElementById("searchForm").hidden = false;

    //add styling rules. Feel free to move css to the main.css file, but I rather keep it here
    document.body.insertAdjacentHTML("afterEnd", css)


    //this part configures the input text for highlighting so when you press enter, it performs the action
    let keywordsInput = document.getElementById("keywords2highlight");
    function performSearch() {
        console.log("searching for",keywordsInput.value)
        keywords.set(keywordsInput.value);
    }

    keywordsInput.onkeyup = function (event) {
        if (event.key == "Enter") {
            performSearch()
            configDialogCloseBtn.click()
        }
    }

    document.getElementById("performSearchButton").onclick = () => {
        performSearch()
    }

    //add click to not only show the config dialog button, but highlight the keyword input field
    document.getElementById("configButton").onmouseup = ()=>{
        setTimeout(()=>{document.getElementById("keywords2highlight").focus()},50);
    }

    //perform search when clearing the button
    document.querySelector("#searchForm button[type='reset']").onclick = () => {
        keywordsInput.value="";
        performSearch();
    }
}

 
