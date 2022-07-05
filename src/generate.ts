    /**
     * Generate a random id
     * 
     * @param numchar - length of generated id, default is 5  
     * @returns an id of the specified length
     * 
     */
    export function makeId(numchar : number) : string {

        let text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        if (!numchar) numchar = 5;

        for (var i = 0; i < numchar; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    /**
     * Generate a random number
     * 
     * @param numdigits - number of digits in the number, default is 6
     * @returns a number of the specified number of digits
     * 
     */
    export function makeNumber (numdigits : number) : number {

        var text = "",
            possible = "0123456789";

        if (!numdigits) numdigits = 6;

        for (var i = 0; i < numdigits; i++) {
            if (i === 0) {
                text += possible.charAt(Math.floor(Math.random() * (possible.length - 1)) + 1); //so zero isn't the first char
            } else {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        }
        return parseInt(text, 10);
    }
    /**
     * Generate a random GUID
     * 
     * @returns a GUID in the form XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     * 
     */
    export function makeGUID () : string {

        var text = "",
            possible = "0123456789abcdef";

        for (var i = 0; i < 36; i++) {
            switch (i) {
                case 8:
                case 13:
                case 18:
                case 23:
                    text += '-';
                    break;
                default:
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                    break;
            }
        }

        return text;
    }
