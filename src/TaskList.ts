import {Action} from './Action' 
/**
 * Task container
 * 
 * @param task - function to be executed
 * @param argsObj - an object containing appropriate arguments for the function
 */
export class Task {
    private emptyArgs: string = "!*@&#^$";
    private task: Function;
    private argsObj: object | string = this.emptyArgs;
    
    constructor (task: Function, argsObj?: any | null) {
        this.task = task;
        if (argsObj) {
            this.argsObj = argsObj;
        }
    }
    /**
     * Run the task
     * 
     */
    public run () {
        if (this.argsObj !== this.emptyArgs) {
            this.task(this.argsObj);
        } else {
            this.task();
        }
    }
}
/**
 * A list of tasks to be run asynchronously
 * 
 * @param wait - milliseconds wait between tasks being run, default is 1
 */
export class TaskList {
    private list: Task[] = [];
    private emptyArgs = "!*@&#^$";
    private started = false;
    private tasked = 0;
    /**
     * Action performed when a task has been executed
     */
    public progress = new Action();
    /**
     * Action performed when an invalid task is queued
     */
    public invalid = new Action();
    /**
     * Action performed when the task list is emptied
     */
    public listEmpty = new Action();

    private wait = 1;

    constructor(wait?: number) {
        if (wait) {
            this.wait = wait;
        }

    }
    /**
     * Add a task to the list 
     * 
     * @param task - function to be executed
     * @param argsObj - an object containing appropriate arguments for the function
     */
    public queue (task: Function, argsObj?: any | null) {

        if (task && typeof (task) === "function") {
            if (!argsObj) {
                argsObj = this.emptyArgs;
            }
            this.list.push(new Task(task, argsObj));
            if (!this.started) {
                this.started = true;
                setTimeout(this.execute.bind(this), this.wait);
            }

        }
        else {
            this.invalid.perform({ task: task });
        }

    }
    /**
     * Run the next task
     */
    private execute() {
        if (this.list.length > 0) {

            let task = this.list.shift();
            if (task) {

                    task.run();

                    this.tasked++;
                    this.progress.perform({ tasked: this.tasked, task: task });

            }
            if (this.list.length === 0) {
                this.started = false;
                this.listEmpty.perform();
            }
            else {

                setTimeout(this.execute.bind(this), this.wait);
            }
        }

    }

}