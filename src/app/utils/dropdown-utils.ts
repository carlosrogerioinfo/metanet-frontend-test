import { KeyValueComponent } from "../models/keyValue";

export class DropdownUtils {

    public static InitializeSaleStatus() : KeyValueComponent[] {

        return [
            {id: 1, name: 'Aberto'},
            {id: 2, name: 'Fechado'},
            {id: 3, name: 'Cancelado'},
        ];
    };

}

