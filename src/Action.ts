import {makeId} from './generate';
/**
 * Perform actions on cue
 * 
 * @param asynchWait - milliseconds wait during asynch processing, default is 
 * 
 */
export class Action {

    private acts: {[k: string]: Function} = {};
    private actionObj: any | null = null;
    private asyncWait: number = 0;

    constructor (asyncWait?:number) {
        if (asyncWait) { 
            asyncWait = asyncWait;
        }
    }
    /**
     * Add a function to a list of acts to be called during the perform 
     * 
     * @param actionFunc - a function
     * @returns the token of this act, save for cancel
     */
    public act  (actionFunc: Function) : string{
        let token = makeId(10);
        this.acts[token] = actionFunc;
        return token;
    }
    /**
     * Add a funcution to the list of acts to be called during the perform
     * but call the function immediately if perform has already been invoked.
     * 
     * @param actionFunc - a function
     * @returns the token of the this actor, save for cancel
     */
    public react (actionFunc: Function) : string {
        if (this.actionObj) {
            actionFunc(this.actionObj);
        }

        return this.act(actionFunc);
    }
    /**
     * Remove an act from the list of acts, will no longer be called during perform
     * 
     * @param token - the token returned from actor or react 
     * @returns true if canceled, false if token not found
     */
    public cancel (token: string) {
    
        if (this.acts[token]) {
            delete this.acts[token];
            return true;
        }
        return false;
    }
    /**
     * Run functions in the list of acts using the passed in object as parameters.
     * 
     * @param actionObj - an object containing the parameters to be passed to the acts.
     */
    public perform (actionObj?: any | null) {
        let here = this;
        this.actionObj = actionObj || {};
        Object.values(this.acts).forEach( function (item) {
            if (here.asyncWait) {
                setTimeout((function () {
                    return function () {
                        item(actionObj);
                    };
                })(), here.asyncWait);
            } else {
                item(actionObj);
            }            
        });
    }

}