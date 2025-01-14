//@ts-check - Get type warnings from the TypeScript language server. Remove if not wanted.

/**
 * Create a text card.
 * @param {string} content Content inside the div
 * @param {Spotfire.DataViewCategoricalValuePathElement[]} annotation Annotation data from axis chosen by the user
 * @param {number} maxHeight Max height of card
 * @param {{row:boolean, allRows:boolean}} markObject MarkObject contains information about if the object and/or rows is marked
 * @param {StylingInfo} fontStyling
 * @returns {{ textCardDiv: HTMLDivElement,
        header: HTMLDivElement,
        content: HTMLDivElement}}
 */

        function createTextCard(content, annotation, maxHeight, markObject, fontStyling, lineDividerColor,keywords2highlight) {
    // create div
    var textCardDiv = createTextCardDiv(fontStyling);

    // check if row is marked and check if all rows are marked. If row is not marked and all rows are not marked, decrease opacity (= add 99 to hexcolor => 60% opacity)
    if (!markObject.row && !markObject.allRows) textCardDiv.style.color = fontStyling.fontColor + "99";

    // add annotation to text card
    if (annotation !== null) {
        // create all annotation divs
        var header = createTextCardHeader();

        var firstAnnotationCreated = false;
        for (var i = 0; i < annotation.length; i++) {
            var dataValue = annotation[i].formattedValue(); // get annotation value

            if (annotation[i].key !== null) {
                // check if annotation has value

                var headerContent = createHeaderContent(dataValue);

                let dataValueLength = ("" + dataValue).length;
                // annotations with 4 or less characters get never truncated
                if (dataValueLength < 4) {
                    headerContent.style.minWidth = dataValueLength + "ch";
                    headerContent.style.textOverflow = "unset";
                }

                if (i !== 0 && firstAnnotationCreated) {
                    // first annotation -> no border
                    headerContent.style.borderLeft = "1px solid";
                    headerContent.style.borderLeftColor = lineDividerColor + "BF";
                    headerContent.style.paddingLeft = "8px";
                }
                header.appendChild(headerContent);
                firstAnnotationCreated = true;
            }
        }

        if (firstAnnotationCreated) {
            // check if any annotation has been created
            textCardDiv.appendChild(header);

            // add divider line to text card
            var line = createLineDividerInTextCard(lineDividerColor);
            textCardDiv.appendChild(line);
        }
    }

    // add paragraph to text card
    if (typeof content === "string") {
        var contentParagraph = createTextCardContentParagraph(maxHeight, content, fontStyling,keywords2highlight);
        textCardDiv.appendChild(contentParagraph);
    }

    var divObject = {
        textCardDiv: textCardDiv,
        header: header,
        content: contentParagraph
    };

    return divObject;
}

/**
 * Create a tooltip string
 * @param {Spotfire.DataViewRow} specificRow Row of dataset
 * @param {Spotfire.DataViewHierarchy} tooltipHierarchy Content of tooltip
 * @returns {string}
 */
function createTooltipString(specificRow, tooltipHierarchy) {
    var nrOfTooltipChoices = specificRow.categorical(tooltipHierarchy.name).value().length;
    var tooltipCollection = [];
    var tooltipString = "";
    var i = null;
    for (i = 0; i < nrOfTooltipChoices; i++) {
        var columnName = tooltipHierarchy.levels[i].name;
        var dataValue = specificRow.categorical(tooltipHierarchy.name).value()[i].formattedValue();

        // truncate to a max length of 100 characters per tooltip row
        var maxLength = 100;
        if (typeof dataValue === "string" && dataValue.length > maxLength) {
            dataValue = truncateString(dataValue, maxLength);
        }

        var tooltipObj = {
            columnName: columnName,
            dataValue: dataValue
        };

        if (dataValue !== null) {
            // remove empty data values
            tooltipCollection.push(tooltipObj);
            tooltipString = tooltipString + tooltipObj.columnName + ": " + tooltipObj.dataValue + "\n";
        }
    }
    return tooltipString;
}

/**
 * Create a text card content paragraph
 * @param {number} maxHeight Max height of card
 * @param {string} content Content of text card
 * @param {StylingInfo} fontStyling Style of font from api
 * @returns {HTMLDivElement}
 */
function createTextCardContentParagraph(maxHeight, content, fontStyling,keywords2highlight) {
    var paragraph = document.createElement("div");
    paragraph.setAttribute("id", "text-card-paragraph");
    paragraph.innerHTML = highlightWords(content,keywords2highlight);
    paragraph.style.maxHeight = maxHeight + "px";

    // apply styling of font Weight and Style only on Textcard Content (not on annotation line)
    paragraph.style.fontStyle = fontStyling.fontStyle;
    paragraph.style.fontWeight = fontStyling.fontWeight;
    paragraph.style.whiteSpace = "pre-line";

    return paragraph;
}

//wraps with a mark those letters found on text. highlightWords("abcde fgh ibjkl","b,e") //'a<mark>b</mark>cd<mark>e</mark> fgh i<mark>b</mark>jkl'
function highlightWords(text, find) {
    if (!find) return text;
    let keywords = find.split(',').map(s => s.trim());
    let regex = new RegExp(keywords.join('|'), "gi");
    return text.replace(regex, match => `<mark>${match}</mark>`);
  }

/**
 * Create header of text card / annotation
 * @param {string} annotation Annotation content
 * @returns {HTMLDivElement}
 */
function createHeaderContent(annotation) {
    var headerContent = document.createElement("div");
    headerContent.setAttribute("class", "annotation-content");
    headerContent.textContent = annotation;
    return headerContent;
}

/**
 * Create line divider in text card
 * @param {string} lineColor Color of line divider
 * @returns {HTMLHRElement}
 */
function createLineDividerInTextCard(lineColor) {
    var line = document.createElement("hr");
    line.setAttribute("class", "thin_hr");
    // color 75% opacity of line color
    line.style.backgroundColor = lineColor + "BF";
    return line;
}

/**
 * Create text card div
 * @param {StylingInfo} fontStyling Style of the current mod from api
 * @returns {HTMLDivElement}
 */
function createTextCardDiv(fontStyling) {
    var textCardDiv = document.createElement("div");
    // adapting to font Color, size, family from API (theme)
    textCardDiv.style.color = fontStyling.fontColor;
    textCardDiv.style.fontSize = fontStyling.fontSize;
    textCardDiv.style.fontFamily = fontStyling.fontFamily;
    return textCardDiv;
}

/**
 * Create text card header string
 * @returns {HTMLDivElement}
 */
function createTextCardHeader() {
    var header = document.createElement("div");
    header.setAttribute("class", "annotation-container");
    return header;
}

/**
 * Create copy button for the text card
 * @param {HTMLDivElement} newDiv The div / text card to have the new button
 * @param {string} buttonColor Color of button
 */
function createCopyButton(newDiv, buttonColor) {
    // create element
    var newButton = document.createElement("svg");

    newButton.title = "Copy to Clipboard";
    newButton.setAttribute("id", "img-button");

    // gets and creates svg
    var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgNode.setAttributeNS(null, "width", "16");
    svgNode.setAttributeNS(null, "height", "16");

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // set 60% opacity of font color
    svg.setAttributeNS(null, "fill", buttonColor + "99");
    svg.setAttributeNS(null, "viewBox", "0 0 16 16");
    svg.setAttributeNS(null, "d", "M11.259 1H6v3H2v11h10v-3h2V4.094zM8 4h2v1H8zm3 10H3V5h3v7h5zm1-5H8V8h4zm0-2H8V6h4z");
    // set 80 % opacity of font color
    newButton.onmouseover = (e) => {
        svg.setAttributeNS(null, "fill", buttonColor + "CC");
    };

    newButton.onmousedown = (e) => {
        svg.setAttributeNS(null, "fill", buttonColor);
        var text = newDiv.querySelector("#text-card-paragraph").textContent;
        textToClipboard(text);
        e.stopPropagation();
    };
    // set 80 % opacity of font color
    newButton.onmouseup = (e) => {
        svg.setAttributeNS(null, "fill", buttonColor + "CC");
        e.stopPropagation();
    };
    // set60% opacity of font color
    newButton.onmouseleave = (e) => {
        svg.setAttributeNS(null, "fill", buttonColor + "99");
    };

    svgNode.appendChild(svg);
    newButton.appendChild(svgNode);
    newDiv.appendChild(newButton);
}

/**
 * Create a Spotfire-style warning when "Cards by" gets changed from default value.
 * @param {HTMLElement} modDiv The div / text card to have the new button
 * @param {string} textColor
 * @param {Spotfire.Axis} cardbyProp
 * @param {Spotfire.ModProperty<boolean>} customExpression
 */
function createWarning(modDiv, textColor, cardbyProp, customExpression) {
    // get warning div
    var warningDiv = findElem("#warning-message");

    // hide text card and show warning
    modDiv.style.display = "none";
    warningDiv.style.display = "block";
    warningDiv.innerHTML = "";

    var errorLayout = document.createElement("div");
    errorLayout.setAttribute("class", "error-layout");

    var errorContainer = document.createElement("div");
    errorContainer.setAttribute("class", "error-container");

    var errorText = document.createElement("div");
    errorText.setAttribute("class", "error-text");
    errorText.style.color = textColor;
    errorText.innerHTML =
        "This visualization is made to show unaggregated data.<br>Not selecting <strong>(Row Number)</strong> may display aggregated text cards.";
    errorContainer.appendChild(errorText);

    var buttonRow = document.createElement("div");
    buttonRow.setAttribute("class", "warning-row");

    var ignoreButton = document.createElement("div");
    var resetButton = document.createElement("div");

    const disableUI = function () {
        ignoreButton.onclick = null;
        resetButton.onclick = null;
        errorContainer.style.opacity = "0.5";
    };

    // create 'Ignore' button
    if (cardbyProp.expression !== "<>" && cardbyProp.expression !== "<baserowid()>") {
        ignoreButton.setAttribute("class", "spotfire-button-flex spotfire-button-white");
        var ignoreButtonText = document.createElement("div");
        ignoreButtonText.setAttribute("class", "spotfire-button-text");
        ignoreButtonText.textContent = "Keep current setting";
        ignoreButton.onclick = (e) => {
            // Allow future custom expressions
            customExpression.set(true);
            disableUI();
            e.stopPropagation();
        };
        ignoreButton.appendChild(ignoreButtonText);
        buttonRow.appendChild(ignoreButton);
    }

    // create 'Reset' button
    resetButton.setAttribute("class", "spotfire-button-flex spotfire-button-blue");
    var resetButtonText = document.createElement("div");
    resetButtonText.setAttribute("class", "spotfire-button-text");
    resetButtonText.textContent = "Use '(Row Number)'";
    resetButton.onclick = (e) => {
        // Change Card By expression to baserowid
        cardbyProp.setExpression("<baserowid()>");
        customExpression.set(false);
        disableUI();
        e.stopPropagation();
    };

    resetButton.appendChild(resetButtonText);
    buttonRow.appendChild(resetButton);

    errorContainer.appendChild(buttonRow);
    errorLayout.appendChild(errorContainer);
    warningDiv.appendChild(errorLayout);
}

/**
 * Clear the "Cards by" warning
 * @param {*} modDiv
 */
function clearWarning(modDiv) {
    // get warning div
    var warningDiv = findElem("#warning-message");
    warningDiv.style.display = "none";
    modDiv.style.display = "block";
}

/**
 * Create copy button for the text card
 * @param {HTMLElement} newDiv The div / text card to have the new button
 * @param {string} buttonColor Color of button
 * @param {Spotfire.ModProperty<string>} sortOrder
 */
function createSortButton(newDiv, buttonColor, sortOrder) {
    // create element
    var newButton = document.createElement("svg");

    newButton.title = "Sorted in " + sortOrder.value() + "ending order";
    newButton.setAttribute("id", "img-button-sort");

    // gets and creates svg
    var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgNode.setAttributeNS(null, "width", "16");
    svgNode.setAttributeNS(null, "height", "16");
    svgNode.setAttributeNS(null, "viewBox", "0 0 16 16");
    // set 60% opacity of font color
    svgNode.setAttributeNS(null, "fill", buttonColor + "99");

    if (sortOrder.value() == "asc") {
        // sort symbol for ascending
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(
            null,
            "d",
            "M3.74645 14.3543C3.94171 14.5495 4.25829 14.5495 4.45355 14.3543L7.63553 11.1723C7.8308 10.977 7.8308 10.6604 7.63553 10.4652C7.44027 10.2699 7.12369 10.2699 6.92843 10.4652L4.1 13.2936L1.27157 10.4652C1.07631 10.2699 0.759729 10.2699 0.564466 10.4652C0.369204 10.6604 0.369204 10.977 0.564466 11.1723L3.74645 14.3543ZM3.6 -0.000714123L3.6 14.0007H4.6L4.6 -0.000714123L3.6 -0.000714123Z"
        );
        svgNode.appendChild(path);

        for (let i = 0; i < 4; i++) {
            let widths = ["3", "4", "5", "6"];
            //let ys = ["13.5", "9.5", "5.5", "1.5"];
            let ys = ["1.5", "5.5", "9.5", "13.5"];
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "x", "9.5");
            rect.setAttributeNS(null, "y", ys[i]);
            rect.setAttributeNS(null, "width", widths[i]);
            rect.setAttributeNS(null, "height", "1");
            rect.setAttributeNS(null, "rx", "0.5");
            svgNode.appendChild(rect);
        }
    } else {
        // sort symbol for descending
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(
            null,
            "d",
            "M4.34847 0.641433C4.15044 0.44898 3.83389 0.453502 3.64143 0.651533L0.505229 3.87864C0.312776 4.07667 0.317298 4.39322 0.515329 4.58568C0.713361 4.77813 1.02991 4.77361 1.22236 4.57558L4.0101 1.70703L6.87864 4.49477C7.07667 4.68722 7.39322 4.6827 7.58568 4.48467C7.77813 4.28664 7.77361 3.97009 7.57558 3.77764L4.34847 0.641433ZM4.69995 14.9929L4.49995 0.992858L3.50005 1.00714L3.70005 15.0071L4.69995 14.9929Z"
        );
        svgNode.appendChild(path);

        for (let i = 0; i < 4; i++) {
            let widths = ["3", "4", "5", "6"];
            let ys = ["13.5", "9.5", "5.5", "1.5"];
            let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "x", "9.5");
            rect.setAttributeNS(null, "y", ys[i]);
            rect.setAttributeNS(null, "width", widths[i]);
            rect.setAttributeNS(null, "height", "1");
            rect.setAttributeNS(null, "rx", "0.5");
            svgNode.appendChild(rect);
        }
    }
    // set 80 % opacity of font color
    newButton.onmouseover = (e) => {
        svgNode.setAttributeNS(null, "fill", buttonColor + "CC");
    };

    newButton.onmousedown = (e) => {
        svgNode.setAttributeNS(null, "fill", buttonColor);

        if (sortOrder.value() == "asc") sortOrder.set("desc");
        else sortOrder.set("asc");

        e.stopPropagation();
    };
    // set 80 % opacity of font color
    newButton.onmouseup = (e) => {
        svgNode.setAttributeNS(null, "fill", buttonColor + "CC");
        e.stopPropagation();
    };
    // set60% opacity of font color
    newButton.onmouseleave = (e) => {
        svgNode.setAttributeNS(null, "fill", buttonColor + "99");
    };

    newButton.appendChild(svgNode);
    newDiv.appendChild(newButton);
}
