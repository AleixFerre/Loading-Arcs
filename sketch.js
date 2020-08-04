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
let colors = ["#001524", "#006e80", "#ffecd1", "#ff7b00", "#852100"]; // The actual pallette

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
let selectFile; // Pick file input

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

    createDiv("<h3> SAVE-LOAD SYSTEM");

    saveButton = createButton("Save properties");
    saveButton.mouseClicked(saveProperties);

    selectFile = createFileInput(loadProperties);

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