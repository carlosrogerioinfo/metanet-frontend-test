import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'PDV',
                items: [
                    { label: 'Produtos', icon: 'pi pi-fw pi-database', routerLink: ['/product'] },
                    { label: 'Vendas', icon: 'pi pi-fw pi-database', routerLink: ['/sale'] },
                    { label: 'Histórico de vendas', icon: 'pi pi-fw pi-database', routerLink: ['/sale-history'] },
                ]
            },
            {
                label: 'Sessão',
                items: [
                    { label: 'Finalizar sessão', icon: 'pi pi-power-off', routerLink: ['/login'] },
                ]
            },
        ];
    }
}
