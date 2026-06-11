/**
 * Reusable GLSL chunks.
 *
 * Variant shaders import and concatenate these instead of re-implementing
 * noise/fresnel/etc. Keep each chunk self-contained (no external uniforms) so
 * they compose freely. Prefix helper functions with `o3s_` to avoid name
 * collisions when several chunks land in the same shader.
 */

/** Classic 2D simplex-ish noise (Ashima). Returns ~[-1, 1]. */
export const snoise2D = /* glsl */ `
  vec3 o3s_permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float o3s_snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = o3s_permute(o3s_permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
`

/** Fresnel rim term. Call o3s_fresnel(normal, viewDir, power). */
export const fresnel = /* glsl */ `
  float o3s_fresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(1.0 - clamp(dot(normalize(normal), normalize(viewDir)), 0.0, 1.0), power);
  }
`

/** Cheap hash for dithering / sparks. */
export const hash = /* glsl */ `
  float o3s_hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
`

/** Convert HSV→RGB (handy for thermal / iridescent ramps). */
export const hsv2rgb = /* glsl */ `
  vec3 o3s_hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
`
