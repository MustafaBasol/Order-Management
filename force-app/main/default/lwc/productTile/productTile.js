import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';


/**
 * A presentation component to display a Product__c sObject. The provided
 * Product__c data must contain all fields used by this component.
 */
export default class ProductTile extends NavigationMixin(LightningElement) {
    /** Whether the tile is draggable. */
    @api draggable;

    @api productinfo = {};
    @api quantity = 1;

    /** Product__c to display. */
    /*
    @api
    get product() {
        return this._product;
    }
    set product(value) {
        this._product = value;
        this.pictureUrl = value.Picture_URL__c;
        this.name = value.Name;
       // this.msrp = value.MSRP__c;
    }

    /** Product__c field values to display. 
    pictureUrl;
    name;
    msrp;
*/  
    connectedCallback(){
        console.log('ProductInfo : ' + JSON.stringify(this.productinfo));
    }
  
    handleProductClick(event) {

    }

    handleQuantityOnChange(event){
        this.quantity = event.target.valueAsNumber;
        console.log('new quantity: ' + this.quantity);
    }

    handleDecreaseClick(event){
        if (this.quantity > 1){
            this.quantity -= 1; 
            console.log('new quantity: ' + this.quantity);
        }
    }

    handleIncreaseClick(event){
        if (this.quantity < 100){
            this.quantity += 1; 
            console.log('new quantity: ' + this.quantity);
        }
    }
}