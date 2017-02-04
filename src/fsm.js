class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.initial = config.initial;
        this.states = config.states;
        this.currentState = this.initial;
        this.history = [this.initial];
        this.step = 0;
    }
    /**
     * Returns active state.
     * @returns {String}
     */
    getState(){
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.states[state])  throw new SyntaxError ("there is no state");

        if (!this.history[this.step+1] && this.history[this.step] !== state) {
            this.step++;
            this.history.push(state);
        }
        if (this.history[this.step+1] === state) ++this.step;
        this.currentState = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let state = this.states[this.currentState];
        if (!state.transitions[event])  throw new SyntaxError ("there is no state");
        this.history.splice(this.step+1);
        this.changeState(state.transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let tempArr = Object.keys(this.states),
            states = this.states;
        if (!event) {
            return tempArr;
        } else {
            let arr = [];
            for (let i = 0; i < tempArr.length ; i++ ) {
                for (let key in states[tempArr[i]].transitions){
                    if (key === event) arr.push(tempArr[i]);
                }
            }
            return arr;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.step) {
            --this.step;
            this.changeState(this.history[this.step]);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.step === this.history.length-1) {
            return false;
        } else {
            ++this.step;
            this.changeState(this.history[this.step]);
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.currentState];
        this.step = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/


