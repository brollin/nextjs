// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 circle(vec2 center, float r) {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float pct = 1. - smoothstep(r - 0.002, r + 0.002, distance(st, center));
    return vec3(pct);
}

/* Easing Bounce InOut equation */
/* Adapted from Robert Penner easing equations */
float easeBounceOut(float t) {
    if (t < (1.0 / 2.75)) {
        return (7.5625 * t * t);
    } else if (t < (2.0 / 2.75)) {
        return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
    } else if (t < (2.5 / 2.75)) {
        return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
    } else {
        return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
    }
}
float easeBounceIn(float t) {
    return 1.0 - easeBounceOut(1.0 - t);
}
float easeBounceInOut(float t) {
    if (t < 0.5)
        return easeBounceIn(t * 2.0) * 0.5;
    else
        return easeBounceOut(t * 2.0 - 1.0) * 0.5 + 0.5;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float pct = 0.0;

    // a. The DISTANCE from the pixel to the center
    pct = distance(st, vec2(0.5));

    // b. The LENGTH of the vector
    //    from the pixel to the center
    vec2 toCenter = vec2(0.5) - st;
    pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    vec2 tC = vec2(0.5) - st;
    pct = sqrt(tC.x * tC.x + tC.y * tC.y);

    vec3 color = circle(vec2(0.5), 0.1 + 0.01 * easeBounceIn(sin(u_time * 5.))) * vec3(1.0, 0.0, 0.0) +
        circle(vec2(0.1), 0.05 + 0.001 * easeBounceIn(sin(u_time * 6.))) * vec3(1.0, 0.0, 0.0) +
        circle(vec2(0.9), 0.05 + 0.001 * easeBounceIn(sin(u_time * 7.))) * vec3(1.0, 0.0, 0.0);
    // vec3 color = vec3(1. - smoothstep(0.3999, 0.4, pct));

    gl_FragColor = vec4(color, 1.0);
}
