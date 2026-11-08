import {Group,Vector3} from 'three';
import {axisVector,orbitPosition} from '../science/earth';
export function earthFrame(){
 const root=new Group(),tilted=new Group();
 const axis=new Vector3(...axisVector());
 tilted.quaternion.setFromUnitVectors(new Vector3(0,1,0),axis);
 root.add(tilted);
 return {root,tilted,axis,move(day:number){root.position.set(...orbitPosition(day));root.updateMatrixWorld(true);}};
}
