// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 box(in float l, in float r, in float t, in float b) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // bottom-left
    vec2 bl = step(vec2(l, b), st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(r, t), 1.0 - st);
    pct *= tr.x * tr.y;

    return vec3(pct);
}

vec3 outline(in float l, in float r, in float t, in float b, in float w) {
    vec3 outer = box(l, r, t, b);
    vec3 inner = box(l + w, r + w, t + w, b + w);

    return vec3(outer - inner);
}

vec3 box2(in float x, in float y, in float w, in float h) {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // bottom-left
    vec2 bl = step(vec2(x, y), st);
    float pct = bl.x * bl.y;

    // top-right
    vec2 tr = vec2(1.) - step(vec2(x + w, y + h), st);
    pct *= tr.x * tr.y;

    return vec3(pct);
}

void main() {
    vec3 color = box2(0.1, 0.1, 0.8, 0.8);

    gl_FragColor = vec4(color, 1.0);
}
