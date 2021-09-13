import * as chai from 'chai';
import { Vector3 } from '../src/Domain/3d/Vector3';

const expect = chai.expect; 
describe('Vector3', () => {

  it('should calculate magnitude' , () => {
    var v = new Vector3(1, 1, 1);
    expect(v.magnitude).to.be.closeTo(1.7320508075688772, .00001);
  });

  it('should have normalized vector with magnitude of 1' , () => {
    var v = new Vector3(1, 1, 1);
    expect(v.normalize().magnitude).to.be.closeTo(1, .00001);
  });

});