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
// The motif is a drifting cellular web with lit nodes, which is the site's own
// subject: a network of chapters and members. A pointer adds a soft light that
// reveals the web where it passes.
//
// Everything is 8-bit `rgba8unorm` and pre-scaled on the CPU, so the pass is a
// single fullscreen fragment with no intermediate targets.
struct Params {
  pink: vec4f,
  blue: vec4f,
  field: vec4f,
  shape: vec4f,
  light: vec4f,
  net: vec4f,
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

/**
 * Two nearest feature-point distances over the surrounding 3x3 cells, as
 * `(nearest, second)`.
 *
 * The gap between them, `second - nearest`, is what draws the network: it is
 * near zero exactly on the boundary between two cells and grows toward each
 * cell's centre, so thresholding it low yields a web of thin lines rather than
 * the blobs `worley` usually gives. The `nearest` term separately marks the
 * feature points themselves, which become the nodes.
 *
 * This is the one part of the pass that justifies more than a plain gradient:
 * it is the only thing here that could not be done with a CSS radial-gradient,
 * and it is what ties the layer to the network the site is actually about.
 */
fn cellular(point: vec2f) -> vec2f {
  let base = floor(point);
  let local = fract(point);
  var nearest = 8.0;
  var second = 8.0;
  for (var y = -1; y <= 1; y += 1) {
    for (var x = -1; x <= 1; x += 1) {
      let offset = vec2f(f32(x), f32(y));
      let feature = vec2f(
        hash21(base + offset),
        hash21(base + offset + vec2f(37.7, 11.3)),
      );
      let delta = offset + feature - local;
      let distance = dot(delta, delta);
      if (distance < nearest) {
        second = nearest;
        nearest = distance;
      } else if (distance < second) {
        second = distance;
      }
    }
  }
  return sqrt(vec2f(nearest, second));
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
  // Single octave — a warp is a displacement, and extra octaves here only cost
  // fragments without changing the silhouette.
  let warp = vec2f(
    value_noise(centered * 0.85 + drift * 0.5),
    value_noise(centered * 0.85 + vec2f(5.2, 1.3) - drift * 0.4),
  );
  // Deliberately low frequency. The field is rasterized around 380px wide and
  // the compositor scales it up roughly four times, so only the broad shapes
  // survive the interpolation; anything finer would be paid for and thrown away.
  let warped = centered * 0.82 + (warp - vec2f(0.5)) * 1.05;

  let densityField = fbm(warped * 1.15 + drift * 0.25);
  let tintField = value_noise(warped * 0.85 - drift * 0.18 + vec2f(3.7, -1.1));

  let density = smoothstep(params.field.z, params.field.z + params.field.w, densityField);
  let tint = smoothstep(0.28, 0.74, tintField);

  // `brand-secondary-blue` is nearly black, so on its own it reads as a hole in
  // the layer rather than as a cool highlight. Lifting it a tenth of the way
  // toward the pink keeps it on-brand while letting it carry light.
  let color = mix(params.blue.rgb, params.pink.rgb, tint) + params.pink.rgb * 0.12 * (1.0 - tint);

  // The network is sampled through the *same* warped coordinate as the light,
  // so the cells inherit the flow field and come out as curved, stretched
  // shapes following the current rather than as flat convex polygons. That is
  // the difference between a network and a wireframe mesh. It drifts on its own
  // axis and faster, so the two layers slide across each other instead of
  // moving as one object.
  let cell = cellular(warped * params.net.z + drift * 0.9);
  let web = (1.0 - smoothstep(0.0, params.net.y, cell.y - cell.x)) * params.net.x;
  let node = 1.0 - smoothstep(0.0, params.net.w, cell.x);

  // A soft light that follows the pointer, and orbits on its own when there is
  // no pointer — so touch visitors and anyone who leaves the cursor parked
  // somewhere still get a moving light rather than a static frame.
  let lightDelta = (uv - params.light.xy) * aspect;
  let lightFall = exp(-dot(lightDelta, lightDelta) / max(params.light.w * params.light.w, 1e-4));

  // The calm ellipse tracks the headline: offset left when the copy is beside
  // the stat cards, centred and wider when the hero stacks. Looser than a pure
  // legibility mask, because the network is the thing being protected here and
  // clipping it to nothing would cost the layer its motif.
  let wide = step(1.25, aspect.x / max(aspect.y, 0.001));
  let calmCenter = mix(vec2f(0.5, 0.44), vec2f(0.37, 0.47), wide);
  let calmRadius = mix(vec2f(0.66, 0.32), vec2f(0.47, 0.4), wide);
  let calmDistance = length((uv - calmCenter) / calmRadius);
  let calm = smoothstep(0.4, 1.05, calmDistance);

  // Fade at the left and right so the layer never shows a seam against the page.
  let sideFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x);
  // UV origin is top-left, so `uv.y` grows downward. The top fade is small and
  // sits behind the opaque navigation bar; it only exists so the layer would
  // still not start at a hard edge if that bar were ever made translucent.
  let topFade = smoothstep(0.0, 0.1, uv.y);
  // The bottom fade is the one that matters: it tracks the lengthened CSS
  // gradient under the photograph, so the picture, the field and the page
  // background all reach solid over the same span, instead of the aura cutting
  // out early and leaving a visible band where it stopped.
  let baseFade = 1.0 - smoothstep(0.6, 1.0, uv.y);
  let presence = calm * sideFade * topFade * baseFade;

  // A very slow luminance breath, 30s per cycle, so the layer never looks
  // frozen on a long dwell.
  let breath = 0.88 + 0.12 * sin(time * 0.21);

  // The light lifts the glow around it and reveals the network it passes over,
  // which is what makes moving the cursor feel like it is doing something.
  let reveal = 1.0 + lightFall * params.light.z * 2.4;
  let illumination = density * reveal
    + web * (0.45 + lightFall * params.light.z * 2.0)
    + node * (0.5 + lightFall * params.light.z * 1.5);

  // Filaments read as light only if they are lighter than the wash behind them,
  // so the network is mixed toward white rather than tinted like the field.
  let lit = mix(color, vec3f(1.0), 0.28);
  let litColor = mix(color, lit, clamp(web * 2.2 + node * 1.6, 0.0, 1.0));

  var alpha = illumination * presence * breath * params.pink.w;

  let dimensions = textureDimensions(blueNoiseTexture);
  let pixel = vec2u(clamp(uv * vec2f(dimensions), vec2f(0.0), vec2f(dimensions) - vec2f(1.0)));
  let seed = vec2u(u32(params.field.y) * 37u + 11u, u32(params.field.y) * 23u + 5u);
  let noise = textureLoad(blueNoiseTexture, vec2i((pixel * vec2u(3u, 5u) + seed) & vec2u(127u)), 0).r;
  alpha = clamp(alpha + (noise - 0.5) * (2.0 / 255.0), 0.0, 1.0);

  // Pre-scaled, to match the premultiplied surface the canvas is configured with.
  return vec4f(litColor * alpha, alpha);
}
