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

    color = (step(0., st.x) - step(.25, st.x)) * colorA +
        (step(.25, st.x) - step(.5, st.x)) * colorB +
        (step(.5, st.x) - step(.75, st.x)) * colorC +
        (step(.75, st.x) - step(1., st.x)) * colorD;

    // st.x>.75?colorE:
    // st.x>.5?colorD:
    // st.x>.25?colorB:
    // st.x>0.?colorA:
    // color;

    gl_FragColor = vec4(color, 1.);
}
