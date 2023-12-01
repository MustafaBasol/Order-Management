// productCarousel.js
import { LightningElement, api, wire } from 'lwc';
import getProductImages from '@salesforce/apex/ProductController.getAllRelatedImages';

export default class ProductCarousel extends LightningElement {
    @api recordId;
    productImages = [];

    @wire(getProductImages, { recordId: '$recordId' })
    wiredImages({ error, data }) {
        if (data) {
            this.productImages = data;
        } else if (error) {
            console.error('Error retrieving product images', error);
        }
    }
}
