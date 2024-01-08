#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(1., 0., 0.);
vec3 colorB = vec3(1., 1., 0.);
vec3 colorC = vec3(0., 1., 0.);
vec3 colorD = vec3(0., 1., 1.);
vec3 colorE = vec3(0., 0., 1.);
vec3 colorF = vec3(1., 0., 1.);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.);

    vec3 pct = vec3(fract(st.x * 5.));

    color = st.x > .8 ? mix(colorE, colorF, pct) : st.x > .6 ? mix(colorD, colorE, pct) : st.x > .4 ? mix(colorC, colorD, pct) : st.x > .2 ? mix(colorB, colorC, pct) : st.x > 0. ? mix(colorA, colorB, pct) : color;

    gl_FragColor = vec4(color, 1.);
}
