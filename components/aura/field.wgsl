// Aura field — a slow, domain-warped light field composited over the hero photo.
//
// Design constraints, all of which come from what this layer has to do rather
// than from the maths:
//
//  1. The hero `<h1>` sits on the left on wide viewports and centres on narrow
//     ones, and several heroes render it with `outline-text`, whose fill is
//     transparent. So the field is suppressed over an ellipse that follows the
//     copy, and the ellipse is derived from the canvas aspect instead of being
//     a fixed constant. Without this the glow fights the headline.
//  2. The site decorates with big `bg-brand-pink/10 blur-3xl` divs. This layer
//     exists to look better than that and cost less, which is why it renders at
//     a fraction of the canvas size (see `fieldDimensions`) and why the browser
//     is left to interpolate it upward: at this scale the field is smooth
//     enough that bilinear upscaling is indistinguishable from a full-res pass.
//  3. Large, very low alpha gradients band badly at 8 bits. One least-
//     significant-bit of blue noise is added before quantising, decorrelated
//     per frame so it reads as film grain rather than a fixed screen door.
//
// Everything is 8-bit `rgba8unorm` and pre-scaled on the CPU, so the pass is a
// single fullscreen fragment with no intermediate targets.
struct Params {
  pink: vec4f,
  blue: vec4f,
  field: vec4f,
  shape: vec4f,
}

@group(0) @binding(0) var blueNoiseTexture: texture_2d<f32>;
@group(0) @binding(1) var<uniform> params: Params;

const OCTAVES: i32 = 3;

/** Hashes a 2D lattice cell to [0, 1). Sine-free, so it stays stable per device. */
fn hash21(cell: vec2f) -> f32 {
  var p = fract(cell * vec2f(0.1031, 0.103));
  p += dot(p, p.yx + 33.33);
  return fract((p.x + p.y) * p.x);
}

/** Interpolates the hash lattice with a quintic curve, so cells have no visible creases. */
fn value_noise(point: vec2f) -> f32 {
  let cell = floor(point);
  let local = fract(point);
  let curve = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);
  let bottomLeft = hash21(cell);
  let bottomRight = hash21(cell + vec2f(1.0, 0.0));
  let topLeft = hash21(cell + vec2f(0.0, 1.0));
  let topRight = hash21(cell + vec2f(1.0, 1.0));
  return mix(mix(bottomLeft, bottomRight, curve.x), mix(topLeft, topRight, curve.x), curve.y);
}

/**
 * Rotates and doubles between octaves, which decorrelates the lattices so the
 * summed field never lines up into an axis-aligned grid.
 */
fn octave_step(point: vec2f) -> vec2f {
  return vec2f(point.x * 1.6 - point.y * 1.2, point.x * 1.2 + point.y * 1.6) + vec2f(11.7, 5.3);
}

fn fbm(point: vec2f) -> f32 {
  var total = 0.0;
  var amplitude = 0.5;
  var octave = point;
  for (var index = 0; index < OCTAVES; index += 1) {
    total += value_noise(octave) * amplitude;
    octave = octave_step(octave);
    amplitude *= 0.5;
  }
  return total;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.shape.xy;
  let time = params.field.x;

  // The two lobes drift on different axes so the field shears as it moves
  // rather than sliding across as a rigid shape.
  let drift = vec2f(time * params.blue.w, -time * params.blue.w * 0.62);
  let centered = (uv - vec2f(0.5)) * aspect;

  // Domain warp: sampling a second, slower field and displacing by it folds the
  // blobs into filaments, which is what makes this read as light rather than fog.
  let warp = vec2f(
    fbm(centered * 0.85 + drift * 0.5),
    fbm(centered * 0.85 + vec2f(5.2, 1.3) - drift * 0.4),
  );
  // Deliberately low frequency. The field is rasterized around 380px wide and
  // the compositor scales it up roughly four times, so only the broad shapes
  // survive the interpolation; anything finer would be paid for and thrown away.
  let warped = centered * 0.82 + (warp - vec2f(0.5)) * 1.05;

  let densityField = fbm(warped * 1.15 + drift * 0.25);
  let tintField = fbm(warped * 0.85 - drift * 0.18 + vec2f(3.7, -1.1));

  let density = smoothstep(params.field.z, params.field.z + params.field.w, densityField);
  let tint = smoothstep(0.28, 0.74, tintField);

  // `brand-secondary-blue` is nearly black, so on its own it reads as a hole in
  // the layer rather than as a cool highlight. Lifting it a tenth of the way
  // toward the pink keeps it on-brand while letting it carry light.
  let color = mix(params.blue.rgb, params.pink.rgb, tint) + params.pink.rgb * 0.12 * (1.0 - tint);

  // The calm ellipse tracks the headline: offset left when the copy is beside
  // the stat cards, centred and wider when the hero stacks.
  let wide = step(1.25, aspect.x / max(aspect.y, 0.001));
  let calmCenter = mix(vec2f(0.5, 0.46), vec2f(0.36, 0.5), wide);
  let calmRadius = mix(vec2f(0.62, 0.3), vec2f(0.4, 0.38), wide);
  let calmDistance = length((uv - calmCenter) / calmRadius);
  let presence = smoothstep(0.5, 1.15, calmDistance);

  // Fade at the left, right and bottom so the layer never shows a seam against
  // the page. The top is left open: the hero runs to the top of the viewport,
  // under an opaque navigation bar, so there is no edge to hide there.
  let sideFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x);
  let baseFade = smoothstep(0.0, 0.16, uv.y);

  // A very slow luminance breath, 30s per cycle, so the layer never looks
  // frozen on a long dwell.
  let breath = 0.88 + 0.12 * sin(time * 0.21);

  var alpha = density * presence * sideFade * baseFade * breath * params.pink.w;

  let dimensions = textureDimensions(blueNoiseTexture);
  let pixel = vec2u(clamp(uv * vec2f(dimensions), vec2f(0.0), vec2f(dimensions) - vec2f(1.0)));
  let seed = vec2u(u32(params.field.y) * 37u + 11u, u32(params.field.y) * 23u + 5u);
  let noise = textureLoad(blueNoiseTexture, vec2i((pixel * vec2u(3u, 5u) + seed) & vec2u(127u)), 0).r;
  alpha = clamp(alpha + (noise - 0.5) * (2.0 / 255.0), 0.0, 1.0);

  // Pre-scaled, to match the premultiplied surface the canvas is configured with.
  return vec4f(color * alpha, alpha);
}
