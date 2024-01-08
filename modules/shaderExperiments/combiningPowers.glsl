#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Reference to
// http://thndl.com/square-shaped-shaders.html

vec3 polygon(vec2 st, int corners) {
    // Angle and radius from the current pixel
    float a = atan(st.x, st.y) + PI;
    float r = TWO_PI / float(corners);

    // Shaping function that modulate the distance
    float d = cos(floor(.5 + a / r) * r - a) * length(st);

    return vec3(1.0 - smoothstep(.4, .41, d));
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // st.x *= u_resolution.x / u_resolution.y;

    // Remap the space to -1. to 1.
    st = st * 2. - 1.;

    vec3 color = min(polygon(st, 5), polygon(st, 3));
    gl_FragColor = vec4(color, 1.0);
}
