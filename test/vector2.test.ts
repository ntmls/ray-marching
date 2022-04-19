import * as chai from 'chai';
import { Vector2 } from '../src/Domain/Geometry2.';

const expect = chai.expect; 
describe('Vector2', () => {

  it('should calculate magnitude' , () => {
    var v = new Vector2(1, 1);
    expect(v.magnitude).to.be.closeTo(1.4142135623730951, .00001);
  });

  it('should have normalized vector with magnitude of 1' , () => {
    var v = new Vector2(1, 1);
    expect(v.normalize().magnitude).to.be.closeTo(1, .00001);
  });

});