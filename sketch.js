// Code by Aleix Ferré
// Github: https://github.com/CatalaHD/
// p5 Sketch: https://editor.p5js.org/thecatalahd/sketches/j9D4IBrKL

// GLOBAL PROPERTIES
let i = 1; // Variable that increments over time
let increment = 2; // How much i increments over time
let circles = []; // Array with all the circles in the scene
let backgroundColor = ""; // The first color of the pallette is the background color

// COLOR
// Using the pallete
// https://coolors.co/001524-006e80-ffecd1-ff7b00-852100-ffffff
let colors = ["#001524", "#006e80", "#ffecd1", "#ff7b00", "#852100"]; // The actual pallette
let transparency = "88"; // Describe the two last bits of the color [00 : FF], alpha

// CIRCLE ATTRIBUTES
let delay = 50; // Delay in degrees between each circle and the next
let thickness = 30; // strokeWeight property of the circles
let spacing = thickness * 2; // Spacing between the center
let innerSpace = thickness * 2; // Spacing between each other
let enableMidPoint = true; // Draw the middle point?
let enableMidPointAlpha = false; // Alpha slider value affects the middle point?

// SLIDERS
let incSlider; // Slider that controls the increment
let spacingSlider; // Slider that controls the spacing
let thicknessSlider; // Slider that controls the thickness
let innerSpaceSlider; // Slider that controls the inner spacing
let alphaSlider; // Slider that controls the alpha

// CHECKBOXES
let midPointShowCheckBox;
let midPointAlphaCheckBox;

function setup() {
  createCanvas(400, 400);
  backgroundColor = colors.shift();

  createDiv("Speed:");
  incSlider = createSlider(0, 20, increment, 1);

  createDiv("Thickness:");
  thicknessSlider = createSlider(1, 51, thickness, 1);

  createDiv("Spacing:");
  spacingSlider = createSlider(1, width, spacing, 1);

  createDiv("Inter-Circle spacing:");
  innerSpaceSlider = createSlider(0, 80, innerSpace, 1);

  createDiv("Alpha:");
  alphaSlider = createSlider(0, 255, parseInt(transparency, 16), 1);

  midPointShowCheckBox = createCheckbox("Show middle point", true);
  midPointShowCheckBox.changed(changeShowingMidPoint);

  midPointAlphaCheckBox = createCheckbox("Alpha value affects middle point", false);
  midPointAlphaCheckBox.changed(changeAlphaAffectMidPoint);

  angleMode(DEGREES);
  fillCircles();
}

function draw() {
  background(backgroundColor);

  // Getting all the slider values
  increment = incSlider.value();
  thickness = thicknessSlider.value();
  transparency = alphaSlider.value().toString(16);
  // If there is no first bit, append it
  if (transparency.length <= 1) {
    transparency = "0" + transparency;
  }

  // We change the spacing properly
  changeSpacing();

  // Translate to the center of the screen and also rotate
  translate(width / 2, height / 2);
  rotate(i); // This rotation gives it a lot of feeling :D Feel free to remove it

  // Let i flow... but only in 360 degrees
  i += increment;
  i = i % 360;

  // Some style
  noFill();
  strokeWeight(thickness);

  // Update and show all the circles
  for (let j = 0; j < circles.length; j++) {
    circles[j].update();
    circles[j].setColor(colors[j] + transparency);
    circles[j].show();
  }

  // If we can, draw the middle point
  if (enableMidPoint) {
    if (enableMidPointAlpha) {
      stroke(colors[0] + transparency);
    } else {
      stroke(colors[0]);
    }
    point(0, 0);
  }
}

// Mid Point Show Setter
function changeShowingMidPoint() {
  enableMidPoint = this.checked();
}

// Mid Point Alpha Setter
function changeAlphaAffectMidPoint() {
  enableMidPointAlpha = this.checked();
}

// Function that creates all the circles and pushes them into the circles array
function fillCircles() {
  for (let i = 0; i < colors.length; i++) {
    circles.push(new Circle(i * spacing + 100, i * delay, colors[i] + transparency));
  }
}

// Function that change the radius of the circles properly
function changeSpacing() {
  spacing = spacingSlider.value();
  innerSpace = innerSpaceSlider.value();

  for (let i = 0; i < circles.length; i++) {
    circles[i].setRadius(spacing + innerSpace * i);
  }
}