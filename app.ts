const canvas: HTMLCanvasElement = document.getElementById(
  "drawing-canvas"
) as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const touchProperties = document.querySelector("#touch-properties")!;

let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

function handleTouch(event: PointerEvent) {
  // Prevent default touch behavior like scrolling
  event.preventDefault();
  console.log(event);

  const { altitudeAngle, azimuthAngle } = tilt2spherical(
    event.tiltX,
    event.tiltY
  );

  // Calculate the touch position relative to the canvas
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Clear previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  const radius = 25 + 75 * event.pressure;

  // Draw a dot at the touch position based on pressure
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();

  // Draw a line with angle based on azimuth and length based on altitude
  ctx.lineWidth = 25;
  const length = radius + 75 / degToRad(altitudeAngle);
  const endX = x + Math.cos(degToRad(azimuthAngle)) * length;
  const endY = y + Math.sin(degToRad(azimuthAngle)) * length;
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Display the event properties
  touchProperties.textContent = `
  Pointer Type: ${event.pointerType},
  Pressure: ${event.pressure},  
  Tilt X: ${event.tiltX},
  Tilt Y: ${event.tiltY},
  Calculated Altitude Angle (deg): ${altitudeAngle},
  Calculated Azimuth Angle (deg): ${azimuthAngle},
  Twist: ${event.twist},
  Pointer Width: ${event.width},
  Pointer Height: ${event.height}`;
}

// cleaned up version of function from W3C PointerEvent docs, input and output in degrees
const tilt2spherical = (tiltX: number, tiltY: number) => {
  const tiltXrad = degToRad(tiltX);
  const tiltYrad = degToRad(tiltY);

  const azimuthAngle = Math.atan2(Math.sin(tiltYrad), Math.sin(tiltXrad));

  // ternary to avoid dividing by zero
  const altitudeAngle =
    Math.abs(tiltX) === 90 || Math.abs(tiltY) === 90
      ? 0
      : Math.atan(
          1 /
            Math.sqrt(
              Math.pow(Math.tan(tiltXrad), 2) + Math.pow(Math.tan(tiltYrad), 2)
            )
        );

  return {
    altitudeAngle: radToDeg(altitudeAngle),
    azimuthAngle: radToDeg(azimuthAngle),
  };
};

const radToDeg = (angle: number) => angle * (180 / Math.PI);
const degToRad = (angle: number) => angle * (Math.PI / 180);

// Various event listeners
canvas.addEventListener("pointermove", handleTouch);
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
window.addEventListener("resize", () => {
  rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
});
