import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from 'rxjs';


/**
    REVIEW: AbstractControl

    It provides some of the shared behavior that all controls and groups of controls have, like running validators, calculating status, and resetting state. It also defines the properties that are shared between all sub-classes, like value, valid, and dirty. It shouldn't be instantiated directly.

    Ref: https://docs.angular.lat/api/forms/AbstractControl
 */


export const mimeType = ( control: AbstractControl
): Promise<{ [key: string]: any } | null> | Observable<{ [key: string]: any } | null> => {

    if ( typeof(control.value) === 'string' ) {
        return of(null);
    }

    const file = control.value as File;
    const fileReader = new FileReader();

    const frObs = new Observable((observer: Observer<{ [key: string]: any } | null>) => {

        fileReader.addEventListener('loadend', () => {
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = '';
            let isValid = false;
            for(let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false; // Or you can use the blob.type as fallback
                    break;
            }

            if ( isValid ) { 
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }

            observer.complete();
        });

        /**
            REVIEW: FileReader.readAsArrayBuffer()

            The FileReader interface's readAsArrayBuffer() method is used to start reading the contents of a specified Blob or File. When the read operation is finished, the readyState becomes DONE, and the loadend is triggered. At that time, the result attribute contains an ArrayBuffer representing the file's data.

            Ref: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer
         */
        fileReader.readAsArrayBuffer(file);
    });
    
    return frObs;
} 