function setup() {
    // put setup code here
    createCanvas(1200, 900);
  }
  
  function draw() {
    // put drawing code here
    background(0);
  }

  function windowResized() {
    let { w, h } = getSize();
    resizeCanvas(w, h);
}

function getSize() {
  let nch = 0;
  if (typeof getNonCanvasHeight === 'function') {
      nch = getNonCanvasHeight();
  } else {
      nch = 25;
  }
  let w = windowWidth;
  let h = windowHeight - nch;
  if (windowHeight - nch < w * RATIO) {
      w = h / RATIO;
  } else {
      h = w * RATIO;
  }
  return { w, h };
}
