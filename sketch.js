// Code by Aleix Ferré
// Github: https://github.com/CatalaHD/
// p5 Sketch: https://editor.p5js.org/thecatalahd/sketches/j9D4IBrKL

// GLOBAL PROPERTIES
let i = 1; // Variable that increments over time
let circles = []; // Array with all the circles in the scene
let backgroundColor = ""; // The first color of the pallette is the background color
let delay = 50; // Delay in degrees between each circle and the next

// COLOR
// Using the pallete
// https://coolors.co/001524-006e80-ffecd1-ff7b00-852100-ffffff
let indexColor = 0;
let pallette = [
    ["#001524", "#006e80", "#ffecd1", "#ff7b00", "#852100"],
    ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#FFFFFF"],
    ["#1F2041", "#4B3F72", "#FFC857", "#119DA4", "#FFFFFF"],
    ["#314CB6", "#B68CB8", "#6461A0", "#EFBDEB", "#FFFFFF"],
    ["#3D315B", "#444B6E", "#708B75", "#9AB87A", "#FFFFFF"],
    ["#D8CFAF", "#E6B89C", "#ED9390", "#F374AE", "#333333"]
]; // The actual pallette
let colors = [...pallette[indexColor]];

// CIRCLE ATTRIBUTES
let properties = { // The properties objet to save
    increment: 2, // How much i increments over time
    thickness: 30, // strokeWeight property of the circles
    spacing: 60, // Spacing between the center
    innerSpace: 60, // Spacing between each other
    enableMidPoint: true, // Draw the middle point?
    enableMidPointAlpha: false, // Alpha slider value affects the middle point?
    transparency: "88" // Describe the two last bits of the color [00 : FF], alpha
};

// SLIDERS
let incSlider; // Slider that controls the increment
let spacingSlider; // Slider that controls the spacing
let thicknessSlider; // Slider that controls the thickness
let innerSpaceSlider; // Slider that controls the inner spacing
let alphaSlider; // Slider that controls the alpha

// CHECKBOXES
let midPointShowCheckBox; // Midpoint Show check
let midPointAlphaCheckBox; // Midpoint Alpha check

// BUTTONS
let saveButton; // Save properties button
let saveCanvasButton; // Save canvas button
let selectFile; // Pick file input
let selectPallette; // Select pallette option
let colorsInputs = []; // List of inputs to make the custom color pallette

function setup() {
    createDiv("<h1> Loading Arcs </h1>");

    createCanvas(400, 400);
    backgroundColor = colors.shift();

    createDiv("Speed:");
    incSlider = createSlider(0, 20, properties.increment, 1);

    createDiv("Thickness:");
    thicknessSlider = createSlider(1, 51, properties.thickness, 1);

    createDiv("Spacing:");
    spacingSlider = createSlider(1, width, properties.spacing, 1);

    createDiv("Inter-Circle spacing:");
    innerSpaceSlider = createSlider(0, 80, properties.innerSpace, 1);

    createDiv("Alpha:");
    alphaSlider = createSlider(0, 255, parseInt(properties.transparency, 16), 1);

    midPointShowCheckBox = createCheckbox("Show middle point", true);
    midPointShowCheckBox.changed(changeShowingMidPoint);

    midPointAlphaCheckBox = createCheckbox("Alpha value affects middle point", false);
    midPointAlphaCheckBox.changed(changeAlphaAffectMidPoint);

    createDiv("<h3> SELECT YOUR PREFERRED PALLETTE </h3>");
    selectPallette = createSelect();
    for (let i = 0; i < pallette.length; i++) {
        selectPallette.option("Pallette " + (i + 1)); // Index n
    }
    selectPallette.changed(changePallette);

    createDiv("<h4> ...OR MAKE YOUR OWN </h4>");
    colorsInputs.push(createInput(backgroundColor, "text"));
    for (let i = 0; i < 4; i++) {
        colorsInputs.push(createInput(colors[i], "text"));
    }
    let customColorButton = createButton("Change color");
    customColorButton.mouseClicked(customPallette);
    let importColorsButton = createButton("Import colors from pallette");
    importColorsButton.mouseClicked(importColors);


    createDiv("<h3> SAVE-LOAD PROPERTIES </h3>");

    saveButton = createButton("Save properties");
    saveButton.mouseClicked(saveProperties);

    selectFile = createFileInput(loadProperties);

    createDiv("<h3> SAVE CANVAS </h3>");

    saveCanvasButton = createButton("Save png");
    saveCanvasButton.mouseClicked(save_png);

    angleMode(DEGREES);
    fillCircles();
}

function draw() {
    background(backgroundColor);

    // Getting all the slider values
    properties.increment = incSlider.value();
    properties.thickness = thicknessSlider.value();
    properties.transparency = alphaSlider.value().toString(16);
    // If there is no first bit, append it
    if (properties.transparency.length <= 1) {
        properties.transparency = "0" + properties.transparency;
    }

    // We change the spacing properly
    changeSpacing();

    // Translate to the center of the screen and also rotate
    translate(width / 2, height / 2);
    rotate(i); // This rotation gives it a lot of feeling :D Feel free to remove it

    // Let i flow... but only in 360 degrees
    i += properties.increment;
    i = i % 360;

    // Some style
    noFill();
    strokeWeight(properties.thickness);

    // Update and show all the circles
    for (let j = 0; j < circles.length; j++) {
        circles[j].update();
        circles[j].setColor(colors[j] + properties.transparency);
        circles[j].show();
    }

    // If we can, draw the middle point
    if (properties.enableMidPoint) {
        if (properties.enableMidPointAlpha) {
            stroke(colors[0] + properties.transparency);
        } else {
            stroke(colors[0]);
        }
        point(0, 0);
    }
}

// Mid Point Show Setter
function changeShowingMidPoint() {
    properties.enableMidPoint = this.checked();
}

// Mid Point Alpha Setter
function changeAlphaAffectMidPoint() {
    properties.enableMidPointAlpha = this.checked();
}

// Function that creates all the circles and pushes them into the circles array
function fillCircles() {
    for (let i = 0; i < colors.length; i++) {
        circles.push(new Circle(i * properties.spacing + 100, i * delay, colors[i] + properties.transparency));
    }
}

// Function that puts the actual pallette colorts into the input texts
function importColors() {
    for (let i = 0; i < 5; i++) {
        colorsInputs[i].value(pallette[indexColor][i]);
    }
}

// Function that changes the actual pallette
function changePallette() {
    let val = selectPallette.value();
    indexColor = parseInt(val.substring(val.length - 1, val.length)) - 1;
    var tempCol = [...pallette[indexColor]]; // We make a copy
    backgroundColor = tempCol.shift();
    colors = tempCol;
}

// Function that changes the actual pallette to the custom inputs
function customPallette() {
    backgroundColor = colorsInputs[0].value();
    for (let i = 0; i < 4; i++) {
        colors[i] = colorsInputs[i + 1].value();
    }
}

// Function that change the radius of the circles properly
function changeSpacing() {
    properties.spacing = spacingSlider.value();
    properties.innerSpace = innerSpaceSlider.value();

    for (let i = 0; i < circles.length; i++) {
        circles[i].setRadius(properties.spacing + properties.innerSpace * i);
    }
}

function saveProperties() {
    console.log(properties);
    saveJSON(properties, "properties.json");
}

function loadProperties(file) {
    if (!file) {
        // If there is no file
        console.error("No file selected!");
        return false;
    }

    // Split file.data and get the base64 string
    let base64Str = file.data.split(",")[1];
    // Parse the base64 string into a JSON string
    let jsonStr = atob(base64Str);
    // Parse the JSON object into a Javascript object
    let obj = JSON.parse(jsonStr);

    if (!obj.increment) {
        console.error("Incorrect formatting!");
        return false;
    }

    incSlider.value(obj.increment);
    spacingSlider.value(obj.spacing);
    thicknessSlider.value(obj.thickness);
    innerSpaceSlider.value(obj.innerSpace);
    alphaSlider.value(parseInt(obj.transparency, 16));

    midPointShowCheckBox.value(obj.enableMidPoint);
    midPointAlphaCheckBox.value(obj.enableMidPointAlpha);

    console.log("File loaded succesfully", obj);
}

function save_png() {
    saveCanvas("canvas", "png");
}