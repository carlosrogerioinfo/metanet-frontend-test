import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { LocalStorageUtils } from "./localstorage";

@Injectable()
export class HelperUtils {

  constructor(private storage: LocalStorageUtils) { }

  public showNotification(title: string, msg: string) {
    Swal.fire({
        title: title,
        text: msg,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
    });
  }

  public verifyErrorRedirection(errors: any) {

    errors.forEach(element => {

      if (element.message.indexOf( '401' ) >= 0 || element.message.indexOf( '403' ) >= 0){
        this.storage.clearAllUserDataLocalStorage();
      }

    });
  }

  public groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });

    return map;

  }
}

