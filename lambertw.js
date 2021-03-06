
const GSL_DBL_EPSILON = 2.2204460492503131e-16;

function halley_iteration(x, w_initial, MAX_ITERATIONS) {
    let w = w_initial,
        i;
    for (i = 0; i < MAX_ITERATIONS; i++) {
        let tol;
        let e = Math.exp(w);
        let p = w + 1.0;
        let t = w * e - x;
        if (w > 0) {
            t = t / p / e;
        } else {
            t /= e * p - 0.5 * (p + 1.0) * t / p;
        }
        w -= t;
        tol = GSL_DBL_EPSILON * Math.max(Math.abs(w), 1.0 / (Math.abs(p) * e));
        if (Math.abs(t) < tol) {
            return {
                value: w,
                error: 2.0 * tol,
                iters: i,
                success: true,
            };
        }
    }
    return {
        value: w,
        error: Math.abs(w),
        iters: i,
        success: false,
    };
}
function series_eval(r) {
    const c = [
        -1.0,
        2.331643981597124203363536062168,
        -1.812187885639363490240191647568,
        1.936631114492359755363277457668,
        -2.353551201881614516821543561516,
        3.066858901050631912893148922704,
        -4.17533560025817713885498417746,
        5.858023729874774148815053846119,
        -8.401032217523977370984161688514,
        12.250753501314460424,
        -18.100697012472442755,
        27.02904479901056165,
    ];
    const t_8 = c[8] + r * (c[9] + r * (c[10] + r * c[11]));
    const t_5 = c[5] + r * (c[6] + r * (c[7] + r * t_8));
    const t_1 = c[1] + r * (c[2] + r * (c[3] + r * (c[4] + r * t_5)));
    return c[0] + r * t_1;
}
function lambert_W0_e(x) {
    const one_over_E = 1.0 / Math.E;
    const q = x + one_over_E;
    let result = {};
    if (x == 0.0) {
        result.value = 0.0;
        result.error = 0.0;
        result.success = true;
        return result;
    } else if (q < 0.0) {
        result.value = -1.0;
        result.error = Math.sqrt(-q);
        result.success = false;
        return result;
    } else if (q == 0.0) {
        result.value = -1.0;
        result.error = GSL_DBL_EPSILON;
        result.success = true;
        return result;
    } else if (q < 1.0e-3) {
        const r = Math.sqrt(q);
        result.value = series_eval(r);
        result.error = 2.0 * GSL_DBL_EPSILON * Math.abs(result.value);
        result.success = true;
        return result;
    } else {
        const MAX_ITERATIONS = 100;
        let w;
        if (x < 1.0) {
            const p = Math.sqrt(2.0 * Math.E * q);
            w = -1.0 + p * (1.0 + p * (-1.0 / 3.0 + p * 11.0 / 72.0));
        } else {
            w = Math.log(x);
            if (x > 3.0) w -= Math.log(w);
        }
        return halley_iteration(x, w, MAX_ITERATIONS, result);
    }
}

function lambert_Wm1_e(x) {
    let result = {};
    if (x > 0.0) {
        return lambert_W0_e(x);
    } else if (x == 0.0) {
        result.value = 0.0;
        result.error = 0.0;
        result.success = true;
        return result;
    } else {
        const MAX_ITERATIONS = 32;
        const one_over_E = 1.0 / Math.E;
        const q = x + one_over_E;
        let w;
        if (q < 0.0) {
            result.value = -1.0;
            result.error = Math.sqrt(-q);
            result.success = false;
            return result;
        }
        if (x < -1.0e-6) {
            const r = -Math.sqrt(q);
            w = series_eval(r);
            if (q < 3.0e-3) {
                result.value = w;
                result.error = 5.0 * GSL_DBL_EPSILON * Math.abs(w);
                result.success = true;
                return result;
            }
        } else {
            const L_1 = Math.log(-x);
            const L_2 = Math.log(-L_1);
            w = L_1 - L_2 + L_2 / L_1;
        }
        return halley_iteration(x, w, MAX_ITERATIONS);
    }
}

function lambert_W0(x) {
    return lambert_W0_e(x).value;
}

function lambert_Wm1(x) {
    return lambert_Wm1_e(x).value;
}
if (typeof module !== "undefined") {
    module.exports = {
        halley_iteration: halley_iteration,
        lambert_W0: lambert_W0,
        lambert_Wm1: lambert_Wm1,
        lambert_W0_e: lambert_W0_e,
        lambert_Wm1_e: lambert_Wm1_e,
    };
}