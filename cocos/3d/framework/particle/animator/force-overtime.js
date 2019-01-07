import { vec3, quat, pseudoRandom } from '../../../../core/vmath';
import { calculateTransform, Space } from '../particle-general-function';
import CurveRange from './curve-range';
import { CCClass } from '../../../../core/data';

const FORCE_OVERTIME_RAND_OFFSET = 212165;

export default class ForceOvertimeModule {

    enable = false;

    x = null;

    y = null;

    z = null;

    space = Space.Local;

    // TODO:currently not supported
    randomized = false;

    constructor() {
        this.rotation = quat.create();
    }

    update(space, worldTransform) {
        this.needTransform = calculateTransform(space, this._space, worldTransform, this.rotation);
    }

    animate(p, dt) {
        let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        let force = vec3.create(this.x.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, pseudoRandom(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)));
        if (this.needTransform) {
            vec3.transformQuat(force, force, this.rotation);
        }
        vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
    }
}

CCClass.fastDefine('cc.ForceOvertimeModule',ForceOvertimeModule,{
    enable : false,
    x : new CurveRange(),
    y : new CurveRange(),
    z : new CurveRange(),
    space : Space.Local,
    randomized : false
});