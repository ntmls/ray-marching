import * as chai from 'chai';
import { Point2, Vector2 } from '../src/Domain/Geometry2.';

const expect = chai.expect; 
describe('Point2', () => {

  it('should have componentCount of 2' , () => {
    var p = new Point2(1, 2);
    expect(p.componentCount).to.be.equal(2);
  });

  it('should have components 0 and 1' , () => {
    var p = new Point2(1, 2);
    expect(p.component(0)).to.be.equal(1);
    expect(p.component(1)).to.be.equal(2);
    expect(p.component.bind(3)).to.throw(Error, 'Invalid component index.'); 
  });

  it('should support "minus" operation' , () => {
    var p1 = new Point2(4, 5);
    var p2 = new Point2(1, 3);
    var actual = p1.minus(p2); 
    expect(actual.x).to.be.equal(3); 
    expect(actual.y).to.be.equal(2); 
  });

  it('should support "plus" operation' , () => {
    var p = new Point2(4, 5);
    var v = new Vector2(1, 3);
    var actual = p.plus(v); 
    expect(actual.x).to.be.equal(5); 
    expect(actual.y).to.be.equal(8); 
  });

  it('should support "distanceFrom" operation' , () => {
    var p1 = new Point2(4, 5);
    var p2 = new Point2(1, 3);
    var actual = p1.distanceFrom(p2);
    expect(actual).to.be.closeTo(3.605551275463989, .00001); 
  });

  it('should support "distanceFromSquared" operation' , () => {
    var p1 = new Point2(4, 5);
    var p2 = new Point2(1, 3);
    var distance = p1.distanceFrom(p2);
    var actual = p1.distanceFromSquared(p2); 
    expect(actual).to.be.closeTo(distance * distance, .00001); 
  });

  it('should support "max" operation' , () => {
    var p1 = new Point2(-4, 5);
    var p2 = new Point2(1, 3);
    var actual = p1.max(p2);
    expect(actual.x).to.be.equal(1); 
    expect(actual.y).to.be.equal(5); 
  });

  it('should support "min" operation' , () => {
    var p1 = new Point2(-4, 5);
    var p2 = new Point2(1, 3);
    var actual = p1.min(p2);
    expect(actual.x).to.be.equal(-4); 
    expect(actual.y).to.be.equal(3); 
  });

  it('should support "floor" operation' , () => {
    var p = new Point2(1.123, 2.567);
    var actual = p.floor(); 
    expect(actual.x).to.be.equal(1);
    expect(actual.y).to.be.equal(2);
  });

  it('should support "fractional" operation' , () => {
    var p = new Point2(1.123, 2.567);
    var actual = p.fractional(); 
    expect(actual.x).to.be.closeTo(.123, .00001);
    expect(actual.y).to.be.closeTo(.567, .00001);
  });

  it('should support "lerp" operation' , () => {
    var p1 = new Point2(-4, 5);
    var p2 = new Point2(1, 3);
    var actual = p1.lerp(p2, .25);
    expect(actual.x).to.be.equal(-2.75); 
    expect(actual.y).to.be.equal(4.5); 
  });

});