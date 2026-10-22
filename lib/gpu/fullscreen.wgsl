// Shared fullscreen-triangle vertex stage for every fragment shader in the site.
//
// Three vertices generated from `vertex_index` cover the viewport with no
// diagonal seam, which costs one fewer vertex than a quad and avoids the quad's
// duplicated-pixel overdraw along that seam. UVs are authored with a top-left
// origin, which is the convention every fragment shader here assumes.
//
// This is a WGSL module rather than a string concatenated at runtime: importing
// it keeps each shader a plain static import, so `@vgpu/wgsl` prepares and
// reflects it at build time (vgpu 0.6 only accepts prepared `ShaderSource`
// objects) and the browser never downloads or runs the WGSL parser.
//
// Import it as `import { vs_main } from "../../lib/gpu/fullscreen.wgsl";`.
export struct FullscreenOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

export @vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> FullscreenOut {
  let positions = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  let uvs = array<vec2f, 3>(vec2f(0.0, 1.0), vec2f(2.0, 1.0), vec2f(0.0, -1.0));
  var output: FullscreenOut;
  output.position = vec4f(positions[vertexIndex], 0.0, 1.0);
  output.uv = uvs[vertexIndex];
  return output;
}
