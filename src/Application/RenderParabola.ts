import { Function2d, Vector2 } from "../Domain/Geometry2.";
import { Render2dFunction } from "./Render2dFunction";

export class RenderParabola extends Render2dFunction {
    createFunction(): Function2d {
        return new Parabola();  
    }
}

class Parabola implements Function2d {

    eval(vector: Vector2): number {
        const a = Math.abs(vector.x);
        const b = vector.y; 
        var isInCurve: boolean = false; 
        if (a * a <= b) {
            isInCurve = true; 
        }
        const root = this.solveRoot(a, b, isInCurve); 
        const dx = root - a;
        const dy = root * root - b;
        const dist = Math.sqrt(dx * dx + dy * dy); 
        if (isInCurve) return -dist; 
        return dist;
    }

    solveRoot(x: number, y: number, isInCurve: boolean): number {
        var left: number = 0; 
        var leftValue: number;
        var right: number;
        var rightValue: number; 
        var middle: number = 0;
        var middleValue: number = 0; 
        var counter = 0; 

        const q = 1 + -2*y; // pre-compute for performance
        const a = x; 

        if (isInCurve) {
            right = Math.max(y, 2); // root should always be less than the height of our point
        } else {
            right = x; // root should always be less than a
        }
        leftValue = this.calcDerivative(left, q, a)
        rightValue = this.calcDerivative(right, q, a); 
        while (right - left > .001 && counter < 20) {
            middle = (left + right) / 2;
            middleValue = this.calcDerivative(middle, q, a); 
            if (leftValue < 0 && middleValue < 0 && rightValue > 0) {
                leftValue = middleValue; 
                left = middle; 
            } else if (leftValue < 0 && middleValue > 0 && rightValue > 0) {
                rightValue = middleValue; 
                right = middle; 
            }
            counter++; 
        }
        return right; //middle might be a better guess but error on the right being this is an sdf and we don't want to cut into the surface
    }

    private calcDerivative(x: number, q: number, a: number) {
        // y = x * x
        //return x * x;

        // dSquared = (x - a)^2 + (y - b)^2 
        // note: two unknowns x and y

        // substitute y so we only have x unknown
        // dSquared = (x - a)^2 + (x*x - b)^2 

        // expand powers
        // dSquared = (x - a)(x - a) + (x*x - b)(x*x - b)

        // get rid of subtraction
        // dSquared = (x + -a)(x + -a) + (x*x + -b)(x*x + -b)

        // foil first term
        // dSquared = x*x + -a*x + -a*x + -a*-a + (x*x + -b)(x*x + -b)
        //return x*x + -a*x + -a*x + -a*-a + (x*x + -b)*(x*x + -b)

        // simplify first term
        // dSquared = x*x + -2ax + a*a + (x*x + -b)(x*x + -b)
        // return  x*x + -2*a*x + a*a + (x*x + -b)*(x*x + -b)

        // foil second term
        // dSquared = x*x + -2ax + a*a + x*x*x*x + x*x*-b + -b*x*x + -b*-b

        // simplify second term
        // dSquared = x*x + -2ax + a*a + x*x*x*x + -2b*x*x + b*b
        //return x*x + -2*a*x + a*a + x*x*x*x + -2*b*x*x + b*b;

        // find the derivative 
        // dSquared' = 2*x + -2*a + 4*x*x*x + -4*b*x
        // return 2*x + -2*a + 4*x*x*x + -4*b*x;

        // rearrange
        //return 4*x*x*x + 2*x + -4*b*x + -2*a; 

        // factor out a 2
        //return 2*x*x*x + x + -2*b*x + -a; 

        // combine the x terms
        //return 2*x*x*x + (1 + -2*b)*x + -a; 

        // introduce new variable
        //var q = (1 + -2*b); 
        var t = Math.abs(x);
        return 2 * t * t * t + q * t + -a;
    }
}